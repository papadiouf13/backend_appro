const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { categoryValidation } = require('../validations/category.validation');
const validate = require('../middlewares/validate.middleware');

router.use(authenticate);

router.post('/', categoryValidation, validate, categoryController.create);
router.get('/', categoryController.findAll);
router.get('/:id', categoryController.findById);
router.put('/:id', categoryValidation, validate, categoryController.update);
router.delete('/:id', categoryController.remove);

module.exports = router;
