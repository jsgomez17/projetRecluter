from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from app.utils.security import verify_access_token

# Define el esquema de autenticación para obtener el token del header Authorization
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

# Función para validar el token y devolver los datos del usuario
def get_current_user(token: str = Depends(oauth2_scheme)):
    print("Token recibido:", token)
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token invalide ou expiré")

    # Valida que los datos requeridos estén en el token
    user_id = payload.get("user_id")
    profil_id = payload.get("profil_id")
    if not user_id or not profil_id:
        raise HTTPException(status_code=401, detail="Token invalide ou expiré")

    # Devuelve los datos del usuario como un diccionario estructurado
    print("Payload decodificado:", user_id)
    return {"user_id": user_id, "profil_id": profil_id}
