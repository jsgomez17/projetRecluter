from fastapi import FastAPI
from app.routers import utilisateurs
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(utilisateurs.router, prefix="/utilisateurs", tags=["Utilisateurs"])

@app.get("/")
def read_root():
    return {"message": "Bienvenue à l'API SMARTRECRUIT"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Cambia según tu dominio en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
