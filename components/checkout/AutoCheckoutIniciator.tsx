'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/src/store/cartStore';
import { useCheckoutStore } from '@/src/store/shippingStore';
import { createMPPreference } from '@/actions/checkout/create-mp-preference';
import { toast } from 'sonner';



export default function AutoCheckoutIniciator() {

    const { cart } = useCartStore();
    const { shipping, profile } = useCheckoutStore();
    const [hasInitiated, setHasInitiated] = useState(false);



    useEffect(() => {


        console.log('Iniciando checkout automático...');
        console.log('Carrito:', cart);
        console.log('Datos de envío:', shipping);
        console.log('Perfil del usuario:', profile);
        console.log('Iniciando checkout automático...');
        const iniciarCheckout = async () => {
            try {
                const orderData = {
                    items: cart.map((item) => ({
                        product: item._id,
                        title: item.nombre,
                        price: item.precio,
                        quantity: item.cantidad,
                    })),
                    shipping, // puedes incluir más info aquí
                };

                const initPoint = await createMPPreference(orderData);

                // Redirige al link de Mercado Pago
                window.location.href = initPoint;
            } catch (err) {
                console.error('Error al iniciar el checkout:', err);
                toast.error('No se pudo iniciar el pago');
            }
        };

        if (!hasInitiated && cart.length > 0 && shipping) {
            setHasInitiated(true);
            iniciarCheckout();
        }
    }, [cart, shipping, hasInitiated, profile]);

    return (
        <div className="text-center text-sm text-gray-500">
            Iniciando el checkout...
        </div>
    );
}