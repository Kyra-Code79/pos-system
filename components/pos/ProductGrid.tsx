'use client';

import { useState, useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Package } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Product {
    id: string;
    name: string;
    price: number | string; // Prisma uses string/Decimal 
    stock: number;
    category: string;
    image?: string | null;
}

interface ProductGridProps {
    products: any[]; // Using any to handle prisma Decimal/string matching loosely
    categories: string[];
    onAddToCart: (product: Product) => void;
}

export function ProductGrid({ products, categories, onAddToCart }: ProductGridProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, selectedCategory]);

    return (
        <div className="flex flex-col h-full gap-4">
            {/* Filters */}
            <div className="flex gap-2 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>
                {/* Horizontal Scroll for categories if many */}
                <div className="flex gap-2 overflow-x-auto pb-2 max-w-[50%] no-scrollbar">
                    <Button
                        variant={selectedCategory === 'all' ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory('all')}
                        className="whitespace-nowrap"
                    >
                        All
                    </Button>
                    {categories.map(cat => (
                        <Button
                            key={cat}
                            variant={selectedCategory === cat ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(cat)}
                            className="whitespace-nowrap"
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pb-20 pr-2">
                {filteredProducts.map((product) => (
                    <Card
                        key={product.id}
                        className="cursor-pointer hover:border-primary transition-all active:scale-95 flex flex-col justify-between"
                        onClick={() => onAddToCart(product)}
                    >
                        <CardContent className="p-4 pt-4">
                            <div className="aspect-square bg-muted rounded-md mb-2 flex items-center justify-center overflow-hidden">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
                                ) : (
                                    <Package className="h-8 w-8 text-muted-foreground opacity-50" />
                                )}
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-medium leading-tight line-clamp-2" title={product.name}>{product.name}</h3>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-bold">Rp {Number(product.price).toLocaleString('id-ID')}</span>
                                    <Badge variant={product.stock > 10 ? "secondary" : "destructive"} className="text-[10px] px-1 h-5">
                                        {product.stock} left
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {filteredProducts.length === 0 && (
                    <div className="col-span-full h-40 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                        No products found.
                    </div>
                )}
            </div>
        </div>
    );
}
