'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useShippingStore } from '@/src/store/shippingStore';
import ResumenFinalCarrito from '@/components/cart/ResumenFinalCarrito';
import ResumenShipping from '@/components/checkout/ResumenShipping';
import SubmitOrderButton from '@/components/checkout/SubmitOrderButton';

export default function PaymentPage() {
    const router = useRouter();
    const shippingData = useShippingStore((s) => s.data);

    useEffect(() => {
        if (!shippingData) router.push('/checkout');
    }, [shippingData, router]);

    if (!shippingData) return null;

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-10">
            <h1 className="text-2xl font-semibold">Resumen de pago</h1>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Envío */}
                <div className="bg-gray-50 border rounded-xl p-5">
                    <ResumenShipping shippingData={shippingData} />
                </div>

                {/* Carrito (ocupa 2 columnas) */}
                <div className="lg:col-span-2">
                    <ResumenFinalCarrito />
                </div>
            </div>

            {/* Pago */}
            <div className="bg-gray-50 border rounded-xl p-5">
                <h2 className="text-lg font-medium mb-4">Método de pago</h2>
                <SubmitOrderButton />
            </div>
        </div>
    );
}
