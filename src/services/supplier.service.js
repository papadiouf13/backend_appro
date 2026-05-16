const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');

const create = async (data) => {
  return prisma.supplier.create({ data });
};

const findAll = async () => {
  return prisma.supplier.findMany({
    include: { _count: { select: { supplies: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

const findById = async (id) => {
  const supplier = await prisma.supplier.findUnique({
    where: { id },
    include: { supplies: { include: { product: true } } },
  });
  if (!supplier) throw ApiError.notFound('Fournisseur introuvable');
  return supplier;
};

const update = async (id, data) => {
  await findById(id);
  return prisma.supplier.update({ where: { id }, data });
};

const remove = async (id) => {
  const supplier = await prisma.supplier.findUnique({
    where: { id },
    include: { _count: { select: { supplies: true } } },
  });
  if (!supplier) throw ApiError.notFound('Fournisseur introuvable');
  if (supplier._count.supplies > 0) {
    throw ApiError.badRequest('Impossible de supprimer un fournisseur lié à des approvisionnements');
  }
  return prisma.supplier.delete({ where: { id } });
};

module.exports = { create, findAll, findById, update, remove };
