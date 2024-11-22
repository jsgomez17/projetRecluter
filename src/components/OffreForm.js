import React, { useState } from "react";
import "./OffreForm.css";

function OffreForm({ onSubmit }) {
  const [nomOffert, setNomOffert] = useState("");
  const [nomEntreprise, setNomEntreprise] = useState("");
  const [adresseEntreprise, setAdresseEntreprise] = useState("");
  const [typePoste, setTypePoste] = useState("");
  const [salaire, setSalaire] = useState("");
  const [description, setDescription] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      nomOffert &&
      nomEntreprise &&
      adresseEntreprise &&
      typePoste &&
      salaire &&
      description &&
      dateDebut &&
      dateFin
    ) {
      onSubmit({
        nomOffert,
        nomEntreprise,
        adresseEntreprise,
        typePoste,
        salaire,
        description,
        dateDebut,
        dateFin,
      });
    } else {
      alert("Tous les champs sont obligatoires.");
    }
  };

  return (
    <div className="offre-container">
      <h2 className="offre-title">Créer une Offre</h2>
      <form onSubmit={handleSubmit} className="offre-form">
        <div className="offre-field">
          <label>Nom de l'Offre:</label>
          <input
            type="text"
            value={nomOffert}
            onChange={(e) => setNomOffert(e.target.value)}
            required
            className="offre-input"
          />
        </div>
        <div className="offre-field">
          <label>Nom de l'Entreprise:</label>
          <input
            type="text"
            value={nomEntreprise}
            onChange={(e) => setNomEntreprise(e.target.value)}
            required
            className="offre-input"
          />
        </div>
        <div className="offre-field">
          <label>Adresse de l'Entreprise:</label>
          <input
            type="text"
            value={adresseEntreprise}
            onChange={(e) => setAdresseEntreprise(e.target.value)}
            required
            className="offre-input"
          />
        </div>
        <div className="offre-field">
          <label>Type de Poste:</label>
          <select
            value={typePoste}
            onChange={(e) => setTypePoste(e.target.value)}
            required
            className="offre-input"
          >
            <option value="">Sélectionner</option>
            <option value="Temps plein">Temps plein</option>
            <option value="Temps partiel">Temps partiel</option>
          </select>
        </div>
        <div className="offre-field">
          <label>Salaire:</label>
          <input
            type="number"
            value={salaire}
            onChange={(e) => setSalaire(e.target.value)}
            required
            className="offre-input"
          />
        </div>
        <div className="offre-field">
          <label>Date de Début:</label>
          <input
            type="date"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
            required
            className="offre-input"
          />
        </div>
        <div className="offre-field">
          <label>Date de Fin:</label>
          <input
            type="date"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
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
        <button type="submit" className="offre-button">
          Publier
        </button>
      </form>
    </div>
  );
}

export default OffreForm;
