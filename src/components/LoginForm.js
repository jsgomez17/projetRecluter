import React, { useState } from "react";
import axios from "axios";

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Enviar datos al backend
      const response = await axios.post(
        "http://127.0.0.1:8000/utilisateurs/login",
        {
          email,
          mot_de_passe: password,
        }
      );

      const { user } = response.data;
      onLogin(user); // Pasar los datos del usuario al estado global en App.js
    } catch (error) {
      console.error(
        "Erreur lors de la connexion:",
        error.response?.data || error.message
      );
      alert("Email ou mot de passe incorrect");
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Login</h2>
      <form onSubmit={handleLogin} style={formStyle}>
        <div style={fieldStyle}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div style={fieldStyle}>
          <label>Mot de Passe:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>
          Connexion
        </button>
      </form>
    </div>
  );
}

// Estilos básicos para el formulario
const containerStyle = {
  maxWidth: "500px",
  margin: "auto",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#f9f9f9",
};

const titleStyle = {
  textAlign: "center",
  color: "#333",
  fontSize: "1.8em",
  marginBottom: "20px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
};

const fieldStyle = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "15px",
};

const inputStyle = {
  padding: "10px",
  fontSize: "1em",
  borderRadius: "4px",
  border: "1px solid #ccc",
  marginTop: "5px",
};

const buttonStyle = {
  padding: "10px",
  fontSize: "1em",
  borderRadius: "4px",
  border: "none",
  backgroundColor: "#333",
  color: "#fff",
  cursor: "pointer",
  marginTop: "20px",
};

export default LoginForm;
