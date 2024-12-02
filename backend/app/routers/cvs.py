from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from app.database import get_snowflake_connection
from app.services.ia_smart_recruit import IASmartRecruit
from datetime import datetime
import os
import shutil

router = APIRouter()

UPLOAD_DIRECTORY = "./uploads/cvs"  # Directorio donde se almacenarán los CVs
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)  # Crear el directorio si no existe
#valida si el usuario ya tiene cargado un CV
@router.get("/check_cv")
def check_cv(utilisateur_id: int):
    """
    Vérifiez si un utilisateur a un CV téléchargé.
    """
    conn = get_snowflake_connection()
    try:
        cursor = conn.cursor()
        query = """
        SELECT COUNT(*)
        FROM SMARTRECRUIT_DB.SMARTRECRUIT_SCHEMA.CVS
        WHERE UTILISATEUR_ID = %s
        """
        cursor.execute(query, (utilisateur_id,))
        result = cursor.fetchone()
        if result and result[0] > 0:
            return {"has_cv": True}
        return {"has_cv": False}
    finally:
        conn.close()

#modifica el cvs
@router.post("/update-cv")
def update_cv(
    utilisateur_id: int = Form(...),
    file: UploadFile = File(...),
):
    """
    Endpoint pour mettre à jour ou télécharger un CV pour un utilisateur spécifique.
    """
    # Validar el tipo de archivo
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Le fichier doit être un PDF.")

    conn = get_snowflake_connection()
    try:
        cursor = conn.cursor()

        # Verificar si el usuario ya tiene un CV cargado
        query_check = """
        SELECT URL_PDF
        FROM SMARTRECRUIT_DB.SMARTRECRUIT_SCHEMA.CVS
        WHERE UTILISATEUR_ID = %s
        """
        cursor.execute(query_check, (utilisateur_id,))
        result = cursor.fetchone()

        # Si ya existe un CV, eliminar el archivo viejo
        if result and result[0]:
            old_file_path = result[0]
            if os.path.exists(old_file_path):
                os.remove(old_file_path)

            # Actualizar la entrada existente en la base de datos
            file_path = os.path.join(UPLOAD_DIRECTORY, f"{utilisateur_id}_{file.filename}")
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            query_update = """
            UPDATE SMARTRECRUIT_DB.SMARTRECRUIT_SCHEMA.CVS
            SET URL_PDF = %s, DATE_TELECHARGEMENT = %s
            WHERE UTILISATEUR_ID = %s
            """
            cursor.execute(query_update, (file_path, datetime.utcnow(), utilisateur_id))
        else:
            # Si no existe, insertar una nueva entrada
            file_path = os.path.join(UPLOAD_DIRECTORY, f"{utilisateur_id}_{file.filename}")
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            query_insert = """
            INSERT INTO SMARTRECRUIT_DB.SMARTRECRUIT_SCHEMA.CVS (UTILISATEUR_ID, URL_PDF, DATE_TELECHARGEMENT)
            VALUES (%s, %s, %s)
            """
            cursor.execute(query_insert, (utilisateur_id, file_path, datetime.utcnow()))

        # Procesar habilidades con IA
        ia_smart_recruit = IASmartRecruit()
        skills_candidate = ia_smart_recruit.get_skills_from_candidate_cv(file_path)

        # Eliminar habilidades previas del usuario
        delete_skills_query = """
        DELETE FROM SMARTRECRUIT_DB.SMARTRECRUIT_SCHEMA.COMPETENCES_CANDIDATS
        WHERE UTILISATEUR_ID = %s
        """
        cursor.execute(delete_skills_query, (utilisateur_id,))

        # Insertar nuevas habilidades
        query_insert_skills = """
        INSERT INTO SMARTRECRUIT_DB.SMARTRECRUIT_SCHEMA.COMPETENCES_CANDIDATS (UTILISATEUR_ID, COMPETENCE, NIVEAU)
        VALUES (%s, %s, %s)
        """
        for skill in skills_candidate["skills"]:
            cursor.execute(query_insert_skills, (utilisateur_id, skill['skill'], skill['years']))

        conn.commit()

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur lors de la mise à jour du CV: {str(e)}")
    finally:
        conn.close()

    return {"message": "CV téléchargé avec succès.", "url": file_path}

#carga el cv por primera vez
@router.post("/upload-cv")
def upload_cv(
    utilisateur_id: int = Form(...),
    file: UploadFile = File(...),
):
    """
    Endpoint pour télécharger un CV pour un utilisateur spécifique.
    """
    # Validar el tipo de archivo
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Le fichier doit être un PDF.")

 # Verificar si el usuario ya tiene un CV cargado
    conn = get_snowflake_connection()
    try:
        cursor = conn.cursor()
        query_check = """
        SELECT COUNT(*)
        FROM SMARTRECRUIT_DB.SMARTRECRUIT_SCHEMA.CVS
        WHERE UTILISATEUR_ID = %s
        """
        cursor.execute(query_check, (utilisateur_id,))
        result = cursor.fetchone()
        if result and result[0] > 0:
            raise HTTPException(
                status_code=400,
                detail="Un CV existe déjà pour cet utilisateur. Supprimez l'ancien CV avant d'en ajouter un nouveau.",
            )
  # Guardar el archivo en el servidor
        file_path = os.path.join(UPLOAD_DIRECTORY, f"{utilisateur_id}_{file.filename}")
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        # Insertar información en la base de datos
        query_insert = """
        INSERT INTO SMARTRECRUIT_DB.SMARTRECRUIT_SCHEMA.CVS (UTILISATEUR_ID, URL_PDF, DATE_TELECHARGEMENT)
        VALUES (%s, %s, %s)
        """
        cursor.execute(query_insert, (utilisateur_id, file_path, datetime.utcnow()))
        conn.commit()
    finally:
        conn.close()
    return {"message": "CV téléchargé avec succès.", "url": file_path}

#descarga el cv
@router.get("/download-cv")
def download_cv(file_name: str):
    """
    Ruta para descargar un CV.
    """
    sanitized_file_name = file_name.replace("\\", "/")
    file_path = os.path.join(UPLOAD_DIRECTORY, sanitized_file_name.split("/")[-1])
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Fichier non trouvé")
    return FileResponse(file_path, media_type='application/pdf', filename=os.path.basename(file_path))