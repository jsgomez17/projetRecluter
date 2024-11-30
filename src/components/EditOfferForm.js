import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditOfferForm() {
  const { offerId } = useParams(); // Obtén el ID de la oferta desde la URL
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null); // Datos de la oferta

  useEffect(() => {
    // Obtener los datos de la oferta
    const fetchOffer = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/offers/${offerId}`
        );
        setOffer(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement de l'offre:", error);
      }
    };
    fetchOffer();
  }, [offerId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOffer({ ...offer, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/offers/${offerId}`, offer);
      alert("Offre modifiée avec succès !");
      navigate("/offers"); // Redirige a la lista de ofertas
    } catch (error) {
      console.error("Erreur lors de la modification de l'offre:", error);
    }
  };

  if (!offer) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="edit-offer-container">
      <h2>Modifier l'offre</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nom de l'offre:
          <input
            type="text"
            name="nom_offert"
            value={offer.nom_offert}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Entreprise:
          <input
            type="text"
            name="nom_entreprise"
            value={offer.nom_entreprise}
            onChange={handleInputChange}
          />
        </label>
        {/* Resto de los campos */}
        <button type="submit">Enregistrer</button>
      </form>
    </div>
  );
}

export default EditOfferForm;
