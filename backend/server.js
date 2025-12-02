// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const logger = require('./config/logger');
const { morganMiddleware, errorLogger } = require('./middlewares/requestLogger');
const fs = require('fs');
const path = require('path');

const app = express();

// Créer le dossier logs s'il n'existe pas
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Connexion à la base de données
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Middleware de logging HTTP
app.use(morganMiddleware);

// Log au démarrage
logger.info('Application backend démarrée');

// Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// Route de health check pour monitoring
app.get('/health', (req, res) => {
  logger.info('Health check appelé');
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Middleware de gestion des erreurs (doit être après les routes)
app.use(errorLogger);

// Gestionnaire d'erreur global
app.use((err, req, res, next) => {
  logger.error('Erreur non gérée', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Erreur serveur'
      : err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Serveur en écoute sur le port ${PORT}`, {
    port: PORT,
    nodeEnv: process.env.NODE_ENV || 'development'
  });
  console.log(`Serveur en écoute sur le port ${PORT}`);
});