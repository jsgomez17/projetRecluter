
from pydantic import BaseModel
from datetime import datetime

class Postulat(BaseModel):
    id: int
    candidat_id: int
    offre_id: int
    date_postulation: datetime
    etat_recommande: bool
    lettre: str
