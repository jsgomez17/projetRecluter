import bcrypt
from jose import JWTError, jwt
from datetime import datetime, timedelta

# Función para encriptar la contraseña
def hash_password(plain_password: str) -> str:
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(plain_password.encode('utf-8'), salt)
    return hashed_password.decode('utf-8')

# Función para verificar contraseñas
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# Configuración del token
SECRET_KEY = "mi_clave_secreta_super_segura"  # Cambia esto a algo seguro
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # Tiempo de expiración del token

# Función para crear un token JWT
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})  # Se añade la fecha de expiración al token
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Función para verificar y decodificar un token
def verify_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print("Token decodificado correctamente:", payload)  # Depuración
        return payload  # Devuelve los datos decodificados del token
    except JWTError:
        return None
