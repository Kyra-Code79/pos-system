'use client';

import { useState, useCallback } from 'react';
import { ProductGrid } from './ProductGrid';
import { Cart } from './Cart';
import { CheckoutDialog } from './CheckoutDialog';
import { createOrder } from '@/lib/actions/pos';
import { toast } from 'sonner';
import { generateReceipt } from '@/lib/utils/receipt';

interface PosInterfaceProps {
    products: any[];
    categories: string[];
    storeSettings: any;
}

export function PosInterface({ products: initialProducts, categories, storeSettings }: PosInterfaceProps) {
    const [products, setProducts] = useState(initialProducts); // Local state for immediate stock updates
    const [cart, setCart] = useState<any[]>([]);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const addToCart = useCallback((product: any) => {
        setCart(currentCart => {
            const existingItem = currentCart.find(item => item.id === product.id);
            if (existingItem) {
                // Check stock
                if (existingItem.quantity >= product.stock) {
                    toast.error(`Not enough stock for ${product.name}`);
                    return currentCart;
                }
                return currentCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...currentCart, {
                    id: product.id,
                    name: product.name,
                    price: Number(product.price),
                    quantity: 1
                }];
            }
        });
    }, []);

    const updateQuantity = useCallback((id: string, newQuantity: number) => {
        if (newQuantity === 0) {
            setCart(current => current.filter(item => item.id !== id));
            return;
        }

        setCart(current => {
            // Basic stock check against initial products (not perfect but good for offline-ish feel)
            const product = products.find(p => p.id === id);
            if (product && newQuantity > product.stock) {
                toast.error(`Max stock reached for ${product.name}`);
                return current;
            }

            return current.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            );
        });
    }, [products]);

    const removeFromCart = useCallback((id: string) => {
        setCart(current => current.filter(item => item.id !== id));
    }, []);

    const handleCheckout = async (paymentMethod: string, tableNumber: number, cashReceived?: number) => {
        setIsProcessing(true);
        try {
            const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            const result = await createOrder(cart, totalAmount, paymentMethod, tableNumber);

            console.log("CreateOrder Result:", result);

            if (result && result.success) {
                toast.success('Order placed successfully!');
                setCart([]);
                setIsCheckoutOpen(false);
                // Ideally refresh products here to get new stock
                // In a real app we might use router.refresh() or SWR
                // For now, let's just decrement local stock to reflect change immediately
                // Generate Receipt
                generateReceipt({
                    orderId: `ORD-${Date.now()}`,
                    items: cart,
                    totalAmount: total,
                    paymentMethod,
                    tableNumber,
                    cashReceived,
                    change: cashReceived ? cashReceived - total : 0,
                    date: new Date(),
                    storeSettings,
                    // cashierName: session?.user?.name 
                });

                setProducts(current => current.map(p => {
                    const cartItem = cart.find(c => c.id === p.id);
                    if (cartItem) {
                        return { ...p, stock: p.stock - cartItem.quantity };
                    }
                    return p;
                }));
            } else {
                toast.error(result.message || 'Failed to place order.');
            }
        } catch (error) {
            toast.error('Something went wrong.');
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="flex h-[calc(100vh-theme(spacing.16))] gap-4 p-4 mt-1">
            {/* Left: Product Grid */}
            <div className="flex-1 min-w-0 bg-background rounded-lg border shadow-sm p-4 overflow-hidden">
                <ProductGrid
                    products={products}
                    categories={categories}
                    onAddToCart={addToCart}
                />
            </div>

            {/* Right: Cart */}
            <div className="w-[350px] shrink-0 bg-background rounded-lg border shadow-sm overflow-hidden flex flex-col">
                <Cart
                    items={cart}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                    onCheckout={() => setIsCheckoutOpen(true)}
                    isProcessing={isProcessing}
                />
            </div>

            <CheckoutDialog
                open={isCheckoutOpen}
                onOpenChange={setIsCheckoutOpen}
                totalAmount={total}
                onConfirm={handleCheckout}
                isProcessing={isProcessing}
            />
        </div>
    );
}
