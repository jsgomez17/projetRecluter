import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Postulants.css";

function Postulants() {
  const { offerId } = useParams(); // Obtener el ID de la oferta desde la URL
  const [postulants, setPostulants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPostulants = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/postulants/${offerId}`
        );
        setPostulants(response.data);
      } catch (err) {
        console.error("Error al cargar los postulantes:", err);
        setError(
          "Une erreur s'est produite lors du chargement des postulants."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPostulants();
  }, [offerId]);

  if (loading) {
    return <p>Chargement des postulants...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="postulants-container">
      <h2>Postulants pour l'offre {offerId}</h2>
      {postulants.length === 0 ? (
        <p>Aucun postulant trouvé pour cette offre.</p>
      ) : (
        <table className="postulants-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>CV</th>
            </tr>
          </thead>
          <tbody>
            {postulants.map((postulant) => (
              <tr key={postulant.id}>
                <td>{postulant.nom}</td>
                <td>{postulant.prenom}</td>
                <td>{postulant.email}</td>
                <td>
                  <a
                    href={postulant.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Télécharger
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Postulants;
