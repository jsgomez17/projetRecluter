import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import LoginForm from "./components/LoginForm";
import Footer from "./components/Footer";
import SignupForm from "./components/SignupForm";
import Accueil from "./components/Accueil";
import PersonalAndFileForm from "./components/ModiUser";
import OfferForm from "./components/ModiOffre"; // Cambio aquí para coincidir con el nombre exacto del archivo

function App() {
  return (
    <div>
      <Header />
      <main style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route
            path="/modi-user"
            element={
              <PersonalAndFileForm
                user={{ name: "Jean Dupont", email: "jean.dupont@example.com" }}
                onSavePersonal={(data) =>
                  console.log("Données personnelles sauvegardées :", data)
                }
                onUploadFile={(file) =>
                  console.log("Fichier téléchargé :", file)
                }
              />
            }
          />
          <Route
            path="/modi-offer"
            element={
              <OfferForm
                offer={{
                  title: "Développeur Web",
                  description: "Poste en CDI à Paris",
                  salary: 45000,
                }}
                onSave={(data) => console.log("Offre modifiée :", data)}
              />
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
