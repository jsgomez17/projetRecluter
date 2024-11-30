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
import PostulerForm from "./components/PostulerForm";
import MyApplications from "./components/MyApplications";
import EditOfferForm from "./components/EditOfferForm";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para autenticación
  const [user, setUser] = useState(null); // Información del usuario autenticado
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    // Almacena el token en el localStorage
    localStorage.setItem("authToken", userData.token);
    localStorage.setItem("user", JSON.stringify(userData));
    navigate("/offers"); // Redirigir siempre a la página de ofertas después del login
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/"); // Redirigir a la página de inicio después del logout
  };

  return (
    <div>
      <Header
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        profil_id={user?.profil_id}
      />
      <main style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route
            path="/offers"
            element={
              isAuthenticated ? (
                <JobOffers
                  profil_id={user?.profil_id}
                  user_id={user?.id}
                  plan_id={user?.plan_id}
                />
              ) : (
                <p>Veuillez vous connecter pour voir les offres.</p>
              )
            }
          />
          <Route path="/upload-cv" element={<TeleverserCVForm />} />
          <Route
            path="/postuler-form/:offerId"
            element={
              isAuthenticated ? (
                <PostulerForm
                  user_id={user?.id}
                  user_plan={user?.plan_id} // Pasar el plan_id
                />
              ) : (
                <p>Veuillez vous connecter pour postuler.</p>
              )
            }
          />
          <Route
            path="/applications"
            element={
              isAuthenticated ? (
                <MyApplications user_id={user?.id} />
              ) : (
                <p>Veuillez vous connecter pour voir vos applications.</p>
              )
            }
          />
          <Route path="/offre-form" element={<OffreForm />} />
          <Route
            path="/postulants/:offerId"
            element={
              isAuthenticated ? <Postulants /> : <p>Veuillez vous connecter.</p>
            }
          />{" "}
          {/* Nueva ruta */}
          <Route
            path="/edit-offer/:offerId"
            element={
              isAuthenticated && user?.profil_id === 1 ? (
                <EditOfferForm />
              ) : (
                <p>Accès non autorisé.</p>
              )
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
