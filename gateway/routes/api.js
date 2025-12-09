// gateway/routes/api.js
const express = require('express');
const proxy = require('express-http-proxy');
require('dotenv').config();
const router = express.Router();

const BACKEND_SERVICE_URL = process.env.BACKEND_SERVICE_URL;

router.use('/', proxy(BACKEND_SERVICE_URL, {
  proxyReqPathResolver: (req) => req.originalUrl,
}));

module.exports = router;
