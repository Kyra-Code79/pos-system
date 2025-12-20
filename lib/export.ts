import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportToPDF = (title: string, columns: string[], data: any[][], filename: string) => {
    const doc = new jsPDF();
    doc.text(title, 14, 20);

    autoTable(doc, {
        startY: 30,
        head: [columns],
        body: data,
    });

    doc.save(`${filename}.pdf`);
};

export const exportToExcel = (data: any[], filename: string) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${filename}.xlsx`);
};
