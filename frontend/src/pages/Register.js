// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Effacer l'erreur du champ modifié
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validation username
    if (!formData.username || formData.username.trim() === '') {
      newErrors.username = 'Le nom d\'utilisateur est requis';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
    }

    // Validation email
    if (!formData.email || formData.email.trim() === '') {
      newErrors.email = 'L\'email est requis';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Format d\'email invalide';
      }
    }

    // Validation password
    if (!formData.password || formData.password.trim() === '') {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
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
      await axios.post(`${API_BASE_URL}/auth/register`, formData);
      alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      navigate('/login');
    } catch (err) {
      //console.error('Erreur lors de l\'inscription', err);
      if (err.response) {
        // Erreur renvoyée par le serveur
        const { message } = err.response.data;
        alert(message); // Affiche un message à l'utilisateur (vous pouvez remplacer par un toast)
      } else {
        // Erreur réseau ou autre
        console.error("Erreur réseau ou serveur", err);
        alert("Une erreur est survenue. Veuillez réessayer.");
      }
      //setError('Une erreur est survenue lors de la création du compte.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Inscription</h2>
        <div className="mb-4">
          <input
            type="text"
            name="username"
            placeholder="Nom d'utilisateur"
            value={formData.username}
            onChange={handleChange}
            className={`border p-2 w-full ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>
        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Adresse email"
            value={formData.email}
            onChange={handleChange}
            className={`border p-2 w-full ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <div className="mb-4">
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            className={`border p-2 w-full ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">S'inscrire</button>
      </form>
    </div>
  );
};

export default Register;
