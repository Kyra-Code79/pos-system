'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { logAction, AuditAction, AuditEntity } from '@/lib/audit';

const FeatureSchema = z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(),
});

const PricingFeatureSchema = z.string();

const PricingPlanSchema = z.object({
    name: z.string(),
    price: z.string(),
    features: z.array(PricingFeatureSchema),
    highlight: z.boolean().optional(),
    cta: z.string().optional(),
});

const LandingPageSchema = z.object({
    heroTitle: z.string().min(1, 'Hero title is required'),
    heroDescription: z.string().min(1, 'Hero description is required'),
    heroImage: z.string().min(1, 'Hero image path is required'),
    features: z.array(FeatureSchema).optional(),
    pricingPlans: z.array(PricingPlanSchema).optional(),
});

export async function getLandingPageContent() {
    try {
        // @ts-ignore
        let content = await prisma.landingPage.findFirst();
        if (!content) {
            // @ts-ignore
            content = await prisma.landingPage.create({
                data: {
                    heroTitle: "One Cashier App For All Types Of Business",
                    heroDescription: "A cloud-based online cashier application that can take your business potential to the highest level, both online and offline.",
                    heroImage: "/pos-tab.png",
                    features: [
                        { title: "Any Business, One App", description: "Complete features for unlimited outlets and employees.", icon: "Users" },
                        { title: "Focus on Selling", description: "You focus on selling, we manage the rest.", icon: "BarChart3" },
                        { title: "Anti Hassle", description: "Suitable for all business types.", icon: "ShieldCheck" }
                    ],
                    pricingPlans: [
                        {
                            name: "Basic",
                            price: "$20",
                            features: ["1 Outlet", "Basic Reports", "Unlimited Products"],
                            highlight: false
                        },
                        {
                            name: "Business",
                            price: "$30",
                            features: ["3 Outlets", "Advanced Analytics", "Inventory Management", "24/7 Support"],
                            highlight: true
                        },
                        {
                            name: "Enterprise",
                            price: "$50",
                            features: ["Unlimited Outlets", "Custom Reports", "API Access"],
                            highlight: false
                        }
                    ]
                }
            });
        }
        return content;
    } catch (error) {
        console.error('Failed to fetch landing page content:', error);
        return {
            heroTitle: "One Cashier App For All Types Of Business",
            heroDescription: "A cloud-based online cashier application that can take your business potential to the highest level, both online and offline.",
            heroImage: "/pos-tab.png",
            features: [],
            pricingPlans: []
        };
    }
}

export async function updateLandingPageContent(prevState: any, formData: FormData) {
    const session = await auth();
    // @ts-ignore
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
        return { message: 'Unauthorized' };
    }

    // Parse features and pricingPlans from JSON string if present
    let features = [];
    let pricingPlans = [];
    try {
        const featuresJson = formData.get('features');
        if (typeof featuresJson === 'string') {
            features = JSON.parse(featuresJson);
        }
        const pricingPlansJson = formData.get('pricingPlans');
        if (typeof pricingPlansJson === 'string') {
            pricingPlans = JSON.parse(pricingPlansJson);
        }
    } catch (e) {
        // empty
    }

    const validatedFields = LandingPageSchema.safeParse({
        heroTitle: formData.get('heroTitle'),
        heroDescription: formData.get('heroDescription'),
        heroImage: formData.get('heroImage'),
        features: features,
        pricingPlans: pricingPlans,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Invalid fields.',
        };
    }

    try {
        const { heroTitle, heroDescription, heroImage, features, pricingPlans } = validatedFields.data;

        // @ts-ignore
        const existing = await prisma.landingPage.findFirst();

        if (existing) {
            // @ts-ignore
            await prisma.landingPage.update({
                where: { id: existing.id },
                data: { heroTitle, heroDescription, heroImage, features: features as any, pricingPlans: pricingPlans as any },
            });
        } else {
            // @ts-ignore
            await prisma.landingPage.create({
                data: { heroTitle, heroDescription, heroImage, features: features as any, pricingPlans: pricingPlans as any },
            });
        }

        await logAction(
            session.user.id,
            AuditAction.UPDATE,
            AuditEntity.AUTH, // Using AUTH or maybe create 'SYSTEM' entity? Stick to AUTH or USER for generic admin actions if needed, or stick to convention.
            `Updated Landing Page Content`
        );

        revalidatePath('/');
        return { message: 'Content updated successfully.', success: true };
    } catch (error) {
        console.error('Failed to update landing content:', error);
        return { message: 'Failed to update content.' };
    }
}
