const { body } = require('express-validator');

const productValidation = [
  body('nom')
    .trim()
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2, max: 200 }).withMessage('Le nom doit contenir entre 2 et 200 caractères'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('La description ne peut pas dépasser 1000 caractères'),
  body('prix')
    .notEmpty().withMessage('Le prix est requis')
    .isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif'),
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Le stock doit être un entier positif'),
  body('seuilAlerte')
    .optional()
    .isInt({ min: 0 }).withMessage('Le seuil d\'alerte doit être un entier positif'),
  body('categoryId')
    .notEmpty().withMessage('La catégorie est requise')
    .isInt({ min: 1 }).withMessage('L\'identifiant de la catégorie doit être un entier positif'),
];

module.exports = { productValidation };
