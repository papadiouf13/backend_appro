const supplyService = require('../services/supply.service');

const create = async (req, res, next) => {
  try {
    const supply = await supplyService.create(req.body);
    res.status(201).json({ success: true, message: 'Approvisionnement enregistré avec succès', data: supply });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const supplies = await supplyService.findAll();
    res.json({ success: true, data: supplies, count: supplies.length });
  } catch (error) {
    next(error);
  }
};

const findById = async (req, res, next) => {
  try {
    const supply = await supplyService.findById(Number(req.params.id));
    res.json({ success: true, data: supply });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const supply = await supplyService.update(Number(req.params.id), req.body);
    res.json({ success: true, message: 'Approvisionnement mis à jour avec succès', data: supply });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await supplyService.remove(Number(req.params.id));
    res.json({ success: true, message: 'Approvisionnement supprimé avec succès' });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, findAll, findById, update, remove };
