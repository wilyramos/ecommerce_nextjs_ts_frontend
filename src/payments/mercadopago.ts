// src/payments/mercadopago.ts
import { createMPPreference } from '@/actions/checkout/create-mp-preference';
import { createOrderAction } from '@/actions/order/create-order-action';
import { toast } from 'sonner';
import type { CartItem, TCreateOrder } from '../schemas';
import type { TShippingAddress as Shipping } from '../schemas';
import type { ProfileFormData as Profile } from '../store/checkoutStore';

export async function iniciarCheckoutMP(cart: CartItem[], shipping: Shipping, profile: Profile) {
    if (!cart || cart.length === 0) {
        toast.error('El carrito está vacío');
        return;
    }

    try {
        const orderData: TCreateOrder = {
            items: cart.map(item => ({
                productId: item._id,
                quantity: item.cantidad,
                price: item.precio,
            })),
            subtotal: cart.reduce((t, i) => t + i.precio * i.cantidad, 0),
            shippingCost: 0,
            totalPrice: cart.reduce((t, i) => t + i.precio * i.cantidad, 0),
            shippingAddress: {
                departamento: shipping?.departamento || '',
                provincia: shipping?.provincia || '',
                distrito: shipping?.distrito || '',
                direccion: shipping?.direccion || '',
                numero: shipping?.numero || '',
                pisoDpto: shipping?.pisoDpto || '',
                referencia: shipping?.referencia || '',
            },
            currency: "PEN",
            payment: {
                status: "pending",
                provider: "mercadopago"
            }
        };

        const response = await createOrderAction(orderData);
        if (!response?.order?._id) {
            toast.error('No se pudo crear la orden');
            return;
        }

        const preferenceData = {
            orderId: response.order._id,
            items: cart.map(item => ({
                id: item._id,
                title: item.nombre,
                quantity: item.cantidad,
                unit_price: item.precio,
                currency_id: 'PEN',
                picture_url: item.imagenes?.[0] || '',
                description: item.nombre,
            })),
            shipping: {
                address: {
                    street_name: shipping?.direccion,
                    street_number: shipping?.numero,
                    floor: shipping?.pisoDpto || '',
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
                address: {
                    street_name: shipping?.direccion || '',
                    street_number: shipping?.numero || '',
                    floor: shipping?.pisoDpto || '',
                    apartment: shipping?.referencia || '',
                    city: shipping?.distrito || '',
                },
            },
        };

        const initPoint = await createMPPreference(preferenceData);
        window.location.href = initPoint;
    } catch (err) {
        console.error('Error al iniciar el checkout:', err);
        toast.error('No se pudo iniciar el pago');
    }
}
