'use client';

import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TransactionTableProps {
    transactions: any[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [filterQuery, setFilterQuery] = useState("");

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedTransactions = [...transactions]
        .filter(t =>
            t.cashier.toLowerCase().includes(filterQuery.toLowerCase()) ||
            t.id.toLowerCase().includes(filterQuery.toLowerCase()) ||
            t.paymentMethod.toLowerCase().includes(filterQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (!sortConfig) return 0;
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

    return (
        <div className="space-y-4">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter transactions..."
                    value={filterQuery}
                    onChange={(event) => setFilterQuery(event.target.value)}
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">
                                <Button variant="ghost" onClick={() => handleSort('date')}>
                                    Date
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead>Order ID</TableHead>
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('cashier')}>
                                    Cashier
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead className="text-right">
                                <Button variant="ghost" onClick={() => handleSort('amount')}>
                                    Amount
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                </Button>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedTransactions.length ? (
                            sortedTransactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell className="font-medium">
                                        {format(new Date(transaction.date), "dd/MM/yyyy HH:mm")}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">{transaction.id.substring(0, 8)}...</TableCell>
                                    <TableCell>{transaction.cashier}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{transaction.paymentMethod}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatCurrency(transaction.amount)}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
