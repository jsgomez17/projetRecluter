import React, { useState } from "react";
import "./ModiOffer.css";

const OfferForm = ({ offer, onSave }) => {
  const [offerData, setOfferData] = useState(
    offer || { title: "", description: "", salary: "" }
  );

  const handleOfferChange = (e) => {
    const { name, value } = e.target;
    setOfferData({ ...offerData, [name]: value });
  };

  const handleOfferSubmit = (e) => {
    e.preventDefault();
    onSave(offerData);
  };

  return (
    <div className="modi-offer-container">
      <h2>Modifier une Offre</h2>
      <form onSubmit={handleOfferSubmit}>
        <label>
          Titre:
          <input
            type="text"
            name="title"
            value={offerData.title}
            onChange={handleOfferChange}
          />
        </label>
        <br />
        <label>
          Description:
          <textarea
            name="description"
            value={offerData.description}
            onChange={handleOfferChange}
          />
        </label>
        <br />
        <label>
          Salaire:
          <input
            type="number"
            name="salary"
            value={offerData.salary}
            onChange={handleOfferChange}
          />
        </label>
        <br />
        <button type="submit">Enregistrer les Modifications</button>
      </form>
    </div>
  );
};

export default OfferForm;
