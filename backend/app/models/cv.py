from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Modelo para representar un CV en la base de datos
class CV(BaseModel):
    id: int
    utilisateur_id: int
    url_pdf: str
    date_telechargement: Optional[datetime]

    class Config:
        orm_mode = True
