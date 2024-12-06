import React, { useState } from "react";
import "./Chatbot.css";
import axios from "axios";
import { API_IP } from "../config";

function Chatbot({ profil_id, user_id, plan_id }) {
  const [isOpen, setIsOpen] = useState(false); // Estado para mostrar u ocultar el chatbot
  const [messages, setMessages] = useState([]); // Mensajes enviados y recibidos
  const [userMessage, setUserMessage] = useState(""); // Mensaje actual del usuario

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    // Añadir el mensaje del usuario al historial
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);

    // Simular una respuesta del chatbot
    try {
      const isCandidat = profil_id === 2;
      var response = null;
      if (isCandidat) {
        response = await axios.get(`${API_IP}/chat/candidat`, {
          params: { candidat_id: user_id, question: userMessage },
        });
      } else {
        response = await axios.get(`${API_IP}/chat/recruiter`, {
          params: { recruiter_id: user_id, question: userMessage },
        });
      }
      console.info(response.data);

      // Añadir la respuesta del chatbot al historial
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: response.data["answer"] },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Erreur lors de l'obtention de la réponse du chatbot.",
        },
      ]);
    }

    // Limpiar el campo de entrada
    setUserMessage("");
  };

  return (
    <div className={`chatbot-container ${isOpen ? "open" : ""}`}>
      <button className="chatbot-toggle" onClick={handleToggleChat}>
        💬
      </button>
      {isOpen && (
        <div className="chatbot">
          <div className="chatbot-header">
            <h4>Chatbot</h4>
            <button onClick={handleToggleChat}>&times;</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender === "user" ? "user" : "bot"}`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Écrire un message..."
            />
            <button onClick={handleSendMessage}>Envoyer</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
