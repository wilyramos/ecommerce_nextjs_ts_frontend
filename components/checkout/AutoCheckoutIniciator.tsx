'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/src/store/cartStore';
import { useCheckoutStore } from '@/src/store/shippingStore';
import { createMPPreference } from '@/actions/checkout/create-mp-preference';
import { toast } from 'sonner';
import { createOrderAction } from '@/actions/order/create-order-action';



export default function AutoCheckoutIniciator() {

    const { cart } = useCartStore();
    const { shipping, profile } = useCheckoutStore();
    const [hasInitiated, setHasInitiated] = useState(false);


    // console.log('AutoCheckoutIniciator - Cart:', cart);
    // console.log('AutoCheckoutIniciator - Shipping:', shipping);

    

   useEffect(() => {
    const iniciarCheckout = async () => {
        const checkoutFlag = sessionStorage.getItem('checkout_iniciado');
        if (checkoutFlag) return;

        sessionStorage.setItem('checkout_iniciado', 'true');

        if (!cart || cart.length === 0) {
            console.error('El carrito está vacío');
            toast.error('El carrito está vacío');
            return;
        }

        try {
            const orderDataCreate = {
                items: cart.map(item => ({
                    productId: item._id,
                    quantity: item.cantidad,
                    price: item.precio,
                })),
                subtotal: cart.reduce((total, item) => total + (item.precio * item.cantidad), 0),
                shippingCost: 0,
                totalPrice: cart.reduce((total, item) => total + (item.precio * item.cantidad), 0),
                shippingAddress: {
                    departamento: shipping?.departamento || '',
                    provincia: shipping?.provincia || '',
                    distrito: shipping?.distrito || '',
                    direccion: shipping?.direccion || '',
                    numero: shipping?.numero || '',
                    piso: shipping?.piso || '',
                    referencia: shipping?.referencia || '',
                },
                shippingMethod: "DELIVERY",
                notes: "Orden generada automáticamente",
            };

            const createOrderResponse = await createOrderAction(orderDataCreate);

            if (!createOrderResponse?.order?._id) {
                toast.error('No se pudo crear la orden');
                return;
            }

            const orderId = createOrderResponse.order._id;

            const orderDataPreference = {
                orderId,
                items: cart.map(item => ({
                    id: item._id,
                    title: item.nombre,
                    quantity: item.cantidad,
                    unit_price: item.precio,
                    currency_id: 'PEN',
                    picture_url: item.imagenes?.[0] || '',
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

            const initPoint = await createMPPreference(orderDataPreference);
            window.location.href = initPoint;

        } catch (err) {
            console.error('Error al iniciar el checkout:', err);
            toast.error('No se pudo iniciar el pago');
        }
    };

    if (cart.length > 0 && shipping) {
        iniciarCheckout();
    }
}, [cart, shipping, profile]);


    return (
        <div className="text-center text-sm text-gray-500">
            Iniciando el checkout...
        </div>
    );
}