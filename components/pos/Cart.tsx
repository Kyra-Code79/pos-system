'use client';

import { Button } from "@/components/ui/button";

import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface CartProps {
    items: CartItem[];
    onUpdateQuantity: (id: string, newQuantity: number) => void;
    onRemove: (id: string) => void;
    onCheckout: () => void;
    isProcessing: boolean;
}

export function Cart({ items, onUpdateQuantity, onRemove, onCheckout, isProcessing }: CartProps) {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = 0; // Assuming tax is included or 0 for now
    const total = subtotal + tax;

    if (items.length === 0) {
        return (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground">
                <ShoppingCart className="mb-4 h-12 w-12 opacity-20" />
                <h3 className="text-lg font-semibold">Cart is empty</h3>
                <p className="text-sm">Select products from the grid to add them to the order.</p>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Current Order
                </h2>
                <span className="text-xs font-medium bg-secondary px-2 py-1 rounded-full">
                    {items.length} items
                </span>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between space-x-4">
                            <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium leading-none">{item.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    Rp {item.price.toLocaleString('id-ID')}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                                    disabled={isProcessing}
                                >
                                    <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm font-medium">
                                    {item.quantity}
                                </span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                    disabled={isProcessing}
                                >
                                    <Plus className="h-3 w-3" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => onRemove(item.id)}
                                    disabled={isProcessing}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-4 bg-muted/20 border-t space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    {/* Add Tax/Discount here if needed */}
                    <div className="flex justify-between text-base font-bold pt-2 border-t">
                        <span>Total</span>
                        <span>Rp {total.toLocaleString()}</span>
                    </div>
                </div>
                <Button
                    className="w-full"
                    size="lg"
                    onClick={onCheckout}
                    disabled={isProcessing}
                >
                    Checkout (Rp {total.toLocaleString()})
                </Button>
            </div>
        </div>
    );
}
