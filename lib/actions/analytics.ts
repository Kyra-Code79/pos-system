'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';

export async function getAnalyticsData(dateRange?: { from: Date; to: Date }) {
    const session = await auth();
    // @ts-ignore
    if (!session?.user?.id || (session.user.role !== 'MANAGEMENT' && session.user.role !== 'ADMIN')) {
        throw new Error('Unauthorized');
    }

    // Default to last 30 days if no range provided
    const to = dateRange?.to ? endOfDay(dateRange.to) : endOfDay(new Date());
    const from = dateRange?.from ? startOfDay(dateRange.from) : startOfDay(subDays(new Date(), 30));

    try {
        // 1. Fetch Orders within range
        const orders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: from,
                    lte: to,
                },
                status: 'COMPLETED',
            },
            include: {
                items: true,
                cashier: {
                    select: { name: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // 2. Calculate Sales Over Time (Group by Date)
        const salesMap = new Map<string, number>();
        orders.forEach(order => {
            const dateKey = format(order.createdAt, 'yyyy-MM-dd');
            const amount = Number(order.totalAmount);
            salesMap.set(dateKey, (salesMap.get(dateKey) || 0) + amount);
        });

        // Fill in missing days (optional, can be done on frontend or skipped)
        // For simplicity, let's just return mapped data sorted by date
        const salesOverTime = Array.from(salesMap.entries())
            .map(([date, total]) => ({ date, total }))
            .sort((a, b) => a.date.localeCompare(b.date));

        // 3. Calculate Sales by Category
        // We need to aggregate items. Since items don't store category explicitly (Product does),
        // we might need to fetch products or rely on item names if perfectly mapped.
        // Better: Fetch all items for these orders and include Product to get category.

        // Actually, let's do a separate Prisma aggregation if possible, or just iterate since we have items.
        // Note: items in OrderItem don't reference Product category directly unless we include Product.

        // Let's re-fetch items specific to these orders with product details
        const orderIds = orders.map(o => o.id);
        const orderItems = await prisma.orderItem.findMany({
            where: { orderId: { in: orderIds } },
            include: { product: { select: { category: true } } },
        });

        const categoryMap = new Map<string, number>();
        orderItems.forEach(item => {
            const category = item.product?.category || 'Uncategorized';
            const amount = Number(item.price) * item.quantity;
            categoryMap.set(category, (categoryMap.get(category) || 0) + amount);
        });

        const salesByCategory = Array.from(categoryMap.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        // 4. Transform Orders for Table
        const transactions = orders.map(order => ({
            id: order.id,
            date: order.createdAt,
            cashier: order.cashier?.name || 'Unknown',
            amount: Number(order.totalAmount),
            status: order.status,
            paymentMethod: order.paymentMethod,
        }));

        return {
            salesOverTime,
            salesByCategory,
            transactions,
        };
    } catch (error) {
        console.error('Failed to fetch analytics:', error);
        throw new Error('Failed to fetch analytics data');
    }
}
