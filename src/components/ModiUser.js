import React, { useState } from "react";
import "./ModiUser.css";

const PersonalAndFileForm = ({ user, onSavePersonal, onUploadFile }) => {
  const [personalData, setPersonalData] = useState(
    user || { name: "", email: "" }
  );
  const [file, setFile] = useState(null);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalData({ ...personalData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handlePersonalSubmit = (e) => {
    e.preventDefault();
    onSavePersonal(personalData);
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (file) {
      onUploadFile(file);
    } else {
      alert("Veuillez sélectionner un fichier.");
    }
  };

  return (
    <div className="modi-user-container">
      <h2>Formulaire de Données Personnelles et Téléchargement de Fichier</h2>
      <form onSubmit={handlePersonalSubmit}>
        <h3>Modifier les Données Personnelles</h3>
        <label>
          Nom:
          <input
            type="text"
            name="name"
            value={personalData.name}
            onChange={handlePersonalChange}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={personalData.email}
            onChange={handlePersonalChange}
          />
        </label>
        <br />
        <button type="submit">Enregistrer les Données Personnelles</button>
      </form>
      <hr />
      <form onSubmit={handleFileSubmit}>
        <h3>Télécharger un Fichier</h3>
        <label>
          Sélectionner un fichier :
          <input type="file" onChange={handleFileChange} />
        </label>
        <br />
        <button type="submit">Télécharger le Fichier</button>
      </form>
    </div>
  );
};

export default PersonalAndFileForm;
