'use client';

import { useCheckoutStore } from '@/src/store/checkoutStore';
import { useForm } from 'react-hook-form';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { TCreateOrder } from '@/src/schemas';
import { useCartStore } from '@/src/store/cartStore';
import { createOrderAction } from '@/actions/order/create-order-action';

type ShippingData = {
    departamento: string;
    provincia: string;
    distrito: string;
    direccion: string;
    numero?: string;
    pisoDpto?: string;
    referencia: string;
};

export default function ShippingForm() {
    const router = useRouter();
    const { shipping, setShipping } = useCheckoutStore((state) => state);
    const { cart } = useCartStore((state) => state);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ShippingData>({
        defaultValues: {
            departamento: shipping?.departamento || '',
            provincia: shipping?.provincia || '',
            distrito: shipping?.distrito || '',
            direccion: shipping?.direccion || '',
            numero: shipping?.numero || '',
            pisoDpto: shipping?.pisoDpto || '',
            referencia: shipping?.referencia || '',
        },
    });

    useEffect(() => {
        if (shipping) {
            reset({
                departamento: shipping.departamento || '',
                provincia: shipping.provincia || '',
                distrito: shipping.distrito || '',
                direccion: shipping.direccion || '',
                numero: shipping.numero || '',
                pisoDpto: shipping.pisoDpto || '',
                referencia: shipping.referencia || '',
            });
        }
    }, [shipping, reset]);

    const onSubmit = async (data: ShippingData) => {
        setShipping(data);
        // Crear la orden
        const orderPayload: TCreateOrder = {
            items: cart.map(item => ({
                productId: item._id,
                quantity: item.cantidad,
                price: item.precio,
            })),
            subtotal: cart.reduce((t, i) => t + i.precio * i.cantidad, 0),
            shippingCost: 0,
            totalPrice: cart.reduce((t, i) => t + i.precio * i.cantidad, 0) + 0,
            shippingAddress: {
                departamento: data?.departamento,
                provincia: data?.provincia,
                distrito: data?.distrito,
                direccion: data?.direccion,
                pisoDpto: data?.pisoDpto,
                referencia: data?.referencia,
            },
            currency: "PEN",
            payment: {
                provider: "IZIPAY",
                status: "pending"
            }
        };

        const order = await createOrderAction(orderPayload);
        console.log("Orden creada:", order);

        localStorage.setItem("currentOrderId", order.order._id || "");

        router.push(`/checkout/payment?orderId=${order.order._id}`);
    };



    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-md mx-auto space-y-5 pt-4"
        >
            {/* Departamento / Provincia / Distrito */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                        Departamento <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        {...register('departamento', { required: 'El departamento es obligatorio' })}
                        placeholder="Ej. Lima"
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                    {errors.departamento && <ErrorMessage>{errors.departamento.message}</ErrorMessage>}
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                        Provincia <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        {...register('provincia', { required: 'La provincia es obligatoria' })}
                        placeholder="Ej. Lima"
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                    {errors.provincia && <ErrorMessage>{errors.provincia.message}</ErrorMessage>}
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                        Distrito <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        {...register('distrito', { required: 'El distrito es obligatorio' })}
                        placeholder="Ej. Miraflores"
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                    {errors.distrito && <ErrorMessage>{errors.distrito.message}</ErrorMessage>}
                </div>
            </div>

            {/* Dirección */}
            <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                    Dirección <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    {...register('direccion', { required: 'La dirección es obligatoria' })}
                    placeholder="Av. Siempre Viva 123"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
                {errors.direccion && <ErrorMessage>{errors.direccion.message}</ErrorMessage>}
            </div>

            {/* Número y Piso/Dpto */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Número</label>
                    <input
                        type="text"
                        {...register('numero')}
                        placeholder="Ej. 202"
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Piso / Dpto</label>
                    <input
                        type="text"
                        {...register('pisoDpto')}
                        placeholder="Ej. 2do piso / 307"
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                </div>
            </div>

            {/* Referencia */}
            <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                    Referencia <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    {...register('referencia', { required: 'La referencia es obligatoria' })}
                    placeholder="Ej. Frente a la tienda Tottus"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
                {errors.referencia && <ErrorMessage>{errors.referencia.message}</ErrorMessage>}
            </div>

            {/* Botón */}
            <button
                type="submit"
                className="w-full py-3 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm cursor-pointer"
            >
                Continuar con el pago
            </button>
        </form>
    );
}
