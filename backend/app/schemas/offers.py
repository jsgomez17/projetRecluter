from pydantic import BaseModel
from typing import Optional
from datetime import date

# Esquema para la creación de una oferta
class OfferCreate(BaseModel):
    nom_offert: str
    nom_entreprise: str
    adresse_entreprise: str
    type_poste: str
    salaire: float
    description: str
    date_debut: date
    date_fin: date
    recruteur_id: int

# Esquema para la respuesta de una oferta creada
class OfferResponse(BaseModel):
    id: int
    nom_offert: str
    nom_entreprise: str
    adresse_entreprise: str
    type_poste: str
    salaire: float
    description: str
    date_debut: date
    date_fin: date

    class Config:
        orm_mode = True
