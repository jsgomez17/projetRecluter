import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./PostulerForm.css"; // Opcional, para estilos personalizados.

function PostulerForm({ user_id, user_plan }) {
  const [letter, setLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const offerId = location.state?.offerId || null;

  const handlePostuler = async () => {
    if (!letter.trim()) {
      alert("Veuillez écrire une lettre avant de postuler.");
      return;
    }

    setIsLoading(true);
    try {
      // Lógica para enviar la carta al backend
      await axios.post("http://127.0.0.1:8000/apply", {
        utilisateur_id: user_id,
        offre_id: offerId,
        lettre: letter,
      });
      alert("Postulé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la postulation :", error);
      alert("Erreur lors de la postulation.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateLetter = async () => {
    setIsLoading(true);
    try {
      // Lógica para generar la carta con IA
      const response = await axios.post(
        "http://127.0.0.1:8000/generate-letter",
        {
          utilisateur_id: user_id,
          offre_id: offerId,
        }
      );
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
          {user_plan === 2 && (
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
