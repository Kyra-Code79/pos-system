'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function getPosProducts(query?: string, category?: string) {
    const session = await auth();
    console.log('[DEBUG] getPosProducts session:', JSON.stringify(session, null, 2));

    if (!session?.user?.id) {
        console.error('[DEBUG] Unauthorized: session.user.id missing');
        throw new Error('Unauthorized');
    }

    try {
        const where: any = {
            stock: { gt: 0 }, // Only fetch products with stock > 0
        };

        if (query) {
            where.name = { contains: query, mode: 'insensitive' };
        }

        if (category && category !== 'all') {
            where.category = category;
        }

        const products = await prisma.product.findMany({
            where,
            orderBy: { name: 'asc' },
        });

        console.log(`[DEBUG] Found ${products.length} products`);

        return products.map((product) => ({
            ...product,
            price: product.price.toNumber(),
        }));
    } catch (error) {
        console.error('Failed to fetch products:', error);
        throw new Error('Failed to fetch products.');
    }
}

export async function getCategories() {
    try {
        const categories = await prisma.product.findMany({
            select: { category: true },
            distinct: ['category'],
        });
        return categories.map((c) => c.category);
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        return [];
    }
}

type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
};

export async function createOrder(
    items: CartItem[],
    totalAmount: number,
    paymentMethod: string,
    tableNumber?: number
) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, message: 'Unauthorized' };
    }

    if (!items || items.length === 0) {
        return { success: false, message: 'Cart is empty.' };
    }

    const userId = session!.user!.id!;

    try {
        await prisma.$transaction(async (tx) => {
            // 1. Create Order
            const order = await tx.order.create({
                data: {
                    totalAmount,
                    status: 'COMPLETED',
                    cashierId: userId,
                    paymentMethod,
                    tableNumber: tableNumber ? tableNumber : null,
                },
            });

            // 2. Create OrderItems and Update Stock
            for (const item of items) {
                // Check stock first
                const product = await tx.product.findUnique({
                    where: { id: item.id },
                });

                if (!product || product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for product: ${item.name}`);
                }

                await tx.orderItem.create({
                    data: {
                        orderId: order.id,
                        productId: item.id,
                        productName: item.name,
                        quantity: item.quantity,
                        price: item.price,
                    },
                });

                await tx.product.update({
                    where: { id: item.id },
                    data: { stock: { decrement: item.quantity } },
                });
            }

            // Log audit
            // Note: Importing inside transaction might be tricky if not careful, but dynamic import is fine.
            // However, to keep it simple and avoid potential issues, we might just log after transaction or inside.
        });

        // Log action (outside transaction for simplicity, or we can assume if transaction failed we don't log)
        const { logAction, AuditAction, AuditEntity } = await import('@/lib/audit');
        await logAction(
            session.user.id,
            AuditAction.CREATE,
            AuditEntity.ORDER,
            `Created order with ${items.length} items. Total: ${totalAmount}`
        );

        revalidatePath('/admin/products');
        revalidatePath('/admin/sales');

        return { success: true, message: 'Order created successfully.' };
    } catch (error: any) {
        console.error('Failed to create order:', error);
        return { success: false, message: error.message || 'Failed to create order.' };
    }
}
