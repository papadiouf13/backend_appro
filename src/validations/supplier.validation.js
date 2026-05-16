const { body } = require('express-validator');

const supplierValidation = [
  body('nom')
    .trim()
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2, max: 200 }).withMessage('Le nom doit contenir entre 2 et 200 caractères'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('L\'email doit être valide')
    .normalizeEmail(),
  body('telephone')
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage('Le téléphone ne peut pas dépasser 20 caractères'),
  body('adresse')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('L\'adresse ne peut pas dépasser 500 caractères'),
];

module.exports = { supplierValidation };
