'use server';

import fs from 'fs/promises';
import path from 'path';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { logAction, AuditAction, AuditEntity } from '@/lib/audit';

const ProfileSchema = z.object({
    name: z.string().min(1, { message: 'Name is required.' }),
    image: z.any().optional(),
});

const PasswordSchema = z.object({
    currentPassword: z.string().min(1, { message: 'Current password is required.' }),
    newPassword: z.string()
        .min(6, { message: 'Password must be at least 6 characters.' })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: 'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>).' }),
    confirmPassword: z.string().min(1, { message: 'Please confirm your password.' }),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export async function updateProfile(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { message: 'Unauthorized' };
    }

    const file = formData.get('image') as File;
    let imagePath = undefined;

    if (file && file.size > 0) {
        if (file.size > 5 * 1024 * 1024) {
            return { message: 'Image size must be less than 5MB.' };
        }
        if (!file.type.startsWith('image/')) {
            return { message: 'File must be an image.' };
        }

        try {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `${session.user.id}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'avatars');

            // Ensure directory exists
            await fs.mkdir(uploadDir, { recursive: true });

            await fs.writeFile(path.join(uploadDir, filename), buffer);
            imagePath = `/uploads/avatars/${filename}`;
        } catch (error) {
            console.error('Error uploading file:', error);
            return { message: 'Failed to upload image.' };
        }
    }

    const validatedFields = ProfileSchema.safeParse({
        name: formData.get('name'),
        image: file,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid fields.',
        };
    }

    try {
        const updateData: any = { name: validatedFields.data.name };
        if (imagePath) {
            updateData.image = imagePath;
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
        });

        // Log action
        await logAction(
            session.user.id,
            AuditAction.UPDATE,
            AuditEntity.USER,
            `User updated their profile name to ${validatedFields.data.name}${imagePath ? ' and updated their profile picture' : ''}`
        );

        revalidatePath('/admin');
        return { message: 'Profile updated successfully.', success: true };
    } catch (error) {
        console.error(error);
        return { message: 'Failed to update profile.' };
    }
}

export async function changePassword(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { message: 'Unauthorized' };
    }

    const validatedFields = PasswordSchema.safeParse({
        currentPassword: formData.get('currentPassword'),
        newPassword: formData.get('newPassword'),
        confirmPassword: formData.get('confirmPassword'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid fields.',
        };
    }

    const { currentPassword, newPassword } = validatedFields.data;

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!user) {
            return { message: 'User not found.' };
        }

        const passwordsMatch = await bcrypt.compare(currentPassword, user.password);

        if (!passwordsMatch) {
            return {
                errors: { currentPassword: ['Incorrect current password.'] },
                message: 'Failed to update password.',
            };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: session.user.id },
            data: { password: hashedPassword },
        });

        await logAction(
            session.user.id,
            AuditAction.UPDATE,
            AuditEntity.USER,
            `User changed their password`
        );

        return { message: 'Password updated successfully.', success: true };
    } catch (error) {
        return { message: 'Failed to update password.' };
    }
}
