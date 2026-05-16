const supplierService = require('../services/supplier.service');

const create = async (req, res, next) => {
  try {
    const supplier = await supplierService.create(req.body);
    res.status(201).json({ success: true, message: 'Fournisseur créé avec succès', data: supplier });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const suppliers = await supplierService.findAll();
    res.json({ success: true, data: suppliers, count: suppliers.length });
  } catch (error) {
    next(error);
  }
};

const findById = async (req, res, next) => {
  try {
    const supplier = await supplierService.findById(Number(req.params.id));
    res.json({ success: true, data: supplier });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const supplier = await supplierService.update(Number(req.params.id), req.body);
    res.json({ success: true, message: 'Fournisseur mis à jour avec succès', data: supplier });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await supplierService.remove(Number(req.params.id));
    res.json({ success: true, message: 'Fournisseur supprimé avec succès' });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, findAll, findById, update, remove };
