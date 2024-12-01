from fastapi import APIRouter, HTTPException, Depends
from app.database import get_snowflake_connection
from app.schemas.utilisateur import UtilisateurCreate, UtilisateurResponse, LoginRequest, UtilisateurUpdate
from app.utils.security import hash_password, verify_password, create_access_token
from app.utils.auth import get_current_user
from typing import List

router = APIRouter()

# Crear un usuario
@router.post("/", response_model=UtilisateurResponse)
def create_utilisateur(utilisateur: UtilisateurCreate):
    conn = get_snowflake_connection()
    try:
        cursor = conn.cursor()
		
		# Verificar si el correo ya está registrado
        
        query_check_email = "SELECT id FROM utilisateurs WHERE email = %s;"
        cursor.execute(query_check_email, (utilisateur.email,))
        email_exists = cursor.fetchone()

        if email_exists:
        
            raise HTTPException(status_code=400, detail="L'email est déjà enregistré")

        # Encriptar la contraseña
        hashed_password = hash_password(utilisateur.mot_de_passe)

        # Realizar la inserción
        query_insert = """
        INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, profil_id, plan_id)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query_insert, (
            utilisateur.nom,
            utilisateur.prenom,
            utilisateur.email,
            hashed_password,  # Asegúrate de usar la contraseña encriptada
            utilisateur.profil_id,
            utilisateur.plan_id
        ))
		
        
        # Recuperar el último registro insertado basado en un identificador único
        # Esto asume que `email` es único en la tabla `utilisateurs`
        query_select = """
        SELECT id, nom, prenom, email, profil_id, plan_id, date_inscription
        FROM utilisateurs
        WHERE email = %s
        """
        cursor.execute(query_select, (utilisateur.email,))
        result = cursor.fetchone()
        
        if not result:
            raise HTTPException(status_code=400, detail="Erreur lors de la récupération de l'utilisateur")
        
        return UtilisateurResponse(
            id=result[0],
            nom=result[1],
            prenom=result[2],
            email=result[3],
            profil_id=result[4],
            plan_id=result[5],
            date_inscription=result[6]
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        
        raise HTTPException(status_code=500, detail="Erreur interne du serveur")
    finally:
        conn.close()

# Consultar todos los usuarios
@router.get("/", response_model=List[UtilisateurResponse])
def get_all_utilisateurs():
    conn = get_snowflake_connection()
    try:
        cursor = conn.cursor()
        query = "SELECT id, nom, prenom, email, profil_id, plan_id, date_inscription FROM utilisateurs;"
        cursor.execute(query)
        results = cursor.fetchall()
        return [
            UtilisateurResponse(
                id=row[0],
                nom=row[1],
                prenom=row[2],
                email=row[3],
                profil_id=row[4],
                plan_id=row[5],
                date_inscription=row[6]
            )
            for row in results
        ]
    finally:
        conn.close()

# Consultar un usuario por ID
@router.get("/{user_id}", response_model=UtilisateurResponse)
def get_utilisateur(user_id: int):
    conn = get_snowflake_connection()
    try:
        cursor = conn.cursor()
        query = "SELECT id, nom, prenom, email, profil_id, plan_id, date_inscription FROM utilisateurs WHERE id = %s;"
        cursor.execute(query, (user_id,))
        result = cursor.fetchone()
        if not result:
            raise HTTPException(status_code=404, detail="Utilisateur introuvable")
        return UtilisateurResponse(
            id=result[0],
            nom=result[1],
            prenom=result[2],
            email=result[3],
            profil_id=result[4],
            plan_id=result[5],
            date_inscription=result[6]
        )
    finally:
        conn.close()

#modificacion de informacion de un usuario
@router.put("/{user_id}", response_model=UtilisateurResponse)
def update_user(user_id: int, updated_user: UtilisateurUpdate):
    """
    Mettre à jour un utilisateur spécifique.
    """
    conn = get_snowflake_connection()
    try:
        cursor = conn.cursor()

        # Construir la consulta de actualización
        query = """
        UPDATE utilisateurs
        SET nom = %s,
            prenom = %s,
            email = %s,
            mot_de_passe = %s,
            profil_id = %s,
            plan_id = %s
        WHERE id = %s
        """
        
        # Encriptar la contraseña si se proporciona
        hashed_password = (
            hash_password(updated_user.mot_de_passe)
            if updated_user.mot_de_passe
            else None
        )

        # Ejecutar la consulta con los valores proporcionados
        cursor.execute(
            query,
            (
                updated_user.nom,
                updated_user.prenom,
                updated_user.email,
                hashed_password,
                updated_user.profil_id,
                updated_user.plan_id,
                user_id,
            ),
        )

        # Confirmar que el usuario fue actualizado
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Utilisateur introuvable ou non mis à jour.")

        # Recuperar los datos actualizados del usuario
        query_select = """
        SELECT id, nom, prenom, email, profil_id, plan_id, date_inscription
        FROM utilisateurs
        WHERE id = %s
        """
        cursor.execute(query_select, (user_id,))
        result = cursor.fetchone()

        # Retornar el usuario actualizado
        return UtilisateurResponse(
            id=result[0],
            nom=result[1],
            prenom=result[2],
            email=result[3],
            profil_id=result[4],
            plan_id=result[5],
            date_inscription=result[6],
        )
    finally:
        conn.close()


#validación para el login
@router.post("/login")
def login(login_request: LoginRequest):
    conn = get_snowflake_connection()
    try:
        # Extraer datos del cuerpo de la solicitud
        email = login_request.email
        mot_de_passe = login_request.mot_de_passe

        cursor = conn.cursor()
        query = "SELECT id, nom, prenom, email, mot_de_passe, profil_id, plan_id FROM utilisateurs WHERE email = %s;"
        cursor.execute(query, (email,))
        result = cursor.fetchone()

        if not result:
            raise HTTPException(status_code=404, detail="Utilisateur introuvable")

        user_id, nom, prenom, email, hashed_password, profil_id, plan_id = result

        # Verificar la contraseña
        if not verify_password(mot_de_passe, hashed_password):
            raise HTTPException(status_code=401, detail="Mot de passe incorrect")

        # Crear el token
        access_token = create_access_token(
            data={
                "user_id": user_id,
                "email": email,
                "profil_id": profil_id,
                "plan_id": plan_id
            }
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "nom": nom,
                "prenom": prenom,
                "profil_id": profil_id,
                "plan_id": plan_id
            }
        }
    finally:
        conn.close()




@router.get("/dashboard")
def dashboard(current_user: dict = Depends(get_current_user)):
    profil_id = current_user.get("profil_id")
    plan_id = current_user.get("plan_id")

    # Lógica basada en PROFIL_ID y PLAN_ID
    if profil_id == 1:  # Ejemplo: Administrador
        return {"message": "Bienvenido al panel de administrador", "plan_id": plan_id}
    elif profil_id == 2:  # Ejemplo: Usuario estándar
        return {"message": "Bienvenido al panel de usuario", "plan_id": plan_id}
    else:
        raise HTTPException(status_code=403, detail="Acceso denegado")