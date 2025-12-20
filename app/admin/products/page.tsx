import { PrismaClient } from '@prisma/client';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { PlusCircle, Pencil, Trash } from 'lucide-react';

import prisma from '@/lib/prisma';

import { formatCurrency } from '@/lib/utils';
import { ExportButtons } from '@/components/ExportButtons';
import { DeleteProductButton } from '@/components/DeleteProductButton';

export default async function ProductsPage() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
    });

    const formattedProducts = products.map((product: any) => ({
        ...product,
        price: Number(product.price), // Convert Decimal to Number
        priceFormatted: formatCurrency(Number(product.price)),
        date: product.createdAt.toLocaleDateString()
    }));

    const pdfRows = formattedProducts.map((item: any) => [
        item.name,
        item.category,
        item.priceFormatted,
        String(item.stock),
        item.date
    ]);

    const excelData = formattedProducts.map((item: any) => ({
        Name: item.name,
        Category: item.category,
        Price: item.price,
        Stock: item.stock,
        Barcode: item.barcode,
        Date: item.date
    }));

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Products</h1>
                <div className="flex gap-2">
                    <ExportButtons
                        data={excelData}
                        filename="products_inventory"
                        pdfTitle="Product Inventory"
                        pdfColumns={['Name', 'Category', 'Price', 'Stock', 'Date']}
                        pdfRows={pdfRows}
                    />
                    <Link href="/admin/products/new">
                        <Button size="sm" className="gap-1">
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Add Product
                            </span>
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="hidden md:table-cell">Stock</TableHead>
                            <TableHead className="hidden md:table-cell">Created at</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product: any) => (
                            <TableRow key={product.id}>
                                <TableCell className="font-medium">
                                    {product.name}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{product.category}</Badge>
                                </TableCell>
                                <TableCell>{formatCurrency(product.price)}</TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {product.stock}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {product.createdAt.toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Link href={`/admin/products/${product.id}/edit`}>
                                            <Button variant="ghost" size="icon">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <DeleteProductButton id={product.id} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
