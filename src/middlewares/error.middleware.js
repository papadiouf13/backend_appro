const ApiError = require('../utils/ApiError');

const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Erreur interne du serveur';
  let errors = err.errors || [];

  // Prisma errors
  if (err.code === 'P2002') {
    statusCode = 409;
    message = 'Cette valeur existe déjà (contrainte d\'unicité)';
  } else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Ressource introuvable';
  } else if (err.code === 'P2003') {
    statusCode = 400;
    message = 'Référence invalide (clé étrangère)';
  } else if (err.code === 'P2014') {
    statusCode = 400;
    message = 'Impossible de supprimer : des données liées existent';
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', {
      statusCode,
      message,
      stack: err.stack,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorMiddleware;
