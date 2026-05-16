const prisma = require('../config/prisma');
const ApiError = require('../utils/ApiError');

const create = async (data) => {
  const { productId, supplierId, quantite, prixAchat, dateApprovisionnement } = data;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw ApiError.notFound('Produit introuvable');

  const supplier = await prisma.supplier.findUnique({ where: { id: supplierId } });
  if (!supplier) throw ApiError.notFound('Fournisseur introuvable');

  // Transaction Prisma pour garantir la cohérence du stock
  const [supply] = await prisma.$transaction([
    prisma.supply.create({
      data: {
        productId,
        supplierId,
        quantite,
        prixAchat,
        ...(dateApprovisionnement && { dateApprovisionnement: new Date(dateApprovisionnement) }),
      },
      include: { product: true, supplier: true },
    }),
    prisma.product.update({
      where: { id: productId },
      data: { stock: { increment: quantite } },
    }),
  ]);

  return supply;
};

const findAll = async () => {
  return prisma.supply.findMany({
    include: { product: { include: { category: true } }, supplier: true },
    orderBy: { createdAt: 'desc' },
  });
};

const findById = async (id) => {
  const supply = await prisma.supply.findUnique({
    where: { id },
    include: { product: { include: { category: true } }, supplier: true },
  });
  if (!supply) throw ApiError.notFound('Approvisionnement introuvable');
  return supply;
};

const update = async (id, data) => {
  const existingSupply = await findById(id);
  const { productId, supplierId, quantite, prixAchat, dateApprovisionnement } = data;

  const oldQuantite = existingSupply.quantite;
  const newQuantite = quantite !== undefined ? quantite : oldQuantite;
  const diffQuantite = newQuantite - oldQuantite;

  // Transaction pour mettre à jour le stock en conséquence
  const [supply] = await prisma.$transaction([
    prisma.supply.update({
      where: { id },
      data: {
        ...(productId && { productId }),
        ...(supplierId && { supplierId }),
        ...(quantite !== undefined && { quantite }),
        ...(prixAchat !== undefined && { prixAchat }),
        ...(dateApprovisionnement && { dateApprovisionnement: new Date(dateApprovisionnement) }),
      },
      include: { product: true, supplier: true },
    }),
    prisma.product.update({
      where: { id: existingSupply.productId },
      data: { stock: { increment: diffQuantite } },
    }),
  ]);

  return supply;
};

const remove = async (id) => {
  const supply = await findById(id);

  // Transaction : supprimer l'approvisionnement et décrémenter le stock
  await prisma.$transaction([
    prisma.supply.delete({ where: { id } }),
    prisma.product.update({
      where: { id: supply.productId },
      data: { stock: { decrement: supply.quantite } },
    }),
  ]);

  return { message: 'Approvisionnement supprimé avec succès' };
};

module.exports = { create, findAll, findById, update, remove };
