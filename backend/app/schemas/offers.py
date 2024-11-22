from pydantic import BaseModel
from datetime import date

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
    date_creation: date

    class Config:
        orm_mode = True
