import React, { useState } from "react";
import axios from "axios";
import "./UpdateUser.css";
import { API_IP } from "../config";

function UpdateCV({ userId, isRecruiter }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage("Veuillez sélectionner un fichier.");
      return;
    }

    if (!file.name.endsWith(".pdf")) {
      setMessage("Le fichier doit être un PDF.");
      return;
    }

    const formData = new FormData();
    formData.append("utilisateur_id", userId);
    formData.append("file", file);

    try {
      setUploading(true);
      setMessage("");

      const response = await axios.post(`${API_IP}/cvs/update-cv`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(response.data.message);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du CV:", error);
      setMessage("Erreur lors de la mise à jour du CV.");
    } finally {
      setUploading(false);
    }
  };

  if (isRecruiter) {
    return null; // No mostrar nada para los reclutadores
  }

  return (
    <div className="update-user-container">
      <div className="update-user-form">
        <h2>Mettre à jour votre CV</h2>
        <form onSubmit={handleUpload}>
          <div className="form-field">
            <label htmlFor="cv">Sélectionner un fichier :</label>
            <input
              type="file"
              id="cv"
              accept=".pdf"
              onChange={handleFileChange}
            />
          </div>
          <button type="submit" className="update-button" disabled={uploading}>
            {uploading ? "Téléchargement en cours..." : "Mettre à jour le CV"}
          </button>
          {message && <p className="update-message">{message}</p>}
        </form>
      </div>
    </div>
  );
}

export default UpdateCV;
