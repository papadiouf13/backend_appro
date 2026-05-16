const productService = require('../services/product.service');
const prisma = require('../config/prisma');

const create = async (req, res, next) => {
  try {
    const product = await productService.create(req.body);
    res.status(201).json({ success: true, message: 'Produit créé avec succès', data: product });
  } catch (error) {
    next(error);
  }
};

const findAll = async (req, res, next) => {
  try {
    const products = await productService.findAll();
    res.json({ success: true, data: products, count: products.length });
  } catch (error) {
    next(error);
  }
};

const findById = async (req, res, next) => {
  try {
    const product = await productService.findById(Number(req.params.id));
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const product = await productService.update(Number(req.params.id), req.body);
    res.json({ success: true, message: 'Produit mis à jour avec succès', data: product });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await productService.remove(Number(req.params.id));
    res.json({ success: true, message: 'Produit supprimé avec succès' });
  } catch (error) {
    next(error);
  }
};

const findLowStock = async (req, res, next) => {
  try {
    const products = await prisma.$queryRaw`
      SELECT p.id, p.nom, p.description, p.prix, p.stock, p."seuilAlerte", p."categoryId",
             c.nom as "categoryNom", p."createdAt", p."updatedAt"
      FROM products p
      LEFT JOIN categories c ON p."categoryId" = c.id
      WHERE p.stock > 0 AND p.stock <= p."seuilAlerte"
      ORDER BY p.stock ASC
    `;
    res.json({ success: true, data: products, count: products.length });
  } catch (error) {
    next(error);
  }
};

const findOutOfStock = async (req, res, next) => {
  try {
    const products = await productService.findOutOfStock();
    res.json({ success: true, data: products, count: products.length });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, findAll, findById, update, remove, findLowStock, findOutOfStock };
