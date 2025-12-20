import prisma from '../lib/prisma';
import { addDays, subDays } from 'date-fns';

async function main() {
    console.log('Start seeding sales data...');

    const users = await prisma.user.findMany({
        where: { role: 'CASHIER' }
    });

    if (users.length === 0) {
        console.log('No cashiers found. Please seed users first.');
        return;
    }

    const products = await prisma.product.findMany();
    if (products.length === 0) {
        console.log('No products found. Please seed products first.');
        return;
    }

    // Generate 50 orders over last 30 days
    for (let i = 0; i < 50; i++) {
        const randomDaysAgo = Math.floor(Math.random() * 30);
        const date = subDays(new Date(), randomDaysAgo);

        // Pick random cashier
        const cashier = users[Math.floor(Math.random() * users.length)];

        // Random items (1-5 items per order)
        const itemCount = Math.floor(Math.random() * 5) + 1;
        const orderItems = [];
        let totalAmount = 0;

        for (let j = 0; j < itemCount; j++) {
            const product = products[Math.floor(Math.random() * products.length)];
            const quantity = Math.floor(Math.random() * 3) + 1;
            const price = Number(product.price);

            orderItems.push({
                productId: product.id,
                productName: product.name,
                quantity: quantity,
                price: product.price
            });

            totalAmount += price * quantity;
        }

        await prisma.order.create({
            data: {
                createdAt: date,
                status: 'COMPLETED',
                totalAmount: totalAmount,
                cashierId: cashier.id,
                items: {
                    create: orderItems
                }
            },
        });
    }

    console.log('Seeding sales finished.');
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
