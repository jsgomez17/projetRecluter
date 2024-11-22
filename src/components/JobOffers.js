import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./JobOffers.css"; // Asegúrate de que el CSS actualizado esté importado

function JobOffers({ profil_id, user_id }) {
  const [offers, setOffers] = useState([]);
  const navigate = useNavigate(); // Hook para la navegación

  useEffect(() => {
    // Cargar las ofertas desde el backend
    const fetchOffers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/offers", {
          params: { profil_id, user_id },
        });
        setOffers(response.data);
      } catch (error) {
        console.error("Error al cargar las ofertas:", error);
      }
    };

    fetchOffers();
  }, [profil_id, user_id]);

  // Manejo de clic para postular
  const handlePostuler = (offerId) => {
    navigate(`/postuler-form/${offerId}`); // Navegar al formulario de postulación con el ID de la oferta
  };

  // Manejo de clic para ver postulantes
  const handleViewPostulants = (offerId) => {
    navigate(`/postulants/${offerId}`); // Navegar a la página de postulantes con el ID de la oferta
  };

  // Manejo de clic para crear oferta
  const handleCreateOffer = () => {
    navigate("/offre-form"); // Navegar al formulario de creación de oferta
  };

  return (
    <div className="job-offers-container">
      <h2>Offres d'emploi</h2>
      <div className="offers-grid">
        {offers.length === 0 ? (
          <p>Aucune offre disponible.</p>
        ) : (
          offers.map((offer) => (
            <div key={offer.id} className="offer-card">
              <h3>{offer.nom_offert}</h3>
              <p>
                <strong>Entreprise:</strong> {offer.nom_entreprise}
              </p>
              <p>
                <strong>Adresse:</strong> {offer.adresse_entreprise}
              </p>
              <p>
                <strong>Type de Poste:</strong> {offer.type_poste}
              </p>
              <p>
                <strong>Salaire:</strong> {offer.salaire} $
              </p>
              <p>
                <strong>Description:</strong> {offer.description}
              </p>
              <p>
                <strong>Date début:</strong>{" "}
                {new Date(offer.date_debut).toLocaleDateString()}
              </p>
              <p>
                <strong>Date fin:</strong>{" "}
                {new Date(offer.date_fin).toLocaleDateString()}
              </p>
              {profil_id === 2 ? (
                <button
                  className="action-button"
                  onClick={() => handlePostuler(offer.id)}
                >
                  Postuler
                </button>
              ) : (
                <button
                  className="action-button"
                  onClick={() => handleViewPostulants(offer.id)}
                >
                  Voir les Postulants
                </button>
              )}
            </div>
          ))
        )}
      </div>
      {profil_id === 1 && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button className="action-button" onClick={handleCreateOffer}>
            Créer une Nouvelle Offre
          </button>
        </div>
      )}
    </div>
  );
}

export default JobOffers;
