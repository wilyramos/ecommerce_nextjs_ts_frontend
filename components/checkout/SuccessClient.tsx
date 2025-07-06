'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/src/store/cartStore';
import { useCheckoutStore } from '@/src/store/checkoutStore';
import type { Order } from '@/src/schemas';
import { toast } from 'sonner';


export default function SuccessClient({ order }: { order: Order }) {



    const clearCart = useCartStore((state) => state.clearCart);
    const clearCheckout = useCheckoutStore((state) => state.clearCheckout);

    useEffect(() => {
        if (order?.paymentStatus === "PAGADO") {
            clearCart();
            clearCheckout();
            toast.success('¡Pago exitoso! Tu orden ha sido procesada correctamente.');
        }
    }, [order, clearCart, clearCheckout]);


    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4'>
            <h1 className='text-3xl font-bold mb-4'>¡Gracias por tu compra!</h1>
            <p className='text-lg mb-2'>Tu orden ha sido procesada exitosamente.</p>
            <p className='text-md mb-4'>Número de orden: <span className='font-semibold'>{order._id}</span></p>
            <p className='text-md mb-4'>Estado del pago: <span className='font-semibold'>{order.paymentStatus}</span></p>
            <p className='text-md mb-4'>Total: <span className='font-semibold'>${order.totalPrice.toFixed(2)}</span></p>


            <p className='text-md mb-4'>Método de envío: <span className='font-semibold'>{order.shippingMethod}</span></p>

            <p className='text-md mb-4'>Notas: <span className='font-semibold'>{order.notes || 'Ninguna'}</span></p>
        </div>
    )
}