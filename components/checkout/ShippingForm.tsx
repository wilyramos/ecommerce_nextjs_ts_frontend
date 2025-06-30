'use client';

import { useCheckoutStore } from '@/src/store/shippingStore';
import { useForm } from 'react-hook-form';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useRouter } from 'next/navigation';

type ShippingData = {
    direccion: string;
    distrito: string;
    numero: string;
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
            direccion: shipping?.direccion || '',
            distrito: shipping?.distrito || '',
            numero: shipping?.numero || '',
            piso: shipping?.piso || '',
            referencia: shipping?.referencia || '',
        },
    });

    const onSubmit = (data: ShippingData) => {
        setShipping(data);
        console.log('Dirección guardada:', data);
        router.push('/checkout/payment');
    };

    return (
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label className="text-xs font-semibold text-gray-700">Dirección de entrega</label>
                <input
                    type="text"
                    {...register('direccion', { required: 'La dirección es obligatoria' })}
                    placeholder="Av. Siempre Viva 123"
                    className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 text-sm shadow-sm"
                />
                {errors.direccion && <ErrorMessage>{errors.direccion.message}</ErrorMessage>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="text-xs font-semibold text-gray-700">Distrito</label>
                    <input
                        type="text"
                        {...register('distrito', { required: 'El distrito es obligatorio' })}
                        placeholder="Ej. Miraflores"
                        className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 text-sm shadow-sm"
                    />
                    {errors.distrito && <ErrorMessage>{errors.distrito.message}</ErrorMessage>}
                </div>

                <div>
                    <label className="text-xs font-semibold text-gray-700">Número</label>
                    <input
                        type="text"
                        {...register('numero', { required: 'El número es obligatorio' })}
                        placeholder="Ej. 202"
                        className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 text-sm shadow-sm"
                    />
                    {errors.numero && <ErrorMessage>{errors.numero.message}</ErrorMessage>}
                </div>

                <div>
                    <label className="text-xs font-semibold text-gray-700">Piso/Dpto</label>
                    <input
                        type="text"
                        {...register('piso')}
                        placeholder="ejem: 2do piso/307"
                        className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 text-sm shadow-sm"
                    />
                </div>
            </div>

            <div>
                <label className="text-xs font-semibold text-gray-700">Referencia</label>
                <input
                    type="text"
                    {...register('referencia')}
                    placeholder="Ej. Frente a la tienda Tottus"
                    className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 text-sm shadow-sm"
                    {...register('referencia', { required: 'La referencia es obligatoria' })}


                />
                {errors.referencia && <ErrorMessage>{errors.referencia.message}</ErrorMessage>}
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-md transition"
                >
                    Continuar con el pago
                </button>
            </div>
        </form>
    );
}
