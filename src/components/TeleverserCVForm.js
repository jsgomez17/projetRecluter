import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./TeleverserCVForm.css";
import axios from "axios";

function TeleverserCVForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const utilisateurId = location.state?.utilisateur_id; // Obtener el user_id desde el estado de la navegación

  const [cvFile, setCvFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cvFile) {
      const formData = new FormData();
      formData.append("file", cvFile); // Archivo
      formData.append("utilisateur_id", utilisateurId); // ID del usuario
      try {
        // Llamada al backend para cargar el CV
        await axios.post("http://127.0.0.1:8000/cvs/upload-cv", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("CV téléchargé avec succès!");
        navigate("/offers"); // Redirigir a la página de ofertas después de cargar el CV
      } catch (error) {
        console.error(
          "Erreur lors du téléchargement du CV:",
          error.response?.data || error.message
        );
        alert("Erreur lors du téléchargement du CV.");
      }
    } else {
      alert("Veuillez sélectionner un fichier.");
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
            accept=".pdf" // Solo aceptar archivos PDF
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

export default TeleverserCVForm;
