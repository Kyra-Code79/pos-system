'use client';

import { deleteProduct } from '@/lib/actions/product';
import { Button } from './ui/button';
import { Trash } from 'lucide-react';

export function DeleteProductButton({ id }: { id: string }) {
    const handleDelete = async () => {
        const confirmed = window.confirm('Are you sure you want to delete this product?');
        if (confirmed) {
            const result = await deleteProduct(id);
            if (!result.success) {
                alert(result.message);
            }
        }
    };

    return (
        <Button variant="destructive" size="icon" onClick={handleDelete}>
            <Trash className="h-4 w-4" />
        </Button>
    );
}
