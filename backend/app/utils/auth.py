from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from app.utils.security import verify_access_token

# Define el esquema de autenticación para obtener el token del header Authorization
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

# Función para validar el token y devolver los datos del usuario
def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = verify_access_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Token invalide ou expiré")
    return payload  # Devuelve los datos del token
