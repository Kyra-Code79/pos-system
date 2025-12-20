'use server';

import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { logAction, AuditAction, AuditEntity } from '@/lib/audit';
import prisma from '@/lib/prisma';

const ProductSchema = z.object({
    id: z.string(),
    name: z.string().min(1, { message: 'Please enter a product name.' }),
    price: z.coerce
        .number()
        .gt(0, { message: 'Please enter a price greater than $0.' }),
    stock: z.coerce
        .number()
        .int()
        .gte(0, { message: 'Stock must be a positive integer.' }),
    category: z.string().min(1, { message: 'Please select a category.' }),
    barcode: z.string().optional(),
});

const CreateProduct = ProductSchema.omit({ id: true });
const UpdateProduct = ProductSchema.omit({ id: true });

export type State = {
    errors?: {
        name?: string[];
        price?: string[];
        stock?: string[];
        category?: string[];
        barcode?: string[];
    };
    message?: string | null;
};

export async function createProduct(prevState: State, formData: FormData) {
    const validatedFields = CreateProduct.safeParse({
        name: formData.get('name'),
        price: formData.get('price'),
        stock: formData.get('stock'),
        category: formData.get('category'),
        barcode: formData.get('barcode'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Product.',
        };
    }

    try {
        const product = await prisma.product.create({
            data: {
                name: validatedFields.data.name,
                category: validatedFields.data.category,
                price: validatedFields.data.price,
                stock: validatedFields.data.stock,
                barcode: validatedFields.data.barcode || null,
            },
        });

        // Log the action
        const { auth } = await import('@/auth');
        const session = await auth();

        if (session?.user?.id) {
            await logAction(
                session.user.id,
                AuditAction.CREATE,
                AuditEntity.PRODUCT,
                `Created product: ${product.name}`
            );
        }

        revalidatePath('/admin/products');
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Product.',
        };
    }

    redirect('/admin/products');
}

export async function updateProduct(id: string, prevState: State, formData: FormData) {
    const validatedFields = UpdateProduct.safeParse({
        name: formData.get('name'),
        price: formData.get('price'),
        stock: formData.get('stock'),
        category: formData.get('category'),
        barcode: formData.get('barcode'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Product.',
        };
    }

    try {
        const product = await prisma.product.update({
            where: { id },
            data: {
                name: validatedFields.data.name,
                category: validatedFields.data.category,
                price: validatedFields.data.price,
                stock: validatedFields.data.stock,
                barcode: validatedFields.data.barcode || null,
            },
        });

        // Log the action
        const { auth } = await import('@/auth');
        const session = await auth();

        if (session?.user?.id) {
            await logAction(
                session.user.id,
                AuditAction.UPDATE,
                AuditEntity.PRODUCT,
                `Updated product: ${product.name}`
            );
        }

        revalidatePath('/admin/products');
    } catch (error) {
        return {
            message: 'Database Error: Failed to Update Product.',
        };
    }

    redirect('/admin/products');
}

export async function deleteProduct(id: string) {
    try {
        const product = await prisma.product.delete({
            where: { id },
        });

        // Log the action
        const { auth } = await import('@/auth');
        const session = await auth();

        if (session?.user?.id) {
            await logAction(
                session.user.id,
                AuditAction.DELETE,
                AuditEntity.PRODUCT,
                `Deleted product: ${product.name}`
            );
        }

        revalidatePath('/admin/products');
        return { success: true, message: 'Product deleted successfully' };
    } catch (error: any) {
        if (error.code === 'P2003') {
            return { success: false, message: 'Cannot delete product: It is part of existing orders.' };
        }
        return { success: false, message: 'Failed to delete product' };
    }
}
