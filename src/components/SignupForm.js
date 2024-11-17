import React, { useState } from "react";
import axios from "axios";
import "./SignupForm.css"; // Importar el CSS

function SignupForm() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rol, setRol] = useState("");
  const [plan, setPlan] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar contraseñas
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    // Convertir el rol y plan en IDs
    const profil_id = rol === "Candidat" ? 2 : rol === "Recruteur" ? 1 : null;
    const plan_id =
      plan === "Basique"
        ? 1
        : plan === "Pro"
        ? 2
        : plan === "Enterprise"
        ? 3
        : null;

    if (!profil_id || !plan_id) {
      alert("Sélectionnez un rôle et un plan valides");
      return;
    }

    try {
      // Enviar datos al backend
      const response = await axios.post("http://127.0.0.1:8000/utilisateurs", {
        nom,
        prenom,
        email,
        mot_de_passe: password,
        profil_id,
        plan_id,
      });

      // Mostrar éxito
      alert("Utilisateur enregistré avec succès");
      console.log("Réponse du serveur:", response.data);

      // Limpiar el formulario
      setNom("");
      setPrenom("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRol("");
      setPlan("");
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || "Erreur lors de l'enregistrement";

      if (errorMessage === "L'email est déjà enregistré") {
        alert("Cet email est déjà utilisé. Veuillez en utiliser un autre.");
      } else {
        alert(errorMessage);
      }

      console.error("Erreur d'enregistrement:", errorMessage);
    }
  };

  // Opciones de plan según el rol seleccionado
  const getPlanOptions = () => {
    if (rol === "Candidat") {
      return ["Basique", "Pro"];
    } else if (rol === "Recruteur") {
      return ["Basique", "Enterprise"];
    }
    return [];
  };

  return (
    <div className="container">
      <h2 className="title">Inscrire</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="field">
          <label>Nom:</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
            className="input"
          />
        </div>
        <div className="field">
          <label>Prénom:</label>
          <input
            type="text"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
            className="input"
          />
        </div>
        <div className="field">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
          />
        </div>
        <div className="field">
          <label>Rôle:</label>
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            required
            className="input"
          >
            <option value="">Sélectionnez un Rôle</option>
            <option value="Candidat">Candidat</option>
            <option value="Recruteur">Recruteur</option>
          </select>
        </div>
        <div className="field">
          <label>Type de Plan:</label>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            required
            className="input"
          >
            <option value="">Sélectionner un Plan</option>
            {getPlanOptions().map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Mot de Passe:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
        </div>
        <div className="field">
          <label>Confirmer le mot de passe:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="input"
          />
        </div>
        <button type="submit" className="button">
          S'enregistrer
        </button>
      </form>
    </div>
  );
}

export default SignupForm;
