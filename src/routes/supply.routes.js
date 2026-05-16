const express = require('express');
const router = express.Router();
const supplyController = require('../controllers/supply.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { supplyValidation } = require('../validations/supply.validation');
const validate = require('../middlewares/validate.middleware');

router.use(authenticate);

router.post('/', supplyValidation, validate, supplyController.create);
router.get('/', supplyController.findAll);
router.get('/:id', supplyController.findById);
router.put('/:id', supplyController.update);
router.delete('/:id', supplyController.remove);

module.exports = router;
