import React from 'react';
import { FiMapPin } from 'react-icons/fi';
import ShippingForm from '@/components/checkout/ShippingForm';

export default function ShippingPage() {
    return (
        <div className="max-w-xl mx-auto">
            <p className="flex items-center gap-2 text-sm text-black mb-4">
                <FiMapPin />
                Direccion de envío:
                
            </p>
            <ShippingForm />
        </div>
    );
}