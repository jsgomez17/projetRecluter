from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Esquema para la creación de un nuevo CV
class CVCreate(BaseModel):
    utilisateur_id: int
    url_pdf: str

# Esquema para la respuesta del CV
class CVResponse(BaseModel):
    id: int
    utilisateur_id: int
    url_pdf: str
    date_telechargement: Optional[datetime]

    class Config:
        orm_mode = True
