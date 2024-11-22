import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./OffreForm.css";

function OffreForm() {
  const location = useLocation();
  const user_id = location.state?.user_id; // Obtén el user_id desde la ubicación

  const [nomOffert, setNomOffert] = useState("");
  const [nomEntreprise, setNomEntreprise] = useState("");
  const [adresseEntreprise, setAdresseEntreprise] = useState("");
  const [typePoste, setTypePoste] = useState("");
  const [salaire, setSalaire] = useState("");
  const [description, setDescription] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que todos los campos estén completos
    if (
      !nomOffert ||
      !nomEntreprise ||
      !adresseEntreprise ||
      !typePoste ||
      !salaire ||
      !description ||
      !dateDebut ||
      !dateFin
    ) {
      alert("Tous les champs sont obligatoires.");
      return;
    }

    try {
      // Realizar solicitud POST al backend
      const response = await axios.post("http://127.0.0.1:8000/offers", {
        nom_offert: nomOffert,
        nom_entreprise: nomEntreprise,
        adresse_entreprise: adresseEntreprise,
        type_poste: typePoste,
        salaire: parseFloat(salaire),
        description,
        date_debut: dateDebut,
        date_fin: dateFin,
        recruteur_id: user_id,
      });

      alert("Offre créée avec succès!");
      console.log("Réponse du serveur:", response.data);

      // Limpiar el formulario después de una creación exitosa
      setNomOffert("");
      setNomEntreprise("");
      setAdresseEntreprise("");
      setTypePoste("");
      setSalaire("");
      setDescription("");
      setDateDebut("");
      setDateFin("");
    } catch (error) {
      console.error(
        "Erreur lors de la création de l'offre:",
        error.response?.data || error.message
      );
      alert("Erreur lors de la création de l'offre.");
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
