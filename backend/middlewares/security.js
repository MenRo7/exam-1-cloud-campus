// backend/middlewares/security.js
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('../config/logger');

// Configuration Helmet pour headers HTTP sécurisés
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Rate Limiting général pour toutes les API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requêtes par IP
  message: 'Trop de requêtes depuis cette IP, réessayez dans 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit dépassé', {
      ip: req.ip,
      path: req.path
    });
    res.status(429).json({
      error: 'Trop de requêtes, réessayez plus tard'
    });
  }
});

// Rate limiting strict pour l'authentification
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 tentatives de connexion
  message: 'Trop de tentatives de connexion, réessayez dans 15 minutes',
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    logger.warn('Rate limit auth dépassé', {
      ip: req.ip,
      username: req.body?.username
    });
    res.status(429).json({
      error: 'Trop de tentatives de connexion, réessayez plus tard'
    });
  }
});

// Configuration CORS sécurisée
const corsOptions = () => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'https://votre-app.vercel.app'
  ];

  return {
    origin: function(origin, callback) {
      // Autoriser les requêtes sans origin (mobile apps, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1 ||
          allowedOrigins.some(allowed => allowed.includes('*') && origin.includes(allowed.replace('*', '')))) {
        callback(null, true);
      } else {
        logger.warn('CORS bloqué', { origin });
        callback(new Error('Non autorisé par CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };
};

module.exports = {
  helmetConfig,
  apiLimiter,
  authLimiter,
  corsOptions
};
