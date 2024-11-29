from fastapi import APIRouter, Depends, HTTPException
from app.database import get_snowflake_connection
from datetime import date
from typing import List
from app.schemas.offers import OfferResponse, OfferCreate
from app.utils.auth import get_current_user

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
        

@router.get("/recommended", response_model=List[OfferResponse])
def get_recommended_offers(user_id: int):
    """
    Obtener ofertas recomendadas basadas en competencias del candidato.
    """
    conn = get_snowflake_connection()
    try:
        cursor = conn.cursor()
        query = """
        SELECT o.id, o.nom_offert, o.nom_entreprise, o.adresse_entreprise, 
               o.type_poste, o.salaire, o.description, 
               o.date_debut, o.date_fin, o.date_creation
        FROM offres o
        INNER JOIN competences_offres co ON co.offre_id = o.id
        INNER JOIN competences_candidats cc ON cc.competence = co.competence
        INNER JOIN utilisateurs u ON u.id = cc.utilisateur_id
        WHERE u.id = %s
        """
        cursor.execute(query, (user_id,))
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

@router.post("/", response_model=OfferResponse)
def create_offer(offer: OfferCreate):
    conn = get_snowflake_connection()
    try:
        cursor = conn.cursor()
        
        # Consulta para insertar una nueva oferta (sin RETURNING)
        insert_query = """
        INSERT INTO offres (nom_offert, nom_entreprise, adresse_entreprise, type_poste, salaire, description, date_debut, date_fin, recruteur_id, date_creation)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(
            insert_query,
            (
                offer.nom_offert,
                offer.nom_entreprise,
                offer.adresse_entreprise,
                offer.type_poste,
                offer.salaire,
                offer.description,
                offer.date_debut,
                offer.date_fin,
                offer.recruteur_id,
                date.today(),  # Fecha de creación
            ),
        )
        
        # Consulta para obtener la oferta creada basándose en los campos únicos
        select_query = """
        SELECT id, nom_offert, nom_entreprise, adresse_entreprise, type_poste, salaire, description, date_debut, date_fin, recruteur_id, date_creation
        FROM offres
        WHERE nom_offert = %s AND recruteur_id = %s AND date_creation = %s
        ORDER BY id DESC LIMIT 1
        """
        cursor.execute(
            select_query,
            (offer.nom_offert, offer.recruteur_id, date.today()),
        )
        result = cursor.fetchone()

        if not result:
            raise HTTPException(status_code=400, detail="Erreur lors de la création de l'offre")

        # Devolver la oferta creada
        return OfferResponse(
            id=result[0],
            nom_offert=result[1],
            nom_entreprise=result[2],
            adresse_entreprise=result[3],
            type_poste=result[4],
            salaire=result[5],
            description=result[6],
            date_debut=result[7],
            date_fin=result[8],
            recruteur_id=result[9],
            date_creation=result[10],
        )
    finally:
        conn.close()
