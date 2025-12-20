
import prisma from '../lib/prisma';

async function main() {
    console.log('Cleaning up invalid data...');

    // 1. Find invalid products (price < 1000)
    // Note: We use 1000 as a safe threshold for "thousands"
    const invalidProducts = await prisma.product.findMany({
        where: {
            price: {
                lt: 1000
            }
        }
    });

    const invalidProductIds = invalidProducts.map(p => p.id);
    console.log(`Found ${invalidProductIds.length} invalid products.`);

    // 2. Find invalid orders (total < 1000) which are likely old test data
    const invalidOrders = await prisma.order.findMany({
        where: {
            totalAmount: {
                lt: 1000
            }
        }
    });

    const invalidOrderIds = invalidOrders.map(o => o.id);
    console.log(`Found ${invalidOrderIds.length} invalid orders.`);

    // 3. Delete OrderItems related to invalid Orders OR invalid Products
    // We must do this first due to foreign key constraints
    const deletedItems = await prisma.orderItem.deleteMany({
        where: {
            OR: [
                { orderId: { in: invalidOrderIds } },
                { productId: { in: invalidProductIds } }
            ]
        }
    });
    console.log(`Deleted ${deletedItems.count} invalid order items.`);

    // 4. Delete the invalid Orders
    const deletedOrders = await prisma.order.deleteMany({
        where: {
            id: { in: invalidOrderIds }
        }
    });
    console.log(`Deleted ${deletedOrders.count} invalid orders.`);

    // 5. Delete the invalid Products
    const deletedProducts = await prisma.product.deleteMany({
        where: {
            id: { in: invalidProductIds }
        }
    });
    console.log(`Deleted ${deletedProducts.count} invalid products.`);

    console.log('Cleanup finished.');
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
