// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // modèle utilisateur
require('dotenv').config();
const axios = require('axios');
const authLog = require('debug')('authRoutes:console');
const logger = require('../config/logger');
//const sendEmail = require('../services/emailService');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  authLog(`username is ${username} password is ${password}`);

  // Log de tentative de connexion
  logger.info('Tentative de connexion', {
    username,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  try {
    const user = await User.findOne({ username });
    authLog(`user is ${JSON.stringify(user)}`)

    if (!user) {
      // Audit : tentative de connexion échouée - utilisateur inexistant
      logger.warn('Tentative de connexion échouée - utilisateur inexistant', {
        username,
        ip: req.ip
      });
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Audit : tentative de connexion échouée - mot de passe incorrect
      logger.warn('Tentative de connexion échouée - mot de passe incorrect', {
        username,
        userId: user._id,
        ip: req.ip
      });
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    authLog(`token is ${token}`)

    // Audit : connexion réussie
    logger.audit('USER_LOGIN', user._id, {
      username: user.username,
      role: user.role,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({ token, role: user.role, username: user.username });
  } catch (error) {
    logger.error('Erreur lors de la connexion', {
      error: error.message,
      stack: error.stack,
      username
    });
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  authLog(`username is ${username} email is ${email} password is ${password}`);

  // Log de tentative d'inscription
  logger.info('Tentative d\'inscription', {
    username,
    email,
    ip: req.ip
  });

  try {
    // Vérifier si l'email ou le nom d'utilisateur existe déjà
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      authLog(`user exist => ${JSON.stringify(existingUser)}`)
      logger.warn('Tentative d\'inscription avec email existant', {
        email,
        ip: req.ip
      });
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Créer un nouvel utilisateur
    const user = new User({ username, email, password });
    await user.save();

    authLog(`user after creation => ${JSON.stringify(user)}`)

    // Audit : nouvel utilisateur créé
    logger.audit('USER_REGISTERED', user._id, {
      username: user.username,
      email: user.email,
      role: user.role,
      ip: req.ip
    });

    // Envoyer un email de bienvenue
    // await sendEmail(
    //   email,
    //   'Bienvenue dans notre application',
    //   `Bonjour ${username},\n\nMerci de vous être inscrit. Nous sommes ravis de vous accueillir !`
    // );

    // await axios.post('http://localhost:4002/notify', {
    //   to: email,
    //   subject: 'Bienvenue dans notre application',
    //   text: `Bonjour ${username},\n\nMerci de vous être inscrit. Nous sommes ravis de vous accueillir !`,
    // });

    res.status(201).json({ message: 'Utilisateur créé avec succès.' });
  } catch (error) {
    logger.error('Erreur lors de l\'inscription', {
      error: error.message,
      stack: error.stack,
      username,
      email
    });
    res.status(500).json({ message: 'Une erreur est survenue.' });
  }
};