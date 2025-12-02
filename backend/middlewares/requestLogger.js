const morgan = require('morgan');
const logger = require('../config/logger');

// Format personnalisé pour Morgan
morgan.token('user-id', (req) => {
  return req.user ? req.user.id : 'anonymous';
});

// Stream pour envoyer les logs Morgan vers Winston
const stream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

// Configuration Morgan pour logs HTTP détaillés
const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms - User: :user-id - IP: :remote-addr',
  { stream }
);

// Middleware pour logger les erreurs de requêtes
const errorLogger = (err, req, res, next) => {
  logger.error('Request Error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userId: req.user ? req.user.id : 'anonymous',
    body: req.body,
    params: req.params,
    query: req.query
  });
  next(err);
};

module.exports = {
  morganMiddleware,
  errorLogger
};
