const categoryService = require('../services/category.service');

const create = async (req, res, next) => {
  try {
    const category = await categoryService.create(req.body);
    res.status(201).json({ success: true, message: 'Catégorie créée avec succès', data: category });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const categories = await categoryService.findAll();
    res.json({ success: true, data: categories, count: categories.length });
  } catch (error) {
    next(error);
  }
};

const findById = async (req, res, next) => {
  try {
    const category = await categoryService.findById(Number(req.params.id));
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const category = await categoryService.update(Number(req.params.id), req.body);
    res.json({ success: true, message: 'Catégorie mise à jour avec succès', data: category });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await categoryService.remove(Number(req.params.id));
    res.json({ success: true, message: 'Catégorie supprimée avec succès' });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, findAll, findById, update, remove };
