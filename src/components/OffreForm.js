import React, { useState } from "react";
import "./offreForm.css";

function OffreForm({ onSubmit }) {
  const [recruteurId, setRecruteurId] = useState("");
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [datePublication, setDatePublication] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (recruteurId && titre && description && datePublication) {
      onSubmit({ recruteurId, titre, description, datePublication });
    } else {
      alert("Tous les champs sont obligatoires.");
    }
  };

  return (
    <div className="offre-container">
      <h2 className="offre-title">Créer une Offre</h2>
      <form onSubmit={handleSubmit} className="offre-form">
        <div className="offre-field">
          <label>Recruteur ID:</label>
          <input
            type="text"
            value={recruteurId}
            onChange={(e) => setRecruteurId(e.target.value)}
            required
            className="offre-input"
          />
        </div>
        <div className="offre-field">
          <label>Titre:</label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
            className="offre-input"
          />
        </div>
        <div className="offre-field">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="offre-textarea"
          />
        </div>
        <div className="offre-field">
          <label>Date de Publication:</label>
          <input
            type="date"
            value={datePublication}
            onChange={(e) => setDatePublication(e.target.value)}
            required
            className="offre-input"
          />
        </div>
        <button type="submit" className="offre-button">
          Publier
        </button>
      </form>
    </div>
  );
}

export default OffreForm;
