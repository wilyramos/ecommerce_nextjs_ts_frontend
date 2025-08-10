import React from 'react';
import { FiMapPin } from 'react-icons/fi';
import ShippingForm from '@/components/checkout/ShippingForm';

export default function ShippingPage() {
    return (
        <div className="px-4 py-6 max-w-xl mx-auto">
            <p className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                <FiMapPin className="text-base" />
                Completa la dirección donde quieres recibir o recoger tu pedido:
            </p>
            <ShippingForm />
        </div>
    );
}
