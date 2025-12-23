'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const SettingsSchema = z.object({
    storeName: z.string().min(1, 'Store name is required'),
    storeAddress: z.string().min(1, 'Store address is required'),
    storePhone: z.string().min(1, 'Store phone is required'),
    storeEmail: z.string().optional(),
    storeFax: z.string().optional(),
});

export async function getStoreSettings() {
    try {
        let settings = await prisma.storeSettings.findFirst();
        if (!settings) {
            // Create default if not exists
            settings = await prisma.storeSettings.create({
                data: {
                    storeName: 'Acme POS',
                    storeAddress: 'Jalan Raya No. 123, Jakarta',
                    storePhone: '021-12345678',
                    storeEmail: 'admin@acme.com',
                    storeFax: '',
                },
            });
        }
        return settings;
    } catch (error) {
        console.error('Failed to fetch settings:', error);
        return {
            storeName: 'Acme POS',
            storeAddress: 'Jalan Raya No. 123, Jakarta',
            storePhone: '021-12345678',
            storeEmail: 'admin@acme.com',
            storeFax: '',
        };
    }
}

export async function updateStoreSettings(prevState: any, formData: FormData) {
    const session = await auth();
    // @ts-ignore
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
        return { message: 'Unauthorized' };
    }

    const validatedFields = SettingsSchema.safeParse({
        storeName: formData.get('storeName'),
        storeAddress: formData.get('storeAddress'),
        storePhone: formData.get('storePhone'),
        storeEmail: formData.get('storeEmail'),
        storeFax: formData.get('storeFax'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid fields.',
        };
    }

    try {
        const { storeName, storeAddress, storePhone, storeEmail, storeFax } = validatedFields.data;

        // Update the first record, or create if missing (though getStoreSettings handles creation mostly)
        // Since we hardcoded ID 1 in schema default, we can upsert on ID 1 or findFirst.
        // Let's use findFirst to get ID then update.
        const existing = await prisma.storeSettings.findFirst();

        if (existing) {
            await prisma.storeSettings.update({
                where: { id: existing.id },
                data: {
                    storeName,
                    storeAddress,
                    storePhone,
                    storeEmail: storeEmail || "",
                    storeFax: storeFax || ""
                },
            });
        } else {
            await prisma.storeSettings.create({
                data: {
                    storeName,
                    storeAddress,
                    storePhone,
                    storeEmail: storeEmail || "",
                    storeFax: storeFax || ""
                },
            });
        }

        revalidatePath('/admin/settings');
        revalidatePath('/pos'); // Revalidate POS to reflect changes immediately

        return { message: 'Settings updated successfully.', success: true };
    } catch (error) {
        console.error('Failed to update settings:', error);
        return { message: 'Failed to update settings.' };
    }
}
