from fastapi import APIRouter, Depends, HTTPException
from app.database import get_snowflake_connection
from datetime import date
from typing import List
from app.schemas.offers import OfferResponse, OfferCreate, OfferUpdate
from app.utils.auth import get_current_user
from app.services.ia_smart_recruit import IASmartRecruit

router = APIRouter()

#mostrar todas las ofertas
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
        

#para buscar las ofertas recomendadas para un candidato
@router.get("/recommended", response_model=List[OfferResponse])
def get_recommended_offers(user_id: int):
    """
    Obtenez des offres recommandées en fonction des compétences du candidat.
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

#creacion de una oferta
@router.post("/", response_model=OfferResponse)
def create_offer(offer: OfferCreate):
    conn = get_snowflake_connection()
    try:
        cursor = conn.cursor()
        
        # Consulta para insertar una nueva oferta
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
                date.today(), 
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

        # Create an instance of the class
        ia_smart_recruit = IASmartRecruit("gpt-3.5-turbo")
        # Get skills from candidate cv
        skills_candidate = ia_smart_recruit.get_skills_from_offer(offer.description)
        query_insert = """
        INSERT INTO SMARTRECRUIT_DB.SMARTRECRUIT_SCHEMA.COMPETENCES_OFFRES (OFFRE_ID, COMPETENCE, NIVEAU)
        VALUES (%s, %s, %s)
        """
        for skill in skills_candidate["skills"]:
            cursor.execute(query_insert, (result[0], skill['skill'], skill['years']))
        
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

#buscar una oferta por id
@router.get("/{offer_id}", response_model=OfferResponse)
def get_offer(offer_id: int):
    """
    Obtener una oferta específica por ID.
    """
    conn = get_snowflake_connection()
    try:
        cursor = conn.cursor()
        query = """
        SELECT id, nom_offert, nom_entreprise, adresse_entreprise, 
               type_poste, salaire, description, 
               date_debut, date_fin, recruteur_id, date_creation
        FROM offres
        WHERE id = %s
        """
        cursor.execute(query, (offer_id,))
        result = cursor.fetchone()

        if not result:
            raise HTTPException(status_code=404, detail="Offre non trouvée")

        return {
            "id": result[0],
            "nom_offert": result[1],
            "nom_entreprise": result[2],
            "adresse_entreprise": result[3],
            "type_poste": result[4],
            "salaire": result[5],
            "description": result[6],
            "date_debut": result[7],
            "date_fin": result[8],
            "recruteur_id": result[9],
            "date_creation": result[10],
        }
    finally:
        conn.close()
        
#modificar una oferta por id
@router.put("/{offer_id}", response_model=OfferResponse)
def update_offer(offer_id: int, updated_offer: OfferUpdate):
    """
    Mettre à jour une offre spécifique.
    """
    conn = get_snowflake_connection()
    try:
        cursor = conn.cursor()

        # Actualizar la oferta
        query = """
        UPDATE offres
        SET nom_offert = %s,
            nom_entreprise = %s,
            adresse_entreprise = %s,
            type_poste = %s,
            salaire = %s,
            description = %s,
            date_debut = %s,
            date_fin = %s
        WHERE id = %s
        """
        cursor.execute(
            query,
            (
                updated_offer.nom_offert,
                updated_offer.nom_entreprise,
                updated_offer.adresse_entreprise,
                updated_offer.type_poste,
                updated_offer.salaire,
                updated_offer.description,
                updated_offer.date_debut,
                updated_offer.date_fin,
                offer_id,
            ),
        )

        # Confirmar que la oferta fue actualizada
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Offre non trouvée ou non mise à jour")

        # Recuperar la oferta actualizada
        query_select = """
        SELECT id, nom_offert, nom_entreprise, adresse_entreprise, 
               type_poste, salaire, description, 
               date_debut, date_fin, recruteur_id, date_creation
        FROM offres
        WHERE id = %s
        """
        cursor.execute(query_select, (offer_id,))
        result = cursor.fetchone()

        return {
            "id": result[0],
            "nom_offert": result[1],
            "nom_entreprise": result[2],
            "adresse_entreprise": result[3],
            "type_poste": result[4],
            "salaire": result[5],
            "description": result[6],
            "date_debut": result[7],
            "date_fin": result[8],
            "recruteur_id": result[9],
            "date_creation": result[10],
        }
    finally:
        conn.close()

#elimina una oferta por id
@router.delete("/{offer_id}", status_code=204)
def delete_offer(offer_id: int):
    """
    Supprimer une offre spécifique par ID.
    """
    conn = get_snowflake_connection()
    try:
        cursor = conn.cursor()
        
        # Eliminar la oferta
        query = "DELETE FROM offres WHERE id = %s"
        cursor.execute(query, (offer_id,))
        
        # Verificar si se eliminó alguna fila
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Offre non trouvée")
        
        return {"message": "Offre supprimée avec succès"}
    finally:
        conn.close()
