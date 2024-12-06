#!/bin/bash

echo "Abriendo backend"
# Move into the correct directory where the FastAPI app is located
cd backend
echo "Iniciando servicio"
# Run the FastAPI + Dash app using Uvicorn
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 1
echo "Fin del servicio"


