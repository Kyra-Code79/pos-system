import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface ReceiptData {
    orderId: string;
    items: CartItem[];
    totalAmount: number;
    paymentMethod: string;
    cashReceived?: number;
    change?: number;
    tableNumber?: number;
    date: Date;
    cashierName?: string;
    storeSettings?: {
        storeName: string;
        storeAddress: string;
        storePhone: string;
    }
}

export const generateReceipt = (data: ReceiptData) => {
    // Standard 80mm thermal receipt width is approx 80mm. 
    // We can set PDF size to roughly that width. 
    // Height can be auto or fixed large enough.
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 200] // 80mm width, 200mm height
    });

    const centerX = 40;
    let currentY = 10;

    // Header
    doc.setFontSize(14);
    doc.text(data.storeSettings?.storeName || "Acme POS", centerX, currentY, { align: 'center' });
    currentY += 6;

    doc.setFontSize(8);
    doc.text(data.storeSettings?.storeAddress || "Jalan Raya No. 123, Jakarta", centerX, currentY, { align: 'center' });
    currentY += 4;
    doc.text(`Tel: ${data.storeSettings?.storePhone || "021-12345678"}`, centerX, currentY, { align: 'center' });
    currentY += 8;

    // Order Info
    doc.setFontSize(8);
    doc.text(`Date: ${data.date.toLocaleString('id-ID')}`, 5, currentY);
    currentY += 4;
    doc.text(`Order ID: #${data.orderId.slice(-6)}`, 5, currentY);
    currentY += 4;
    if (data.tableNumber) {
        doc.text(`Table: ${data.tableNumber}`, 5, currentY);
        currentY += 4;
    }
    if (data.cashierName) {
        doc.text(`Cashier: ${data.cashierName}`, 5, currentY);
        currentY += 4;
    }

    doc.line(5, currentY, 75, currentY); // Separator
    currentY += 2;

    // Items
    const tableData = data.items.map(item => [
        item.name,
        `${item.quantity} x ${item.price.toLocaleString('id-ID')}`,
        (item.quantity * item.price).toLocaleString('id-ID')
    ]);

    autoTable(doc, {
        startY: currentY,
        head: [],
        body: tableData,
        theme: 'plain',
        styles: { fontSize: 8, cellPadding: 1, overflow: 'linebreak' },
        columnStyles: {
            0: { cellWidth: 35 }, // Name
            1: { cellWidth: 20 }, // Qty x Price
            2: { cellWidth: 15, halign: 'right' } // Total
        },
        margin: { left: 5, right: 5 }
    });

    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 4;

    doc.line(5, currentY, 75, currentY); // Separator
    currentY += 4;

    // Totals
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL", 5, currentY);
    doc.text(`Rp ${data.totalAmount.toLocaleString('id-ID')}`, 75, currentY, { align: 'right' });
    currentY += 6;

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");

    doc.text("Payment Type", 5, currentY);
    doc.text(data.paymentMethod, 75, currentY, { align: 'right' });
    currentY += 4;

    if (data.cashReceived) {
        doc.text("Cash", 5, currentY);
        doc.text(`Rp ${data.cashReceived.toLocaleString('id-ID')}`, 75, currentY, { align: 'right' });
        currentY += 4;
    }

    if (data.change !== undefined) {
        doc.text("Change", 5, currentY);
        doc.text(`Rp ${data.change.toLocaleString('id-ID')}`, 75, currentY, { align: 'right' });
        currentY += 4;
    }

    currentY += 6;
    doc.setFontSize(8);
    doc.text("Thank You for Visiting!", centerX, currentY, { align: 'center' });

    // Save
    doc.save(`receipt-${data.orderId}.pdf`);
};
