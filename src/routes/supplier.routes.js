const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplier.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { supplierValidation } = require('../validations/supplier.validation');
const validate = require('../middlewares/validate.middleware');

router.use(authenticate);

router.post('/', supplierValidation, validate, supplierController.create);
router.get('/', supplierController.findAll);
router.get('/:id', supplierController.findById);
router.put('/:id', supplierValidation, validate, supplierController.update);
router.delete('/:id', supplierController.remove);

module.exports = router;
