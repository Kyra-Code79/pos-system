import Prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditProductForm from './edit-form';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await Prisma.product.findUnique({
        where: { id },
    });

    if (!product) {
        notFound();
    }

    const serializedProduct = {
        ...product,
        price: product.price.toNumber(),
    };

    return (
        <div className="flex justify-center p-6">
            <EditProductForm product={serializedProduct} />
        </div>
    );
}
