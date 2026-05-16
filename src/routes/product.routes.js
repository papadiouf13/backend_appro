const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { productValidation } = require('../validations/product.validation');
const validate = require('../middlewares/validate.middleware');

router.use(authenticate);

// Routes spéciales AVANT les routes paramétrées pour éviter les conflits
router.get('/low-stock', productController.findLowStock);
router.get('/out-of-stock', productController.findOutOfStock);

router.post('/', productValidation, validate, productController.create);
router.get('/', productController.findAll);
router.get('/:id', productController.findById);
router.put('/:id', productValidation, validate, productController.update);
router.delete('/:id', productController.remove);

module.exports = router;
