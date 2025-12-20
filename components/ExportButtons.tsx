'use client';

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportToExcel, exportToPDF } from "@/lib/export";

interface ExportButtonsProps {
    data: any[];
    filename?: string;
    pdfColumns?: string[];
    pdfTitle?: string;
    pdfRows?: any[][]; // Pre-calculated rows for PDF
}

export function ExportButtons({
    data,
    filename = 'export',
    pdfColumns = [],
    pdfTitle = 'Export',
    pdfRows = []
}: ExportButtonsProps) {

    const handleExportExcel = () => {
        exportToExcel(data, filename);
    };

    const handleExportPDF = () => {
        exportToPDF(pdfTitle, pdfColumns, pdfRows, filename);
    };

    return (
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportExcel}>
                <Download className="mr-2 h-4 w-4" />
                Excel
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <Download className="mr-2 h-4 w-4" />
                PDF
            </Button>
        </div>
    );
}
