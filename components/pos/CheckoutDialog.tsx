'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { QrCode, Banknote, CreditCard, Wallet } from 'lucide-react';
import { cn } from "@/lib/utils";

interface CheckoutDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    totalAmount: number;
    onConfirm: (paymentMethod: string, tableNumber: number, cashReceived?: number) => Promise<void>;
    isProcessing: boolean;
}

const PAYMENT_METHODS = [
    { id: 'CASH', name: 'Cash', icon: Banknote },
    { id: 'QR', name: 'QR Code', icon: QrCode },
    { id: 'OVO', name: 'OVO', icon: Wallet },
    { id: 'DANA', name: 'DANA', icon: Wallet },
    { id: 'GOPAY', name: 'GoPay', icon: Wallet },
];

export function CheckoutDialog({ open, onOpenChange, totalAmount, onConfirm, isProcessing }: CheckoutDialogProps) {
    const [selectedMethod, setSelectedMethod] = useState('CASH');
    const [tableNumber, setTableNumber] = useState('');
    const [cashReceived, setCashReceived] = useState('');

    // Derived state for change calculation
    const cashVal = parseFloat(cashReceived) || 0;
    const change = cashVal - totalAmount;

    // Simulate QR Code ID
    const qrCodeId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const handleConfirm = async () => {
        if (!tableNumber) {
            alert('Please enter a table number');
            return;
        }

        if (selectedMethod === 'CASH' && cashVal < totalAmount) {
            alert('Insufficient cash received');
            return;
        }

        await onConfirm(selectedMethod, parseInt(tableNumber), selectedMethod === 'CASH' ? cashVal : undefined);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Checkout</DialogTitle>
                    <DialogDescription>
                        Complete the payment for the order.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Total Amount Display */}
                    <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
                        <span className="text-sm font-medium">Total Amount</span>
                        <span className="text-2xl font-bold">
                            Rp {totalAmount.toLocaleString('id-ID')}
                        </span>
                    </div>

                    <div className="grid gap-2">
                        <Label>Table Number</Label>
                        <Input
                            type="number"
                            placeholder="Enter table number (e.g. 1)"
                            value={tableNumber}
                            onChange={(e) => setTableNumber(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Payment Method</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {PAYMENT_METHODS.map((method) => {
                                const Icon = method.icon;
                                return (
                                    <div
                                        key={method.id}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-3 rounded-md border cursor-pointer hover:bg-muted/50 transition-colors",
                                            selectedMethod === method.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-muted-foreground/20"
                                        )}
                                        onClick={() => setSelectedMethod(method.id)}
                                    >
                                        <Icon className="h-6 w-6 mb-2" />
                                        <span className="text-xs font-medium">{method.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {selectedMethod === 'CASH' && (
                        <div className="grid gap-4 p-4 border rounded-md">
                            <div className="grid gap-2">
                                <Label>Cash Received</Label>
                                <Input
                                    type="number"
                                    placeholder="Amount received"
                                    value={cashReceived}
                                    onChange={(e) => setCashReceived(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t">
                                <span className="font-medium">Change:</span>
                                <span className={cn("font-bold", change < 0 ? "text-red-500" : "text-green-600")}>
                                    Rp {Math.max(0, change).toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>
                    )}

                    {selectedMethod === 'QR' && (
                        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg bg-muted/20">
                            {/* Placeholder for QR Code */}
                            <div className="h-48 w-48 bg-white p-2 rounded shadow-sm flex items-center justify-center mb-4">
                                <QrCode className="h-40 w-40 text-black" />
                            </div>
                            <p className="text-sm font-mono text-muted-foreground tracking-wider">{qrCodeId}</p>
                            <p className="text-xs text-muted-foreground mt-2">Scan to pay Rp {totalAmount.toLocaleString('id-ID')}</p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleConfirm} disabled={isProcessing}>
                        {isProcessing ? 'Processing...' : 'Confirm Payment'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
