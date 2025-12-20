"use client"

import { useActionState } from 'react'
import { updateProduct, State } from '@/lib/actions/product'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card"
import Link from 'next/link'

export default function EditProductForm({ product }: { product: any }) {
    const initialState: State = { message: null, errors: {} };
    const updateProductWithId = updateProduct.bind(null, product.id);
    const [state, dispatch] = useActionState(updateProductWithId, initialState);

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Edit Product</CardTitle>
                <CardDescription>
                    Update product details.
                </CardDescription>
            </CardHeader>
            <form action={dispatch}>
                <CardContent className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" defaultValue={product.name} placeholder="Product Name" />
                        <div id="name-error" aria-live="polite" aria-atomic="true">
                            {state.errors?.name &&
                                state.errors.name.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select name="category" defaultValue={product.category}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Food">Food</SelectItem>
                                <SelectItem value="Drink">Drink</SelectItem>
                                <SelectItem value="Snack">Snack</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        <div id="category-error" aria-live="polite" aria-atomic="true">
                            {state.errors?.category &&
                                state.errors.category.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="price">Price</Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                defaultValue={Number(product.price)}
                                placeholder="0.00"
                            />
                            <div id="price-error" aria-live="polite" aria-atomic="true">
                                {state.errors?.price &&
                                    state.errors.price.map((error: string) => (
                                        <p className="mt-2 text-sm text-red-500" key={error}>
                                            {error}
                                        </p>
                                    ))}
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="stock">Stock</Label>
                            <Input
                                id="stock"
                                name="stock"
                                type="number"
                                defaultValue={product.stock}
                                placeholder="0"
                            />
                            <div id="stock-error" aria-live="polite" aria-atomic="true">
                                {state.errors?.stock &&
                                    state.errors.stock.map((error: string) => (
                                        <p className="mt-2 text-sm text-red-500" key={error}>
                                            {error}
                                        </p>
                                    ))}
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="barcode">Barcode (Optional)</Label>
                        <Input id="barcode" name="barcode" defaultValue={product.barcode || ''} placeholder="Scan Barcode" />
                    </div>
                    <div aria-live="polite" aria-atomic="true">
                        {state.message && (
                            <p className="mt-2 text-sm text-red-500" key={state.message}>
                                {state.message}
                            </p>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="justify-end gap-2">
                    <Link href="/admin/products">
                        <Button variant="ghost">Cancel</Button>
                    </Link>
                    <Button type="submit">Update Product</Button>
                </CardFooter>
            </form>
        </Card>
    )
}
