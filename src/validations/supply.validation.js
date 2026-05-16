const { body } = require('express-validator');

const supplyValidation = [
  body('productId')
    .notEmpty().withMessage('Le produit est requis')
    .isInt({ min: 1 }).withMessage('L\'identifiant du produit doit être un entier positif'),
  body('supplierId')
    .notEmpty().withMessage('Le fournisseur est requis')
    .isInt({ min: 1 }).withMessage('L\'identifiant du fournisseur doit être un entier positif'),
  body('quantite')
    .notEmpty().withMessage('La quantité est requise')
    .isInt({ min: 1 }).withMessage('La quantité doit être un entier supérieur à 0'),
  body('prixAchat')
    .notEmpty().withMessage('Le prix d\'achat est requis')
    .isFloat({ min: 0 }).withMessage('Le prix d\'achat doit être un nombre positif'),
  body('dateApprovisionnement')
    .optional()
    .isISO8601().withMessage('La date doit être au format ISO 8601'),
];

module.exports = { supplyValidation };
