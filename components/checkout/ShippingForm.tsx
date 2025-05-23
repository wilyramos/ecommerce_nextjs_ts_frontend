'use client';

import { useForm } from 'react-hook-form';
import ErrorMessage from '../ui/ErrorMessage';
import { useRouter } from 'next/navigation';
import { useShippingStore } from '@/src/store/shippingStore';


export type ShippingFormData = {
    direccion: string;
    ciudad: string;
    telefono: string;
};

export default function ShippingForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ShippingFormData>();

    const router = useRouter();

    const { data, setShippingData } = useShippingStore();

    const onSubmit = (data: ShippingFormData) => {
        setShippingData(data);
        router.push('/checkout/payment');
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 p-6 bg-white rounded-xl shadow-md"
        >
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                    type="text"
                    {...register('direccion', { required: 'Dirección requerida' })}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={data?.direccion}
                    
                />
                {errors.direccion && <ErrorMessage>{errors.direccion.message}</ErrorMessage>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                <input
                    type="text"
                    {...register('ciudad', { required: 'Ciudad requerida' })}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={data?.ciudad}
                />
                {errors.ciudad && <ErrorMessage>{errors.ciudad.message}</ErrorMessage>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                    type="tel"
                    {...register('telefono', { required: 'Teléfono requerido' })}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={data?.telefono}
                />
                {errors.telefono && <ErrorMessage>{errors.telefono.message}</ErrorMessage>}
            </div>

            <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 px-4 py-2 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
                Continuar con el pago
            </button>
        </form>
    );
}