import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header style={headerStyle}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center" }}>
          <img
            src={`${process.env.PUBLIC_URL}/logo.JPG`}
            alt="Logo"
            style={logoStyle}
          />
        </Link>
        <h1 style={titleStyle}>L´Emploi</h1>
      </div>
      <nav>
        <Link to="/" style={linkStyle}>
          Accueil
        </Link>
        <Link to="/login" style={linkStyle}>
          Login
        </Link>
        <Link to="/signup" style={linkStyle}>
          Inscrire
        </Link>
      </nav>
    </header>
  );
}

// Estilos básicos para el header
const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 20px",
  backgroundColor: "#333",
  color: "#fff",
};

const titleStyle = {
  fontSize: "1.5em",
  margin: 0,
};

const logoStyle = {
  height: "70px",
  marginRight: "20px",
};

const linkStyle = {
  color: "#fff",
  textDecoration: "none",
  margin: "0 10px",
  padding: "8px 15px",
  borderRadius: "4px",
  transition: "background-color 0.3s ease",
};

export default Header;
