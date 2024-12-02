import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UpdateCV from "./UpdateCV";
import "./UpdateUser.css"; // Estilos específicos

function UpdateUser({ userId, isRecruiter }) {
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [profilId, setProfilId] = useState("");
  const [planId, setPlanId] = useState("");
  const [password, setPassword] = useState(""); // Nuevo campo para la contraseña
  const [loading, setLoading] = useState(false); // Para controlar la carga
  const [error, setError] = useState(null); // Para manejar errores

  // Cargar los datos del usuario al iniciar el componente
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        alert("Aucun utilisateur sélectionné.");
        navigate("/users"); // Redirige si no hay usuario seleccionado
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/utilisateurs/${userId}`
        );
        const data = response.data;

        // Actualiza los estados con los datos del usuario
        setNom(data.nom || "");
        setPrenom(data.prenom || "");
        setEmail(data.email || "");
        setProfilId(data.profil_id || "");
        setPlanId(data.plan_id || "");
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données utilisateur:",
          error
        );
        alert("Impossible de charger les informations utilisateur.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, navigate]); // Solo se ejecuta cuando cambia el userId

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!nom || !prenom || !email) {
      alert("Tous les champs obligatoires doivent être remplis.");
      return;
    }

    try {
      await axios.put(`http://127.0.0.1:8000/utilisateurs/${userId}`, {
        nom,
        prenom,
        email,
        profil_id: profilId ? parseInt(profilId) : null,
        plan_id: planId ? parseInt(planId) : null,
        mot_de_passe: password || undefined, // Solo enviar si se modificó
      });

      alert("Données mises à jour avec succès.");
      navigate("/offers");
    } catch (error) {
      console.error("Erreur lors de la mise à jour des données:", error);
      alert("Un problème est survenu lors de la mise à jour des données.");
    }
  };

  if (loading) {
    return <p>Chargement des détails de l'utilisateur...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="update-user-container">
      {/* Modificación de datos personales */}
      <div className="update-user-form">
        <h2>Modifier les Données Personnelles</h2>
        <form onSubmit={handleUpdate}>
          <div className="form-field">
            <label>Nom:</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label>Prénom:</label>
            <input
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label>Rôle:</label>
            <select
              value={profilId}
              onChange={(e) => setProfilId(e.target.value)}
              required
            >
              <option value="">Sélectionner un Rôle</option>
              <option value="1">Recruteur</option>{" "}
              {/* ID del rol en el backend */}
              <option value="2">Candidat</option>{" "}
              {/* ID del rol en el backend */}
            </select>
          </div>
          <div className="form-field">
            <label>Type de Plan:</label>
            <select
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
              required
            >
              <option value="">Sélectionner un Plan</option>
              <option value="1">Basic</option> {/* ID del plan en el backend */}
              <option value="2">Pro</option> {/* ID del plan en el backend */}
              <option value="3">Entreprise</option>{" "}
              {/* ID del plan en el backend */}
            </select>
          </div>
          <div className="form-field">
            <label>Mot de Passe:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Laisser vide si inchangé"
            />
          </div>
          <button type="submit" className="update-button">
            Enregistrer les Données Personnelles
          </button>
        </form>
      </div>

      {!isRecruiter && (
        <div className="update-cv-section">
          <UpdateCV userId={userId} isRecruiter={isRecruiter} />
        </div>
      )}
    </div>
  );
}

export default UpdateUser;
