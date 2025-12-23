'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransactionTable } from "@/components/manager/TransactionTable";
import { ExportButtons } from "@/components/manager/ExportButtons";
import { DateRangePicker } from "@/components/DateRangePicker";
import { getTransactions } from "@/lib/actions/transactions";
import { DateRange } from "react-day-picker";

export function TransactionHistoryClient() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalHelper, setTotalHelper] = useState(0);

    // Filters
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(25);

    // Get date range from URL (managed by DateRangePicker)
    const dateFrom = searchParams.get('from') ? new Date(searchParams.get('from')!) : undefined;
    const dateTo = searchParams.get('to') ? new Date(searchParams.get('to')!) : undefined;

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 500);
        return () => clearTimeout(timer);
    }, [search, page, limit, searchParams]); // Add searchParams to dependency

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getTransactions({
                page,
                limit,
                search,
                dateFrom,
                dateTo
            });
            setTransactions(data.transactions);
            setTotalHelper(data.total);
        } catch (error) {
            console.error("Failed to fetch transactions", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-2 items-center w-full md:w-auto">
                    <Input
                        placeholder="Search cashier, order ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-[300px]"
                    />
                    <DateRangePicker />
                </div>
                <div className="flex gap-2 items-center">
                    <ExportButtons transactions={[]} salesData={[]} allowRangeSelection={true} />
                </div>
            </div>

            <div className="rounded-md border p-4">
                <TransactionTable transactions={transactions} />
                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Rows per page</span>
                        <Select
                            value={limit.toString()}
                            onValueChange={(val) => setLimit(Number(val))}
                        >
                            <SelectTrigger className="w-[70px]">
                                <SelectValue placeholder="25" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                        >
                            Previous
                        </Button>
                        <span className="text-sm flex items-center">Page {page}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={transactions.length < limit}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
