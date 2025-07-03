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
        const iniciarCheckout = async () => {

            if (!cart || cart.length === 0) {
                console.error('El carrito está vacío');
                toast.error('El carrito está vacío');
                return;
            }
            try {
                const orderData = {
                    items: cart.map(item => ({
                        id: item._id,
                        title: item.nombre,
                        // description: item.,
                        quantity: item.cantidad,
                        unit_price: item.precio,
                    })),
                    shipping: {
                        address: {
                            street_name: shipping?.direccion,
                            street_number: shipping?.numero,
                            floor: shipping?.piso || '',
                            apartment: shipping?.referencia || '',
                            city: shipping?.distrito,
                            state: shipping?.provincia,
                            country: shipping?.departamento,
                        },
                    },
                    payer: {
                        email: profile?.email || '',
                        first_name: profile?.nombre || '',
                        last_name: profile?.apellidos || '',
                        phone: {
                            area_code: '51',
                            number: profile?.telefono || '',
                        },
                    },
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