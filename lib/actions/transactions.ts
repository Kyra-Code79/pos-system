'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { startOfDay, endOfDay, subDays, startOfWeek, startOfMonth, startOfYear } from 'date-fns';

export async function getTransactions({
    page = 1,
    limit = 25,
    search = '',
    dateFrom,
    dateTo,
}: {
    page?: number;
    limit?: number;
    search?: string;
    dateFrom?: Date;
    dateTo?: Date;
}) {
    const session = await auth();
    // @ts-ignore
    if (!session?.user?.id || (session.user.role !== 'MANAGEMENT' && session.user.role !== 'ADMIN')) {
        throw new Error('Unauthorized');
    }

    const where: any = {
        status: 'COMPLETED',
    };

    if (search) {
        where.OR = [
            { id: { contains: search, mode: 'insensitive' } },
            { cashier: { name: { contains: search, mode: 'insensitive' } } },
            { paymentMethod: { contains: search, mode: 'insensitive' } },
        ];
    }

    if (dateFrom || dateTo) {
        where.createdAt = {};
        if (dateFrom) where.createdAt.gte = startOfDay(dateFrom);
        if (dateTo) where.createdAt.lte = endOfDay(dateTo);
    }

    const [transactions, total] = await prisma.$transaction([
        prisma.order.findMany({
            where,
            include: {
                cashier: {
                    select: { name: true },
                },
            },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.order.count({ where }),
    ]);

    const formattedTransactions = transactions.map(order => ({
        id: order.id,
        date: order.createdAt,
        cashier: order.cashier?.name || 'Unknown',
        amount: Number(order.totalAmount),
        status: order.status,
        paymentMethod: order.paymentMethod,
    }));

    return {
        transactions: formattedTransactions,
        total,
        pageCount: Math.ceil(total / limit),
    };
}

export async function getExportData(range: string) {
    const session = await auth();
    // @ts-ignore
    if (!session?.user?.id || (session.user.role !== 'MANAGEMENT' && session.user.role !== 'ADMIN')) {
        throw new Error('Unauthorized');
    }

    let from = new Date();
    const to = endOfDay(new Date());

    switch (range) {
        case 'week':
            from = subDays(new Date(), 7);
            break;
        case 'month':
            from = subDays(new Date(), 30);
            break;
        case 'year':
            from = subDays(new Date(), 365);
            break;
        case 'today':
            from = startOfDay(new Date());
            break;
        default:
            from = subDays(new Date(), 30); // Default to month
    }

    const orders = await prisma.order.findMany({
        where: {
            createdAt: {
                gte: from,
                lte: to,
            },
            status: 'COMPLETED',
        },
        include: {
            cashier: {
                select: { name: true },
            },
        },
        orderBy: { createdAt: 'desc' },
    });

    return orders.map(order => ({
        id: order.id,
        date: order.createdAt,
        cashier: order.cashier?.name || 'Unknown',
        amount: Number(order.totalAmount),
        status: order.status,
        paymentMethod: order.paymentMethod,
    }));
}
