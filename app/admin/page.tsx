import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, DollarSign } from "lucide-react";
import { DashboardCharts } from "@/components/charts/DashboardCharts";

export default async function AdminDashboard() {
    const productCount = await prisma.product.count();
    const userCount = await prisma.user.count();
    const orderCount = await prisma.order.count();

    // Fetch Sales Data for Bar Chart (Last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesRaw = await prisma.order.findMany({
        where: {
            createdAt: {
                gte: thirtyDaysAgo
            },
            status: 'COMPLETED'
        },
        select: {
            createdAt: true,
            totalAmount: true
        },
        orderBy: {
            createdAt: 'asc'
        }
    });

    // Aggregate by Day
    const salesMap = new Map<string, number>();
    salesRaw.forEach((order: any) => {
        const date = order.createdAt.toISOString().split('T')[0];
        const current = salesMap.get(date) || 0;
        salesMap.set(date, current + Number(order.totalAmount));
    });

    const salesData = Array.from(salesMap.entries()).map(([name, total]) => ({
        name,
        total
    }));

    // Fetch Category Data for Pie Chart
    // This is heavier (need to join OrderItem -> Product), usually done with groupBy but Prisma groupBy is limited
    // We'll fetch aggregated order items
    const categoryRaw = await prisma.orderItem.findMany({
        where: {
            order: {
                status: 'COMPLETED'
            }
        },
        include: {
            product: {
                select: {
                    category: true
                }
            }
        }
    });

    const categoryMap = new Map<string, number>();
    categoryRaw.forEach((item: any) => {
        // Handle deleted products (product might be null)
        const category = item.product?.category || 'Uncategorized';
        const current = categoryMap.get(category) || 0;
        categoryMap.set(category, current + 1); // Measuring volume (count), could be revenue
    });

    const categoryData = Array.from(categoryMap.entries()).map(([name, value]) => ({
        name,
        value
    }));


    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Products
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{productCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Users
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orderCount}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-1">
                <DashboardCharts salesData={salesData} categoryData={categoryData} />
            </div>
        </div>
    );
}
