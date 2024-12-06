import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PostulerForm.css";
import { API_IP } from "../config";

function PostulerForm() {
  const [letter, setLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { candidat_id, offre_id, plan_id } = location.state || {};

  // Validar si `offerId` y `user_id` existen
  if (!offre_id || !candidat_id) {
    console.error("Offer ID o User ID no proporcionado.");
    navigate("/offers"); // Redirigir a las ofertas si falta información
    return null;
  }

  const handlePostuler = async () => {
    if (!letter.trim()) {
      alert("Veuillez écrire une lettre avant de postuler.");
      return;
    }

    setIsLoading(true);
    try {
      // Lógica para enviar la carta al backend
      await axios.post(`${API_IP}/postulats/postuler`, {
        candidat_id: candidat_id,
        offre_id: offre_id,
        lettre: letter,
      });
      alert("Postulé avec succès !");
      navigate("/offers");
    } catch (error) {
      console.error("Erreur lors de la postulation :", error);
      alert(
        error.response?.data?.detail ||
          "Une erreur est survenue. Veuillez réessayer."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Función para generar carta con IA
  const handleGenerateLetter = async () => {
    setIsLoading(true);
    try {
      // Lógica para generar la carta con IA
      const response = await axios.get(`/postulats/generate-letter`, {
        params: {
          candidat_id: candidat_id,
          offre_id: offre_id,
        },
      });
      setLetter(response.data.generated_letter); // Establecer la carta generada
    } catch (error) {
      console.error("Erreur lors de la génération de la lettre :", error);
      alert("Erreur lors de la génération de la lettre.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="postuler-container">
      <h2 className="postuler-title">Postuler à une Offre</h2>
      <form className="postuler-form" onSubmit={(e) => e.preventDefault()}>
        <div className="postuler-field">
          <label>Votre Lettre de Motivation:</label>
          <textarea
            value={letter}
            onChange={(e) => setLetter(e.target.value)}
            className="postuler-textarea"
            placeholder="Écrivez ici votre lettre de motivation..."
          ></textarea>
        </div>
        <div className="postuler-buttons">
          <button
            type="button"
            onClick={handlePostuler}
            className="postuler-button"
            disabled={isLoading}
          >
            {isLoading ? "En cours..." : "Postuler"}
          </button>
          {plan_id === 2 && (
            <button
              type="button"
              onClick={handleGenerateLetter}
              className="generate-button"
              disabled={isLoading}
            >
              {isLoading ? "Génération..." : "Générer avec IA"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default PostulerForm;
