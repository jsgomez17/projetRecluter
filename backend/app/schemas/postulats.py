from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PostulatCreate(BaseModel):
    candidat_id: int
    offre_id: int
    lettre: str
    etat_recommande: Optional[bool] = False

class PostulatResponse(BaseModel):
    id: int
    candidat_id: int
    offre_id: int
    date_postulation: datetime
    etat_recommande: bool
    lettre: str

    class Config:
        orm_mode = True
