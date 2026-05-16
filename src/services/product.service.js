const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');

const create = async (data) => {
  const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
  if (!category) throw ApiError.notFound('Catégorie introuvable');
  return prisma.product.create({ data, include: { category: true } });
};

const findAll = async () => {
  return prisma.product.findMany({
    include: { category: true, _count: { select: { supplies: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

const findById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, supplies: { include: { supplier: true } } },
  });
  if (!product) throw ApiError.notFound('Produit introuvable');
  return product;
};

const update = async (id, data) => {
  await findById(id);
  if (data.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category) throw ApiError.notFound('Catégorie introuvable');
  }
  return prisma.product.update({ where: { id }, data, include: { category: true } });
};

const remove = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { _count: { select: { supplies: true } } },
  });
  if (!product) throw ApiError.notFound('Produit introuvable');
  if (product._count.supplies > 0) {
    throw ApiError.badRequest('Impossible de supprimer un produit lié à des approvisionnements');
  }
  return prisma.product.delete({ where: { id } });
};

const findLowStock = async () => {
  return prisma.product.findMany({
    where: { stock: { gt: 0, lte: prisma.product.fields.seuilAlerte } },
    include: { category: true },
    orderBy: { stock: 'asc' },
  });
};

const findOutOfStock = async () => {
  return prisma.product.findMany({
    where: { stock: 0 },
    include: { category: true },
    orderBy: { nom: 'asc' },
  });
};

// Raw query approach for low stock (stock <= seuilAlerte)
const findLowStockRaw = async () => {
  return prisma.$queryRaw`
    SELECT p.*, c.nom as "categoryNom"
    FROM products p
    LEFT JOIN categories c ON p."categoryId" = c.id
    WHERE p.stock > 0 AND p.stock <= p."seuilAlerte"
    ORDER BY p.stock ASC
  `;
};

module.exports = { create, findAll, findById, update, remove, findLowStock, findOutOfStock, findLowStockRaw };
