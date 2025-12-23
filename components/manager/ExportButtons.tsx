'use client';

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getExportData } from "@/lib/actions/transactions";
import { getStoreSettings } from "@/lib/actions/settings";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

interface ExportButtonsProps {
    transactions: any[];
    salesData: any[];
    allowRangeSelection?: boolean;
}

export function ExportButtons({ transactions, salesData, allowRangeSelection = false }: ExportButtonsProps) {
    const [loading, setLoading] = useState(false);

    const handleExport = async (type: 'excel' | 'pdf', range?: string) => {
        setLoading(true);
        try {
            let dataToExport = transactions;

            // If range is provided, fetch fresh data
            if (range) {
                dataToExport = await getExportData(range);
            }

            if (type === 'excel') {
                exportToExcel(dataToExport);
            } else {
                await exportToPDF(dataToExport);
            }
        } catch (error) {
            console.error("Export failed", error);
        } finally {
            setLoading(false);
        }
    };

    const exportToExcel = (data: any[]) => {
        const wb = XLSX.utils.book_new();

        // Sheet 1: Transactions
        const wsTransactions = XLSX.utils.json_to_sheet(data.map(t => ({
            ID: t.id,
            Date: new Date(t.date).toLocaleString(),
            Cashier: t.cashier,
            Amount: t.amount,
            Status: t.status,
            Payment: t.paymentMethod
        })));
        XLSX.utils.book_append_sheet(wb, wsTransactions, "Transactions");

        if (!allowRangeSelection && salesData && salesData.length > 0) {
            // Sheet 2: Daily Sales (Only for dashboard view)
            const wsSales = XLSX.utils.json_to_sheet(salesData);
            XLSX.utils.book_append_sheet(wb, wsSales, "Daily Sales");
        }

        XLSX.writeFile(wb, "Manager_Report.xlsx");
    };

    const exportToPDF = async (data: any[]) => {
        const doc = new jsPDF();
        const settings = await getStoreSettings() as any;

        // Header
        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(settings.storeName, pageWidth / 2, 20, { align: "center" });

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(settings.storeAddress, pageWidth / 2, 26, { align: "center" });

        const contact = `Phone: ${settings.storePhone}${settings.storeFax ? ` | Fax: ${settings.storeFax}` : ''}`;
        doc.text(contact, pageWidth / 2, 32, { align: "center" });

        if (settings.storeEmail) {
            doc.text(`Email: ${settings.storeEmail}`, pageWidth / 2, 38, { align: "center" });
        }

        // Title & Date
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Sales Report", 14, 50);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 56);

        // Sales Table
        const salesRows = data.map(t => [
            new Date(t.date).toLocaleDateString(),
            t.id.substring(0, 8) + '...', // Truncate ID
            t.cashier,
            formatCurrency(Number(t.amount)),
            t.paymentMethod
        ]);

        autoTable(doc, {
            head: [['Date', 'ID', 'Cashier', 'Amount', 'Payment']],
            body: salesRows,
            startY: 65,
        });

        doc.save("Sales_Report.pdf");
    };

    if (allowRangeSelection) {
        return (
            <div className="flex gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" disabled={loading}>
                            <Download className="mr-2 h-4 w-4" />
                            Export Excel
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleExport('excel', 'week')}>Last 1 Week</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('excel', 'month')}>Last 1 Month</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('excel', 'year')}>Last 1 Year</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('excel', 'all')}>All Time</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" disabled={loading}>
                            <Download className="mr-2 h-4 w-4" />
                            Export PDF
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleExport('pdf', 'week')}>Last 1 Week</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('pdf', 'month')}>Last 1 Month</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('pdf', 'year')}>Last 1 Year</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('pdf', 'all')}>All Time</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        )
    }

    // Default view for Dashboard (exports current view data)
    return (
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
                <Download className="mr-2 h-4 w-4" />
                Export Excel
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
            </Button>
        </div>
    );
}
