import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import LoginForm from "./components/LoginForm";
import Footer from "./components/Footer";
import SignupForm from "./components/SignupForm";
import JobOffers from "./components/JobOffers"; // Nuevo componente de ofertas
import Accueil from "./components/Accueil";
import TeleverserCVForm from "./components/TeleverserCVForm";
import Postulants from "./components/Postulants";
import OffreForm from "./components/OffreForm";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para autenticación
  const [user, setUser] = useState(null); // Información del usuario autenticado
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    // Almacena el token en el localStorage
    localStorage.setItem("authToken", userData.token);
    navigate("/offers"); // Redirigir siempre a la página de ofertas después del login
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    navigate("/"); // Redirigir a la página de inicio después del logout
  };

  return (
    <div>
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <main style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route
            path="/offers"
            element={
              isAuthenticated ? (
                <JobOffers profil_id={user?.profil_id} user_id={user?.id} />
              ) : (
                <p>Veuillez vous connecter pour voir les offres.</p>
              )
            }
          />
          <Route path="/upload-cv" element={<TeleverserCVForm />} />
          <Route path="/offre-form" element={<OffreForm />} />
          <Route path="/postulants/:offerId" element={<Postulants />} />{" "}
          {/* Nueva ruta */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
