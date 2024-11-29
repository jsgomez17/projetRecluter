from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.database import get_snowflake_connection
from datetime import datetime
import os
import shutil

router = APIRouter()

UPLOAD_DIRECTORY = "./uploads/cvs"  # Directorio donde se almacenarán los CVs
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)  # Crear el directorio si no existe

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