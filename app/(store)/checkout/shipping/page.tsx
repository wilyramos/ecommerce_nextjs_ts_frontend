import React from 'react'
import ShippingForm from '@/components/checkout/ShippingForm'

export default function ShippingPage() {
    return (
        <div className='text-gray-800 text-sm'>
            <h1 className='text-xl font-semibold'>Entrega</h1>
            <span className='text-md text-gray-400'>
                Completa la direccion donde quieres recibir o recoger tu pedido.
            </span>
            {/* Aquí puedes agregar el formulario de envío */}

            <ShippingForm />
        </div>
    )
}