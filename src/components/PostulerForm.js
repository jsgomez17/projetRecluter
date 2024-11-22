import React, { useState } from "react";
import "./PostulerForm.css";

function PostulerForm({ onSubmit }) {
  const [cvFile, setCvFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cvFile) {
      const formData = new FormData();
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

export default PostulerForm;
