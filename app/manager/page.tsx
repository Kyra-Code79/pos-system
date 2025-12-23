import { auth } from "@/auth";
import { getAnalyticsData } from "@/lib/actions/analytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OverviewChart, CategoryPieChart } from "@/components/manager/SalesCharts";
import { TransactionTable } from "@/components/manager/TransactionTable";
import { ExportButtons } from "@/components/manager/ExportButtons";
import { formatCurrency } from "@/lib/utils";
import { DateRangePicker } from "@/components/DateRangePicker";
// Actually, let's keep it simple without DateRangePicker first, or use a simple form to filter.
// For now, let's load default (Last 30 days) and maybe add a simple selector later if needed.

export default async function ManagerPage() {
    const session = await auth();
    const { salesOverTime, salesByCategory, transactions } = await getAnalyticsData();

    // Calculate total revenue
    const totalRevenue = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
    const totalOrders = transactions.length;

    // Limit transactions for display
    const recentTransactions = transactions.slice(0, 25);

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <ExportButtons transactions={transactions} salesData={salesOverTime} />
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold truncate" title={formatCurrency(totalRevenue)}>
                            {formatCurrency(totalRevenue)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sales</CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <rect width="20" height="14" x="2" y="5" rx="2" />
                            <path d="M2 10h20" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{totalOrders}</div>
                        <p className="text-xs text-muted-foreground">
                            +180.1% from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                        <CardDescription>
                            Daily sales performance for the last 30 days.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <OverviewChart data={salesOverTime} />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Sales by Category</CardTitle>
                        <CardDescription>
                            Distribution of sales across categories.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CategoryPieChart data={salesByCategory} />
                    </CardContent>
                </Card>
            </div>

            {/* Transactions Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Sales</CardTitle>
                    <CardDescription>
                        You made {totalOrders} sales this period.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <TransactionTable transactions={recentTransactions} />
                </CardContent>
            </Card>
        </div>
    );
}
