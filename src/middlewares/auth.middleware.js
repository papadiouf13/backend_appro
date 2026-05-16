const { verifyToken } = require('../utils/generateToken');
const ApiError = require('../utils/ApiError');

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Token manquant ou invalide');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(ApiError.unauthorized('Token invalide'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Token expiré'));
    }
    next(error);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(ApiError.forbidden('Vous n\'avez pas les droits pour cette action'));
    }
    next();
  };
};

module.exports = { authenticate, authorize };
