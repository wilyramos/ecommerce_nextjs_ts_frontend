'use client';

import { useCheckoutStore } from '@/src/store/checkoutStore';
import { useForm } from 'react-hook-form';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type ShippingData = {
    departamento: string;
    provincia: string;
    distrito: string;
    direccion: string;
    numero?: string;
    piso?: string;
    referencia: string;
};

export default function ShippingForm() {
    const router = useRouter();
    const { shipping, setShipping } = useCheckoutStore((state) => state);

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
            piso: shipping?.piso || '',
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
                piso: shipping.piso || '',
                referencia: shipping.referencia || '',
            });
        }
    }, [shipping, reset]);

    const onSubmit = (data: ShippingData) => {
        setShipping(data);
        router.push('/checkout/payment');
    };

    return (
        <form className="max-w-lg mx-auto space-y-1 pt-2" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                    <label className="text-xs font-bold">Departamento<span className="text-red-500">*</span></label>

                    <input
                        type="text"
                        {...register('departamento', { required: 'El departamento es obligatorio' })}
                        placeholder="Ej. Lima"
                        className="mt-1 block w-full border border-gray-200 rounded-full px-3 py-2 text-sm shadow-xs"
                    />
                    {errors.departamento && <ErrorMessage>{errors.departamento.message}</ErrorMessage>}
                </div>

                <div>
                    <label className="text-xs font-bold">Provincia<span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        {...register('provincia', { required: 'La provincia es obligatoria' })}
                        placeholder="Ej. Lima"
                        className="mt-1 block w-full border border-gray-200 rounded-full px-3 py-2 text-sm shadow-xs"
                    />
                    {errors.provincia && <ErrorMessage>{errors.provincia.message}</ErrorMessage>}
                </div>

                <div>
                    <label className="text-xs font-bold">Distrito<span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        {...register('distrito', { required: 'El distrito es obligatorio' })}
                        placeholder="Ej. Miraflores"
                        className="mt-1 block w-full border border-gray-200 rounded-full px-3 py-2 text-sm shadow-xs"
                    />
                    {errors.distrito && <ErrorMessage>{errors.distrito.message}</ErrorMessage>}
                </div>
            </div>



            <div>
                <label className="text-xs font-bold">Dirección<span className="text-red-500">*</span></label>
                <input
                    type="text"
                    {...register('direccion', { required: 'La dirección es obligatoria' })}
                    placeholder="Av. Siempre Viva 123"
                    className="mt-1 block w-full border border-gray-200 rounded-full px-3 py-2 text-sm shadow-xs"
                />
                {errors.direccion && <ErrorMessage>{errors.direccion.message}</ErrorMessage>}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold">Número</label>
                    <input
                        type="text"
                        {...register('numero')}
                        placeholder="Ej. 202"
                        className="mt-1 block w-full border border-gray-200 rounded-full px-3 py-2 text-sm shadow-xs"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold">Piso/Dpto</label>
                    <input
                        type="text"
                        {...register('piso')}
                        placeholder="Ej. 2do piso / 307"
                        className="mt-1 block w-full border border-gray-200 rounded-full px-3 py-2 text-sm shadow-xs"
                    />
                </div>


            </div>
            <div>
                <label className="text-xs font-bold">Referencia<span className="text-red-500">*</span></label>
                <input
                    type="text"
                    {...register('referencia', { required: 'La referencia es obligatoria' })}
                    placeholder="Ej. Frente a la tienda Tottus"
                    className="mt-1 block w-full border border-gray-200 rounded-full px-3 py-2 text-sm shadow-xs"
                />
                {errors.referencia && <ErrorMessage>{errors.referencia.message}</ErrorMessage>}
            </div>

            <div className="pt-4 text-center">

                <button
                    type="submit"
                    className="w-full  py-2 px-4 text-white bg-indigo-600 rounded-full hover font-medium transition-colors mt-4 hover:cursor-pointer "
                >
                    Continuar con el pago
                </button>
            </div>
        </form>
    );
}
