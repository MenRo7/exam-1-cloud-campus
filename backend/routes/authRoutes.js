// backend/routes/authRoutes.js
const express = require('express');
const { body } = require('express-validator');
const { login, register } = require('../controllers/authController');

const router = express.Router();

// Validation pour login
router.post('/login', [
  body('username')
    .trim()
    .notEmpty().withMessage('Le nom d\'utilisateur est requis')
    .isLength({ min: 3 }).withMessage('Le nom d\'utilisateur doit contenir au moins 3 caractères'),
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
], login);

// Validation pour register
router.post('/register', [
  body('username')
    .trim()
    .escape()
    .notEmpty().withMessage('Le nom d\'utilisateur est requis')
    .isLength({ min: 3, max: 30 }).withMessage('Le nom d\'utilisateur doit contenir entre 3 et 30 caractères')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores'),
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Format d\'email invalide')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
    .isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre')
], register);

module.exports = router;
