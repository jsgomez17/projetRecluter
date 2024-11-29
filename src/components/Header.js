import React from "react";
import { Link } from "react-router-dom";

function Header({ isAuthenticated, onLogout, profil_id }) {
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
        <h1 style={titleStyle}>Smart Recruit</h1>
      </div>
      <nav>
        <Link to="/" style={linkStyle}>
          Accueil
        </Link>
        {isAuthenticated ? (
          <>
            <Link to="/offers" style={linkStyle}>
              Offres d'emploi
            </Link>
            {isAuthenticated && profil_id === 2 && (
              <Link to="/applications" style={linkStyle}>
                Mes Candidatures
              </Link>
            )}
            <button onClick={onLogout} style={buttonStyle}>
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>
              Login
            </Link>
            <Link to="/signup" style={linkStyle}>
              Inscrire
            </Link>
          </>
        )}
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

const buttonStyle = {
  backgroundColor: "#ff4d4f",
  color: "#fff",
  border: "none",
  padding: "8px 15px",
  borderRadius: "4px",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
};

export default Header;
