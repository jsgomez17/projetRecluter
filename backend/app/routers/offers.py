from fastapi import APIRouter, Depends
from app.database import get_snowflake_connection
from datetime import date
from typing import List
from app.schemas.offers import OfferResponse

router = APIRouter()

@router.get("/", response_model=List[OfferResponse])
def get_offers(profil_id: int, user_id: int):
    conn = get_snowflake_connection()
    try:
        cursor = conn.cursor()
        today = date.today()

        if profil_id == 1:  # Reclutador
            query = """
            SELECT o.id, o.nom_offert, o.nom_entreprise, o.adresse_entreprise, 
                   o.type_poste, o.salaire, o.description, 
                   o.date_debut, o.date_fin, o.date_creation
            FROM offres o
            INNER JOIN utilisateurs u ON o.recruteur_id = u.id
            WHERE u.id = %s AND o.date_fin >= %s;
            """
            cursor.execute(query, (user_id, today))
        else:  # Candidato
            query = """
            SELECT o.id, o.nom_offert, o.nom_entreprise, o.adresse_entreprise, 
                   o.type_poste, o.salaire, o.description, 
                   o.date_debut, o.date_fin, o.date_creation
            FROM offres o
            WHERE o.date_fin >= %s;
            """
            cursor.execute(query, (today,))

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
