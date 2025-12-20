import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

import prisma from '../lib/prisma';

async function main() {
  // 1. Create Default Users (One for each role)

  // Hash password (using 'password123' for all)
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@pos.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@pos.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@pos.com' },
    update: {},
    create: {
      name: 'Store Manager',
      email: 'manager@pos.com',
      password: hashedPassword,
      role: 'MANAGEMENT',
    },
  });

  const cashier = await prisma.user.upsert({
    where: { email: 'cashier@pos.com' },
    update: {},
    create: {
      name: 'John Cashier',
      email: 'cashier@pos.com',
      password: hashedPassword,
      role: 'CASHIER',
    },
  });

  console.log({ admin, manager, cashier });

  // 2. Create Dummy Products
  const products = [
    { name: 'Nasi Goreng Special', category: 'Food', price: 25000, stock: 100, barcode: '1001' },
    { name: 'Mie Goreng Ayam', category: 'Food', price: 20000, stock: 80, barcode: '1002' },
    { name: 'Es Teh Manis', category: 'Drink', price: 5000, stock: 200, barcode: '2001' },
    { name: 'Kopi Susu Gula Aren', category: 'Drink', price: 18000, stock: 50, barcode: '2002' },
    { name: 'Roti Bakar Coklat', category: 'Snack', price: 15000, stock: 40, barcode: '3001' },
    { name: 'Pisang Goreng Keju', category: 'Snack', price: 12000, stock: 30, barcode: '3002' },
    { name: 'Ayam Geprek Sambal Matah', category: 'Food', price: 30000, stock: 60, barcode: '1003' },
    { name: 'Jus Alpukat', category: 'Drink', price: 15000, stock: 40, barcode: '2003' },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: {
        ...product,
        barcode: `BC-${Math.floor(Math.random() * 10000)}`, // Random barcode
      },
    });
  }

  console.log('Seeding completed.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });