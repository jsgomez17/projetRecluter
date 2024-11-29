from fastapi import APIRouter, HTTPException
from app.database import get_snowflake_connection
from app.schemas.postulats import PostulatCreate, PostulatResponse
from app.schemas.offers import OfferResponse
from datetime import datetime
from typing import List

router = APIRouter()

@router.post("/postuler")
def postuler(postulat: PostulatCreate):
    conn = get_snowflake_connection()
    try:
        cursor = conn.cursor()
        
        # Insertar el registro en la tabla POSTULATS
        query = """
        INSERT INTO POSTULATS (CANDIDAT_ID, OFFRE_ID, LETTRE, DATE_POSTULATION)
        VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query, (postulat.candidat_id, postulat.offre_id, postulat.lettre, datetime.utcnow()))
        
        # Recuperar el último ID insertado usando una consulta
        last_id_query = """
        SELECT ID 
        FROM POSTULATS
        WHERE CANDIDAT_ID = %s AND OFFRE_ID = %s
        ORDER BY DATE_POSTULATION DESC
        LIMIT 1
        """
        cursor.execute(last_id_query, (postulat.candidat_id, postulat.offre_id))
        last_id = cursor.fetchone()

        if not last_id:
            raise HTTPException(status_code=400, detail="Erreur lors de la récupération de l'ID")

        return {"message": "Postulation enregistrée avec succès", "id": last_id[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la postulation: {str(e)}")
    finally:
        conn.close()

@router.get("/applications", response_model=List[OfferResponse])
def get_applications(candidat_id: int):
    """
    Obtenez les offres pour lesquelles un utilisateur a postulé.
    """
    conn = get_snowflake_connection()
    try:
        cursor = conn.cursor()
        query = """
        SELECT o.id, o.nom_offert, o.nom_entreprise, o.adresse_entreprise,
               o.type_poste, o.salaire, o.description,
               o.date_debut, o.date_fin, o.date_creation
        FROM offres o
        INNER JOIN postulats p ON o.id = p.offre_id
        WHERE p.candidat_id = %s
        """
        cursor.execute(query, (candidat_id,))
        results = cursor.fetchall()

        return [
            {
                "id": row[0],
                "nom_offert": row[1],
                "nom_entreprise": row[2],
                "adresse_entreprise": row[3],
                "type_poste": row[4],
                "salaire": row[5],
                "description": row[6],
                "date_debut": row[7],
                "date_fin": row[8],
                "date_creation": row[9],
            }
            for row in results
        ]
    finally:
        conn.close()
