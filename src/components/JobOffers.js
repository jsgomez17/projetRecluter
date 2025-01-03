import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCheckCV from "../hooks/useCheckCV";
import axios from "axios";
import Chatbot from "./Chatbot";
import "./JobOffers.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import { API_IP } from "../config";

function JobOffers({ profil_id, user_id, plan_id }) {
  const { hasCV, loading, error } = useCheckCV(user_id);
  const [activeTab, setActiveTab] = useState("all"); // Controla la pestaña activa
  const [offers, setOffers] = useState([]);
  const [recommendedOffers, setRecommendedOffers] = useState([]);
  const navigate = useNavigate(); // Hook para la navegación

  // Redirigir al candidato si no tiene CV cargado
  useEffect(() => {
    if (loading) return; // Esperar a que termine la verificación
    if (profil_id === 2 && hasCV === false) {
      navigate("/upload-cv", { state: { utilisateur_id: user_id } }); // Redirigir a la página de carga de CV
    }
  }, [hasCV, loading, profil_id, navigate, user_id]);

  useEffect(() => {
    // Cargar las ofertas desde el backend
    const fetchOffers = async () => {
      try {
        const response = await axios.get(`${API_IP}/offers/`, {
          params: { profil_id, user_id },
        });
        setOffers(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des offres:", error);
      }
    };
    if (hasCV || profil_id === 1) {
      fetchOffers(); // Cargar ofertas solo si tiene CV o es reclutador
    }
  }, [profil_id, user_id, hasCV]);

  useEffect(() => {
    // Cargar ofertas recomendadas desde el backend
    const fetchRecommendedOffers = async () => {
      try {
        const response = await axios.get(`${API_IP}/offers/recommended`, {
          params: { user_id },
        });
        setRecommendedOffers(response.data);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des offres recommandées:",
          error
        );
      }
    };
    if (profil_id === 2) {
      fetchRecommendedOffers(); // Cargar ofertas recomendadas solo para candidatos
    }
  }, [profil_id, user_id]);

  // Manejo de pestañas
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Manejo de clic para postular
  const handlePostuler = (offerId) => {
    navigate(`/postuler-form/${offerId}`, {
      state: { candidat_id: user_id, offre_id: offerId, plan_id: plan_id },
    });
  };

  // Manejo de clic para ver postulantes
  const handleViewPostulants = (offerId) => {
    navigate(`/postulants/${offerId}`, { state: { offerId } }); // Navegar a la página de postulantes con el ID de la oferta
  };

  // Manejo de clic para crear oferta
  const handleCreateOffer = () => {
    navigate("/offre-form", { state: { user_id } }); // Navegar al formulario de creación de oferta
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>Erreur lors de la vérification du CV: {error.message}</p>;
  }

  const handleEditOffer = (offerId) => {
    navigate(`/edit-offer/${offerId}`); // Navegar a la pantalla de edición
  };

  const handleDeleteOffer = async (offerId) => {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cette offre ?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_IP}/offers/${offerId}`);
      alert("Offre supprimée avec succès.");
      // Filtrar las ofertas para eliminar la oferta eliminada
      setOffers((prevOffers) =>
        prevOffers.filter((offer) => offer.id !== offerId)
      );
    } catch (error) {
      console.error("Erreur lors de la suppression de l'offre:", error);
      alert("Erreur lors de la suppression de l'offre.");
    }
  };

  return (
    <div className="job-offers-container">
      <h2>Offres d'emploi</h2>

      {/* Mostrar pestañas solo para candidatos */}
      {profil_id === 2 && (
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === "all" ? "active" : ""}`}
            onClick={() => handleTabClick("all")}
          >
            Toutes les offres
          </button>
          <button
            className={`tab-button ${
              activeTab === "recommended" ? "active" : ""
            }`}
            onClick={() => handleTabClick("recommended")}
          >
            Offres recommandées
          </button>
        </div>
      )}

      {/* Contenido de las pestañas */}
      <div className="tab-content">
        {profil_id === 1 && (
          // Ofertas creadas por el reclutador
          <div className="offers-grid">
            {offers.length === 0 ? (
              <p>Aucune offre disponible.</p>
            ) : (
              offers.map((offer) => (
                <div key={offer.id} className="offer-card">
                  {profil_id === 1 && (
                    <div className="action-icons">
                      <FaEdit
                        className="edit-icon"
                        onClick={() => handleEditOffer(offer.id)}
                        title="Modifier l'offre"
                      />
                      <FaTrash
                        className="delete-icon"
                        onClick={() => handleDeleteOffer(offer.id)}
                        title="Supprimer l'offre"
                      />
                    </div>
                  )}
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
                  <p className="description">
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
                  <button
                    className="action-button"
                    onClick={() => handleViewPostulants(offer.id)}
                  >
                    Voir les Postulants
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {profil_id === 2 && activeTab === "all" && (
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
                  <p className="description">
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
                  <button
                    className="action-button"
                    onClick={() => handlePostuler(offer.id)}
                  >
                    Postuler
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {profil_id === 2 && activeTab === "recommended" && (
          <div className="offers-grid">
            {recommendedOffers.length === 0 ? (
              <p>Aucune offre recommandée disponible.</p>
            ) : (
              recommendedOffers.map((offer) => (
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
                  <p className="description">
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
                  <button
                    className="action-button"
                    onClick={() => handlePostuler(offer.id)}
                  >
                    Postuler
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {profil_id === 1 && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button className="action-button" onClick={handleCreateOffer}>
            Créer une Nouvelle Offre
          </button>
        </div>
      )}
      {/* Mostrar el chatbot si el usuario tiene plan Pro o Enterprise */}
      {(plan_id === 2 || plan_id === 3) && (
        <Chatbot profil_id={profil_id} user_id={user_id} plan_id={plan_id} />
      )}
    </div>
  );
}

export default JobOffers;
