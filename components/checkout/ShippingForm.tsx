'use client';

import { useCheckoutStore } from '@/src/store/checkoutStore';
import { useForm } from 'react-hook-form';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useRouter } from 'next/navigation';

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

    const onSubmit = (data: ShippingData) => {
        setShipping(data);
        // console.log('Dirección guardada:', data);
        router.push('/checkout/payment');
    };

    return (
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-gray-700">Departamento</label>
                    <input
                        type="text"
                        {...register('departamento', { required: 'El departamento es obligatorio' })}
                        placeholder="Ej. Lima"
                        className="mt-1 block w-full border border-gray-200 rounded-full px-3 py-2 text-sm shadow-sm"
                    />
                    {errors.departamento && <ErrorMessage>{errors.departamento.message}</ErrorMessage>}
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-700">Provincia</label>
                    <input
                        type="text"
                        {...register('provincia', { required: 'La provincia es obligatoria' })}
                        placeholder="Ej. Lima"
                        className="mt-1 block w-full border border-gray-200 rounded-full px-3 py-2 text-sm shadow-sm"
                    />
                    {errors.provincia && <ErrorMessage>{errors.provincia.message}</ErrorMessage>}
                </div>
            </div>

            <div>
                <label className="text-xs font-bold text-gray-700">Distrito</label>
                <input
                    type="text"
                    {...register('distrito', { required: 'El distrito es obligatorio' })}
                    placeholder="Ej. Miraflores"
                    className="mt-1 block w-full border border-gray-200 rounded-full px-3 py-2 text-sm shadow-sm"
                />
                {errors.distrito && <ErrorMessage>{errors.distrito.message}</ErrorMessage>}
            </div>

            <div>
                <label className="text-xs font-bold text-gray-700">Dirección</label>
                <input
                    type="text"
                    {...register('direccion', { required: 'La dirección es obligatoria' })}
                    placeholder="Av. Siempre Viva 123"
                    className="mt-1 block w-full border border-gray-200 rounded-full px-3 py-2 text-sm shadow-sm"
                />
                {errors.direccion && <ErrorMessage>{errors.direccion.message}</ErrorMessage>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="text-xs font-bold text-gray-700">Número</label>
                    <input
                        type="text"
                        {...register('numero')}
                        placeholder="Ej. 202"
                        className="mt-1 block w-full border border-gray-200 rounded-full px-3 py-2 text-sm shadow-sm"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-700">Piso/Dpto</label>
                    <input
                        type="text"
                        {...register('piso')}
                        placeholder="Ej. 2do piso / 307"
                        className="mt-1 block w-full border border-gray-200 rounded-full px-3 py-2 text-sm shadow-sm"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold text-gray-700">Referencia</label>
                    <input
                        type="text"
                        {...register('referencia', { required: 'La referencia es obligatoria' })}
                        placeholder="Ej. Frente a la tienda Tottus"
                        className="mt-1 block w-full border border-gray-200 rounded-full px-3 py-2 text-sm shadow-sm"
                    />
                    {errors.referencia && <ErrorMessage>{errors.referencia.message}</ErrorMessage>}
                </div>
            </div>

            <div className="pt-4">

                <button
                    type="submit"
                className="w-full  py-2 px-4 max-w-md text-white bg-blue-800 rounded-full hover:bg-blue-700 font-medium transition-colors mt-4 hover:cursor-pointer "
                >
                    Continuar con el pago
                </button>
            </div>
        </form>
    );
}
