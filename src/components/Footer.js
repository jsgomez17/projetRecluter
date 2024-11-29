import React from "react";

function Footer() {
  return (
    <footer style={footerStyle}>
      <div style={footerContainerStyle}>
        <p style={footerTextStyle}>
          © {new Date().getFullYear()} Smart Recruit. Tous les droits sont
          réservés.
        </p>
      </div>
    </footer>
  );
}

// Estilos básicos para el footer
const footerStyle = {
  backgroundColor: "#333",
  color: "#fff",
  padding: "20px 0",
  textAlign: "center",
  marginTop: "40px",
};

const footerContainerStyle = {
  maxWidth: "800px",
  margin: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const footerTextStyle = {
  marginBottom: "10px",
  fontSize: "0.9em",
};

const footerLinkHoverStyle = {
  backgroundColor: "#555",
};

// Agrega un estilo para hover en los enlaces del footer
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
  .footer a:hover {
    background-color: ${footerLinkHoverStyle.backgroundColor};
  }
`;
document.head.appendChild(styleSheet);

export default Footer;
