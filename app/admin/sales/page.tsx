import prisma from '@/lib/prisma';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ExportButtons } from '@/components/ExportButtons';

import { formatCurrency } from '@/lib/utils';
import { DateRangePicker } from '@/components/DateRangePicker';
import { CashierFilter } from '@/components/CashierFilter';
import { SalesBarChart } from '@/components/charts/SalesBarChart';
import { PaginationControls } from '@/components/PaginationControls';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SalesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    // Await searchParams before using properties
    const resolvedSearchParams = await searchParams;
    const from = resolvedSearchParams?.from as string | undefined;
    const to = resolvedSearchParams?.to as string | undefined;
    const cashierId = resolvedSearchParams?.cashierId as string | undefined;

    // Pagination Params
    const page = Number(resolvedSearchParams?.page) || 1;
    const limit = Number(resolvedSearchParams?.limit) || 25;
    const skip = (page - 1) * limit;

    const where: any = {};

    // Date Filter
    if (from || to) {
        where.createdAt = {};
        if (from) {
            where.createdAt.gte = new Date(from);
        }
        if (to) {
            const toDate = new Date(to);
            toDate.setHours(23, 59, 59, 999);
            where.createdAt.lte = toDate;
        }
    }

    // Cashier Filter
    if (cashierId) {
        where.cashierId = cashierId;
    }

    // 1. Fetch TOTAL Count for Pagination
    const totalItems = await prisma.order.count({ where });
    const totalPages = Math.ceil(totalItems / limit);

    // 2. Fetch All Filtered Data for Chart and Export (No Separation for now to keep it consistent, but separate query might be better if pagination is small)
    // Actually, to display Correct Chart, we need ALL filtered data, not just the page.
    // So we need TWO queries.

    // queryAll: For Chart & Export
    const allFilteredOrders = await prisma.order.findMany({
        where: where,
        orderBy: { createdAt: 'desc' },
        include: {
            cashier: { select: { name: true } },
            items: true
        }
    });

    // queryPaginated: For Table
    const paginatedOrders = await prisma.order.findMany({
        where: where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: skip,
        include: {
            cashier: { select: { name: true } },
            items: true
        }
    });

    // 2. Fetch Cashiers for Filter Dropdown
    const cashiers = await prisma.user.findMany({
        where: { role: 'CASHIER' },
        select: { id: true, name: true }
    });

    const formattedPaginatedOrders = paginatedOrders.map((order: any) => ({
        id: order.id,
        date: order.createdAt.toLocaleDateString(),
        cashier: order.cashier.name,
        total: Number(order.totalAmount),
        status: order.status,
        itemCount: order.items.length
    }));

    // Data for Chart (Aggegrated from ALL filtered data)
    const salesMap = new Map<string, number>();
    allFilteredOrders.forEach((order: any) => {
        const date = order.createdAt.toISOString().split('T')[0];
        const current = salesMap.get(date) || 0;
        salesMap.set(date, current + Number(order.totalAmount));
    });

    const salesData = Array.from(salesMap.entries())
        .map(([name, total]) => ({ name, total }))
        .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

    // Data for Export (ALL filtered data)
    const formattedAllOrders = allFilteredOrders.map((order: any) => ({
        id: order.id,
        date: order.createdAt.toLocaleDateString(),
        cashier: order.cashier.name,
        total: Number(order.totalAmount),
        status: order.status,
        itemCount: order.items.length
    }));

    const pdfRows = formattedAllOrders.map((item: any) => [
        item.date,
        item.cashier,
        formatCurrency(item.total),
        item.status
    ]);

    const excelData = formattedAllOrders.map((item: any) => ({
        Date: item.date,
        Cashier: item.cashier,
        Total: item.total,
        Status: item.status,
        Items: item.itemCount,
        'Order ID': item.id
    }));

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <h1 className="text-lg font-semibold md:text-2xl">Sales History</h1>
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    <CashierFilter cashiers={cashiers} />
                    <DateRangePicker />
                    <ExportButtons
                        data={excelData}
                        filename="sales_history"
                        pdfTitle="Sales History"
                        pdfColumns={['Date', 'Cashier', 'Total', 'Status']}
                        pdfRows={pdfRows}
                    />
                </div>
            </div>

            {/* Sales Chart Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <SalesBarChart data={salesData} />
                </CardContent>
            </Card>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Cashier</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {formattedPaginatedOrders.map((order: any) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.date}</TableCell>
                                <TableCell>{order.cashier}</TableCell>
                                <TableCell>{order.itemCount}</TableCell>
                                <TableCell>{formatCurrency(order.total)}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{order.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <PaginationControls
                currentPage={page}
                totalPages={totalPages}
                limit={limit}
                totalItems={totalItems}
            />
        </div>
    );
}
