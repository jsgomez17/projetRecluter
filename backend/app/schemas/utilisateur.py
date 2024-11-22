from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Para recibir datos al crear un usuario
class UtilisateurCreate(BaseModel):
    nom: str
    prenom: str
    email: EmailStr
    mot_de_passe: str
    profil_id: Optional[int]
    plan_id: Optional[int]

# Para devolver datos de un usuario
class UtilisateurResponse(BaseModel):
    id: int
    nom: str
    prenom: str
    email: EmailStr
    profil_id: Optional[int]
    plan_id: Optional[int]
    date_inscription: datetime

    class Config:
        orm_mode = True
        
class LoginRequest(BaseModel):
    email: str
    mot_de_passe: str
