// src/components/Accueil.js
import React from "react";

function Accueil() {
  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Bienvenue à L'Emploi</h1>
      <p style={subtitleStyle}>
        Une plateforme de recrutement intelligente qui connecte les meilleurs
        les talents avec des opportunités appropriées.
      </p>

      <div style={featuresContainerStyle}>
        <div style={featureStyle}>
          <h3>Correspondance automatique</h3>
          <p>
            Trouver des candidats idéaux en utilisant l’intelligence
            artificielle pour évaluer les CV et offres.
          </p>
        </div>
        <div style={featureStyle}>
          <h3>Lettres de motivation personnalisées</h3>
          <p>
            Génère des lettres adaptées à chaque offre d’emploi rapidement et
            simple.
          </p>
        </div>
        <div style={featureStyle}>
          <h3>Assistance avec Chatbot</h3>
          <p>
            Recevez des conseils en temps réel pour optimiser vos profils et
            offres de travail.
          </p>
        </div>
      </div>

      <button
        style={ctaButtonStyle}
        onClick={() => (window.location.href = "/signup")}
      >
        Inscrivez-vous Maintenant
      </button>
    </div>
  );
}

// Estilos
const containerStyle = {
  maxWidth: "800px",
  margin: "auto",
  padding: "40px 20px",
  textAlign: "center",
  color: "#333",
};

const titleStyle = {
  fontSize: "2.5em",
  fontWeight: "bold",
  color: "#333",
  marginBottom: "10px",
};

const subtitleStyle = {
  fontSize: "1.2em",
  color: "#555",
  marginBottom: "40px",
};

const featuresContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "20px",
  marginBottom: "40px",
};

const featureStyle = {
  flex: "1 1 30%",
  padding: "20px",
  borderRadius: "8px",
  backgroundColor: "#f9f9f9",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

const ctaButtonStyle = {
  padding: "12px 24px",
  fontSize: "1em",
  borderRadius: "5px",
  backgroundColor: "#333",
  color: "#fff",
  cursor: "pointer",
  border: "none",
};

export default Accueil;
