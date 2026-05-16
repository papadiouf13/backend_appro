const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@supply.com' },
    update: {},
    create: {
      name: 'Administrateur',
      email: 'admin@supply.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { id: 1 },
      update: {},
      create: { nom: 'Électronique', description: 'Produits électroniques et informatiques' },
    }),
    prisma.category.upsert({
      where: { id: 2 },
      update: {},
      create: { nom: 'Bureautique', description: 'Fournitures de bureau et papeterie' },
    }),
    prisma.category.upsert({
      where: { id: 3 },
      update: {},
      create: { nom: 'Mobilier', description: 'Meubles et équipements de bureau' },
    }),
  ]);
  console.log('✅ Categories created:', categories.length);

  // Create suppliers
  const suppliers = await Promise.all([
    prisma.supplier.upsert({
      where: { id: 1 },
      update: {},
      create: {
        nom: 'Tech Solutions SAS',
        email: 'contact@techsolutions.fr',
        telephone: '+33 1 23 45 67 89',
        adresse: '15 Rue de la République, 75001 Paris',
      },
    }),
    prisma.supplier.upsert({
      where: { id: 2 },
      update: {},
      create: {
        nom: 'Office Pro',
        email: 'ventes@officepro.fr',
        telephone: '+33 1 98 76 54 32',
        adresse: '42 Avenue des Champs, 69000 Lyon',
      },
    }),
  ]);
  console.log('✅ Suppliers created:', suppliers.length);

  // Create products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: 1 },
      update: {},
      create: {
        nom: 'Ordinateur portable Dell XPS',
        description: 'Laptop haute performance 15 pouces',
        prix: 1299.99,
        stock: 25,
        seuilAlerte: 5,
        categoryId: 1,
      },
    }),
    prisma.product.upsert({
      where: { id: 2 },
      update: {},
      create: {
        nom: 'Souris sans fil Logitech',
        description: 'Souris ergonomique sans fil',
        prix: 49.99,
        stock: 3,
        seuilAlerte: 10,
        categoryId: 1,
      },
    }),
    prisma.product.upsert({
      where: { id: 3 },
      update: {},
      create: {
        nom: 'Ramette de papier A4',
        description: '500 feuilles 80g/m²',
        prix: 8.99,
        stock: 0,
        seuilAlerte: 20,
        categoryId: 2,
      },
    }),
  ]);
  console.log('✅ Products created:', products.length);

  // Create supplies
  const supply = await prisma.supply.create({
    data: {
      productId: 1,
      supplierId: 1,
      quantite: 10,
      prixAchat: 950.00,
      dateApprovisionnement: new Date(),
    },
  });
  console.log('✅ Supply created:', supply.id);

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
