import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Postulants.css";

function Postulants({ user_id }) {
  const { offerId } = useParams(); // Obtén el ID de la oferta desde los parámetros de la URL
  const [activeTab, setActiveTab] = useState("all"); // Pestaña activa (todos o recomendados)
  const [allPostulants, setAllPostulants] = useState([]); // Todos los postulantes
  const [recommendedPostulants, setRecommendedPostulants] = useState([]); // Postulantes recomendados
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Cargar postulantes y recomendados al inicio
    const fetchPostulants = async () => {
      setLoading(true);
      setError(null);

      try {
        // Obtener todos los postulantes
        const allResponse = await axios.get(
          "http://127.0.0.1:8000/postulats/postulants",
          { params: { offre_id: offerId, recommended_only: false } }
        );
        setAllPostulants(allResponse.data);

        // Obtener postulantes recomendados
        const recommendedResponse = await axios.get(
          "http://127.0.0.1:8000/postulats/postulants",
          { params: { offre_id: offerId, recommended_only: true } }
        );
        setRecommendedPostulants(recommendedResponse.data);
      } catch (error) {
        setError("Erreur lors du chargement des postulants.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (offerId) {
      fetchPostulants();
    }
  }, [offerId]);

  // Manejar clics en las pestañas
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Determinar los postulantes a mostrar según la pestaña activa
  const displayedPostulants =
    activeTab === "all" ? allPostulants : recommendedPostulants;

  const handleDownload = (urlPdf) => {
    const fileName = urlPdf.split("/").pop(); // Extrae el nombre del archivo
    const downloadUrl = `http://127.0.0.1:8000/cvs/download-cv?file_name=${fileName}`;
    window.open(downloadUrl, "_blank"); // Abre en una nueva pestaña
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="postulants-container">
      <h2 className="postulants-title">Candidats</h2>

      {/* Pestañas para todos los candidatos y candidatos recomendados */}
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "all" ? "active" : ""}`}
          onClick={() => handleTabClick("all")}
        >
          Tous les candidats
        </button>
        <button
          className={`tab-button ${
            activeTab === "recommended" ? "active" : ""
          }`}
          onClick={() => handleTabClick("recommended")}
        >
          Candidats recommandés
        </button>
      </div>

      {/* Contenido de las pestañas */}
      <div className="postulants-grid">
        {displayedPostulants.length === 0 ? (
          <p>Aucun candidat trouvé.</p>
        ) : (
          displayedPostulants.map((postulant) => (
            <div key={postulant.email} className="postulant-card">
              <h3>
                {postulant.nom} {postulant.prenom}
              </h3>
              <p>
                <strong>Email:</strong> {postulant.email}
              </p>
              <p>
                <strong>Lettre:</strong> {postulant.lettre}
              </p>
              <button
                className="action-button"
                onClick={() => handleDownload(postulant.url_pdf)}
              >
                Télécharger CV
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Postulants;
