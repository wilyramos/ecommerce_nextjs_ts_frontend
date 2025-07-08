'use client';

import { useCartStore } from '@/src/store/cartStore';
import { useCheckoutStore } from '@/src/store/checkoutStore';
import { createMPPreference } from '@/actions/checkout/create-mp-preference';
import { toast } from 'sonner';
import { createOrderAction } from '@/actions/order/create-order-action';
import { SiMercadopago } from 'react-icons/si';
import { FaCcVisa, FaCcMastercard } from 'react-icons/fa';
import { RiBankCardFill } from 'react-icons/ri';
import Image from 'next/image';

export default function CheckoutSelector() {
    const { cart } = useCartStore();
    const { shipping, profile } = useCheckoutStore();

    const iniciarCheckoutMP = async () => {
        if (!cart || cart.length === 0) {
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
                notes: "Orden generada desde el selector de pasarelas",
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

   return (
        <div className="w-full flex flex-col items-center gap-6 mt-8">
            <p className="text-sm text-gray-600">Selecciona una pasarela de pago</p>

            <button
                onClick={iniciarCheckoutMP}
                className="flex flex-col items-start justify-center w-full max-w-md px-6 py-5 border border-gray-300 rounded-xl bg-white text-gray-800 hover:border-gray-500 hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
            >
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                        <SiMercadopago size={22} className="text-[#009ee3]" />
                    </div>
                    <span className="text-base font-semibold">Pagar con MercadoPago</span>
                </div>

                <div className="flex flex-wrap items-center gap-4 pl-12 pr-2 text-black">
                    <FaCcVisa size={64} title="Visa" />
                    <FaCcMastercard size={64} title="MasterCard" />
                    <RiBankCardFill size={64} title="Tarjeta Débito/Crédito" />
                    <Image
                        src="/yape.png"
                        alt="Yape"
                        width={64}
                        height={64}
                        className="w-12 h-12 rounded-lg"
                    />
                </div>
            </button>
        </div>
    );
}