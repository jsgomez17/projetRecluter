echo "Abriendo backend"
cd backend
echo "Iniciando servicio"
uvicorn app.main:app
echo "Fin del servicio"