import { useState, useEffect } from "react";
import axios from "axios";
import { API_IP } from "../config";

function useCheckCV(userId) {
  const [hasCV, setHasCV] = useState(null); // `null` indica que no se ha verificado aún
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkCV = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_IP}/cvs/check_cv`, {
          params: { utilisateur_id: userId },
        });
        setHasCV(response.data.has_cv);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      checkCV();
    }
  }, [userId]);

  return { hasCV, loading, error };
}

export default useCheckCV;
