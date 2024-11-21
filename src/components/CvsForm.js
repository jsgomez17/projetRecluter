import React, { useState } from "react";
import "./cvForm.css";

function CVForm({ onSubmit }) {
  const [utilisateurId, setUtilisateurId] = useState("");
  const [cvFile, setCvFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cvFile && utilisateurId) {
      const formData = new FormData();
      formData.append("utilisateur_id", utilisateurId);
      formData.append("cv_file", cvFile);
      onSubmit(formData);
    } else {
      alert("Tous les champs sont obligatoires.");
    }
  };

  return (
    <div className="cv-container">
      <h2 className="cv-title">Télécharger un CV</h2>
      <form onSubmit={handleSubmit} className="cv-form">
        <div className="cv-field">
          <label>Utilisateur ID:</label>
          <input
            type="text"
            value={utilisateurId}
            onChange={(e) => setUtilisateurId(e.target.value)}
            required
            className="cv-input"
          />
        </div>
        <div className="cv-field">
          <label>Fichier CV:</label>
          <input
            type="file"
            onChange={(e) => setCvFile(e.target.files[0])}
            required
            className="cv-input"
          />
        </div>
        <button type="submit" className="cv-button">
          Télécharger
        </button>
      </form>
    </div>
  );
}

export default CVForm;
