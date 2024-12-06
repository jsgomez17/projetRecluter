from fastapi import FastAPI
from app.routers import utilisateurs, offers, cvs, postulats, chat
from fastapi.middleware.cors import CORSMiddleware
from app.session import session_data

import uvicorn

app = FastAPI()


app.include_router(utilisateurs.router, prefix="/utilisateurs", tags=["Utilisateurs"])
app.include_router(offers.router, prefix="/offers", tags=["Offers"])
app.include_router(cvs.router, prefix="/cvs", tags=["CVs"])
app.include_router(postulats.router, prefix="/postulats",tags=["Postulats"])
app.include_router(chat.router, prefix="/chat",tags=["Chat"])

@app.get("/")
def read_root():
    return {"message": "Bienvenue à l'API SMARTRECRUIT"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ =='__main__':
    uvicorn.run(app, host='0.0.0.0', port =8000, workers=1)