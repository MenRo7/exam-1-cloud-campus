// gateway/server.js
const express = require('express');
const dotenv = require('dotenv');
//const authProxy = require('./routes/auth');
const notifiProxy = require('./routes/notifi');
const stockProxy = require('./routes/stock');

dotenv.config();

const app = express();

// Middleware pour analyser les requêtes JSON
app.use(express.json());

// Routes principales pour chaque microservice
//app.use('/auth', authProxy);
app.use('/notify', notifiProxy);
app.use('/update-stock', stockProxy);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'gateway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Lancer le Gateway
const PORT = process.env.GATEWAY_PORT || 8000;
app.listen(PORT, () => {
  console.log(`Gateway opérationnel sur le port ${PORT}`);
});