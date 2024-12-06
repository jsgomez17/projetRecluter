import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./OffreForm.css";
import { API_IP } from "../config";

function EditOfferForm() {
  const { offerId } = useParams();
  const navigate = useNavigate();

  // Estados para los campos del formulario
  const [nomOffert, setNomOffert] = useState("");
  const [nomEntreprise, setNomEntreprise] = useState("");
  const [adresseEntreprise, setAdresseEntreprise] = useState("");
  const [typePoste, setTypePoste] = useState("");
  const [salaire, setSalaire] = useState("");
  const [description, setDescription] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [loading, setLoading] = useState(false); // Para controlar la carga
  const [error, setError] = useState(null); // Para manejar errores

  // Precargar los datos de la oferta seleccionada
  useEffect(() => {
    const fetchOfferDetails = async () => {
      if (!offerId) {
        alert("Aucune offre sélectionnée.");
        navigate("/offers"); // Redirige si no hay oferta seleccionada
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Solicitud GET para obtener los detalles de la oferta
        const response = await axios.get(`${API_IP}/offers/${offerId}`);
        const data = response.data;

        // Precargar los campos con los datos obtenidos
        setNomOffert(data.nom_offert);
        setNomEntreprise(data.nom_entreprise);
        setAdresseEntreprise(data.adresse_entreprise);
        setTypePoste(data.type_poste);
        setSalaire(data.salaire.toString());
        setDescription(data.description);
        setDateDebut(data.date_debut);
        setDateFin(data.date_fin);
      } catch (err) {
        console.error("Erreur lors du chargement de l'offre :", err);
        setError("Erreur lors du chargement de l'offre.");
      } finally {
        setLoading(false);
      }
    };

    fetchOfferDetails();
  }, [offerId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      // Solicitud PUT para actualizar la oferta
      await axios.put(`${API_IP}/offers/${offerId}`, {
        nom_offert: nomOffert,
        nom_entreprise: nomEntreprise,
        adresse_entreprise: adresseEntreprise,
        type_poste: typePoste,
        salaire: parseFloat(salaire),
        description,
        date_debut: dateDebut,
        date_fin: dateFin,
      });

      alert("Offre mise à jour avec succès !");
      navigate("/offers"); // Redirige a la página de ofertas después de guardar
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'offre :", err);
      alert("Erreur lors de la mise à jour de l'offre.");
    }
  };

  if (loading) {
    return <p>Chargement des détails de l'offre...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="offre-container">
      <h2 className="offre-title">Modifier l'Offre</h2>
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
          Sauvegarder
        </button>
      </form>
    </div>
  );
}

export default EditOfferForm;
