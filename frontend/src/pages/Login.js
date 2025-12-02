// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!credentials.username || credentials.username.trim() === '') {
      newErrors.username = 'Le nom d\'utilisateur est requis';
    }

    if (!credentials.password || credentials.password.trim() === '') {
      newErrors.password = 'Le mot de passe est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation côté client
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        credentials
      );
      const { token, role, username } = response.data;

      // Stockage du token et rôle dans le localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);

      navigate("/"); // Redirige vers la page d'accueil après la connexion
    } catch (error) {
      // Gestion des erreurs
      if (error.response) {
        // Erreur renvoyée par le serveur
        const { message } = error.response.data;
        alert(message); // Affiche un message à l'utilisateur (vous pouvez remplacer par un toast)
      } else {
        // Erreur réseau ou autre
        console.error("Erreur réseau ou serveur", error);
        alert("Une erreur est survenue. Veuillez réessayer.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Connexion</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={credentials.username}
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
            className={`border p-2 w-full ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Mot de passe"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            className={`border p-2 w-full ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 w-full rounded"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
};

export default Login;
