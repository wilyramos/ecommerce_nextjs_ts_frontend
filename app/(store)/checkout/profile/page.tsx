// app/checkout/profile/page.tsx
import React from 'react';
import IdentificacionForm from '@/components/checkout/IdentificacionForm';

export default function ProfilePageCheckout() {
    return (
        <div className="text-gray-800 text-sm">
            <h1 className="text-xl font-semibold ">
                Identificacion
            </h1>
            <span className='text-md text-gray-400'>Por favor completa tus datos personales para poder finalizar la compra</span>
            <IdentificacionForm />
            
        </div>
    );
}
