'use server';

import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';

import prisma from '@/lib/prisma';

const UserSchema = z.object({
    id: z.string(),
    name: z.string().min(1, { message: 'Please enter a name.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
    role: z.enum(['ADMIN', 'MANAGEMENT', 'CASHIER']),
});

const CreateUser = UserSchema.omit({ id: true });
// For update we might make password optional, but keeping it simple for now

export type State = {
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        role?: string[];
    };
    message?: string | null;
};

export async function createUser(prevState: State, formData: FormData) {
    const validatedFields = CreateUser.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        role: formData.get('role'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create User.',
        };
    }

    const { name, email, password, role } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                // @ts-ignore - Prisma Types need to be generated again if Enum issues persist, but valid here
                role: role,
            },
        });

        // Log the action
        const { auth } = await import('@/auth');
        const session = await auth();

        if (session?.user?.id) {
            const { logAction, AuditAction, AuditEntity } = await import('@/lib/audit');
            await logAction(
                session.user.id,
                AuditAction.CREATE,
                AuditEntity.USER,
                `Created user: ${newUser.name} with role ${newUser.role}`
            );
        }
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create User. Email might be in use.',
        };
    }

    revalidatePath('/admin/users');
    redirect('/admin/users');
}
