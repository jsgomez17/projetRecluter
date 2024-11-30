import React, { useState, useEffect } from "react";
import "./ModiUser.css";

const PersonalAndFileForm = ({ user, onSavePersonal, onUploadFile }) => {
  const [personalData, setPersonalData] = useState({
    nom: "",
    prenom: "",
    email: "",
    rol: "",
    plan: "",
  });
  const [file, setFile] = useState(null);

  // Pre-cargar los datos del usuario cuando `user` cambia
  useEffect(() => {
    if (user) {
      setPersonalData({
        nom: user.nom || "",
        prenom: user.prenom || "",
        email: user.email || "",
        rol: user.rol || "",
        plan: user.plan || "",
      });
    }
  }, [user]);

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
      {/* Section gauche - Données personnelles */}
      <div className="modi-user-left">
        <h2>Modifier les Données Personnelles</h2>
        <form onSubmit={handlePersonalSubmit}>
          <label>
            Nom:
            <input
              type="text"
              name="nom"
              value={personalData.nom}
              onChange={handlePersonalChange}
              required
            />
          </label>
          <br />
          <label>
            Prénom:
            <input
              type="text"
              name="prenom"
              value={personalData.prenom}
              onChange={handlePersonalChange}
              required
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
              required
            />
          </label>
          <br />
          <label>
            Rôle:
            <select
              name="rol"
              value={personalData.rol}
              onChange={handlePersonalChange}
              required
            >
              <option value="">Sélectionnez un Rôle</option>
              <option value="Candidat">Candidat</option>
              <option value="Recruteur">Recruteur</option>
            </select>
          </label>
          <br />
          <label>
            Type de Plan:
            <select
              name="plan"
              value={personalData.plan}
              onChange={handlePersonalChange}
              required
            >
              <option value="">Sélectionner un Plan</option>
              {personalData.rol === "Candidat" && (
                <>
                  <option value="Basique">Basique</option>
                  <option value="Pro">Pro</option>
                </>
              )}
              {personalData.rol === "Recruteur" && (
                <>
                  <option value="Basique">Basique</option>
                  <option value="Enterprise">Enterprise</option>
                </>
              )}
            </select>
          </label>
          <br />
          <button type="submit">Enregistrer les Données Personnelles</button>
        </form>
      </div>

      {/* Section droite - Téléchargement de fichier */}
      <div className="modi-user-right">
        <h2>Télécharger un Fichier</h2>
        <form onSubmit={handleFileSubmit}>
          <label>
            Sélectionner un fichier :
            <input type="file" onChange={handleFileChange} />
          </label>
          <br />
          <button type="submit">Télécharger le Fichier</button>
        </form>
      </div>
    </div>
  );
};

export default PersonalAndFileForm;
