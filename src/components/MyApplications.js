import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyApplications.css";
import { API_IP } from "../config";

function MyApplications({ user_id }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`${API_IP}/postulats/applications`, {
          params: { candidat_id: user_id },
        });
        setApplications(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user_id]);

  if (loading) return <p>Chargement...</p>;
  if (error)
    return <p>Erreur lors du chargement des applications: {error.message}</p>;

  return (
    <div className="my-applications-container">
      <h2>Mes Applications</h2>
      <div className="applications-grid">
        {applications.length === 0 ? (
          <p>Aucune application trouvée.</p>
        ) : (
          applications.map((offer) => (
            <div key={offer.id} className="application-card">
              <h3>{offer.nom_offert}</h3>
              <p>
                <strong>Entreprise:</strong> {offer.nom_entreprise}
              </p>
              <p>
                <strong>Adresse:</strong> {offer.adresse_entreprise}
              </p>
              <p>
                <strong>Type de Poste:</strong> {offer.type_poste}
              </p>
              <p>
                <strong>Salaire:</strong> {offer.salaire} $
              </p>
              <p className="description">
                <strong>Description:</strong> {offer.description}
              </p>
              <p>
                <strong>Date début:</strong>{" "}
                {new Date(offer.date_debut).toLocaleDateString()}
              </p>
              <p>
                <strong>Date fin:</strong>{" "}
                {new Date(offer.date_fin).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyApplications;
