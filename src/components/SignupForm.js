import React, { useState } from "react";

function SignupForm({ onSignup }) {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rol, setRol] = useState("");
  const [plan, setPlan] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      onSignup({ nom, prenom, email, rol, plan, password });
    } else {
      alert("Las contraseñas no coinciden");
    }
  };

  // Opciones de plan según el rol seleccionado
  const getPlanOptions = () => {
    if (rol === "Candidat") {
      return ["Básico", "Pro"];
    } else if (rol === "Recruteur") {
      return ["Básico", "Enterprise"];
    }
    return [];
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Inscrire</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={fieldStyle}>
          <label>Nom:</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div style={fieldStyle}>
          <label>Prénom:</label>
          <input
            type="text"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
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
          <label>Rôle:</label>
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            required
            style={inputStyle}
          >
            <option value="">Sélectionnez un Rôle</option>
            <option value="Candidat">Candidat</option>
            <option value="Recruteur">Recruteur</option>
          </select>
        </div>
        <div style={fieldStyle}>
          <label>Type de Plan:</label>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            required
            style={inputStyle}
          >
            <option value="">Sélectionner un Plan</option>
            {getPlanOptions().map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
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
        <div style={fieldStyle}>
          <label>Confirmer le mot de passe:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>
          S'enregistrer
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

export default SignupForm;
