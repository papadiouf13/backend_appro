const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');

const create = async (data) => {
  return prisma.category.create({ data });
};

const findAll = async () => {
  return prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

const findById = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { products: true },
  });
  if (!category) throw ApiError.notFound('Catégorie introuvable');
  return category;
};

const update = async (id, data) => {
  await findById(id);
  return prisma.category.update({ where: { id }, data });
};

const remove = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });
  if (!category) throw ApiError.notFound('Catégorie introuvable');
  if (category._count.products > 0) {
    throw ApiError.badRequest('Impossible de supprimer une catégorie qui contient des produits');
  }
  return prisma.category.delete({ where: { id } });
};

module.exports = { create, findAll, findById, update, remove };
