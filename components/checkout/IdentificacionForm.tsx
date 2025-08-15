'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useCheckoutStore } from '@/src/store/checkoutStore';
import type { CheckoutRegister, User } from '@/src/schemas';
import ErrorMessage from '../ui/ErrorMessage';

type Props = {
    user: User;
};

export default function IdentificacionForm({ user }: Props) {
    const router = useRouter();
    const { profile, setProfile } = useCheckoutStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CheckoutRegister>({
        defaultValues: {
            email: user.email || profile?.email || '',
            nombre: user.nombre || profile?.nombre || '',
            apellidos: user.apellidos || profile?.apellidos || '',
            tipoDocumento: user.tipoDocumento || profile?.tipoDocumento || 'DNI',
            numeroDocumento: user.numeroDocumento || profile?.numeroDocumento || '',
            telefono: user.telefono || profile?.telefono || '',
        },
    });

    const onSubmit = (data: CheckoutRegister) => {
        setProfile({
            ...data,
            userId: user._id,
        });
        router.push('/checkout/shipping');
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-md mx-auto space-y-4 pt-4"
        >
            {/* Email */}
            <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Correo electrónico
                </label>
                <input
                    id="email"
                    type="email"
                    {...register('email', {
                        required: 'El correo electrónico es obligatorio',
                        pattern: {
                            value: /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/,
                            message: 'Formato de correo no válido',
                        },
                    })}
                    disabled
                    className="w-full px-4 py-2 bg-gray-100 text-gray-500 border border-gray-200 rounded-xl cursor-not-allowed focus:outline-none"
                />
                {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
            </div>

            {/* Nombre */}
            <div className="space-y-1">
                <label htmlFor="nombre" className="text-sm font-medium text-gray-700">
                    Nombre
                </label>
                <input
                    id="nombre"
                    type="text"
                    {...register('nombre', { required: 'El nombre es obligatorio' })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
                {errors.nombre && <ErrorMessage>{errors.nombre.message}</ErrorMessage>}
            </div>

            {/* Apellidos */}
            <div className="space-y-1">
                <label htmlFor="apellidos" className="text-sm font-medium text-gray-700">
                    Apellidos
                </label>
                <input
                    id="apellidos"
                    type="text"
                    {...register('apellidos', { required: 'Los apellidos son obligatorios' })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
                {errors.apellidos && <ErrorMessage>{errors.apellidos.message}</ErrorMessage>}
            </div>

            {/* Tipo + Número documento */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label htmlFor="tipoDocumento" className="text-sm font-medium text-gray-700">
                        Tipo de documento
                    </label>
                    <select
                        id="tipoDocumento"
                        {...register('tipoDocumento', { required: 'Selecciona el tipo de documento' })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                    >
                        <option value="DNI">DNI</option>
                        <option value="CE">Carné de extranjería</option>
                        <option value="PAS">Pasaporte</option>
                    </select>
                    {errors.tipoDocumento && <ErrorMessage>{errors.tipoDocumento.message}</ErrorMessage>}
                </div>

                <div className="space-y-1">
                    <label htmlFor="numeroDocumento" className="text-sm font-medium text-gray-700">
                        N° de documento
                    </label>
                    <input
                        id="numeroDocumento"
                        type="text"
                        {...register('numeroDocumento', {
                            required: 'El número de documento es obligatorio',
                            minLength: { value: 8, message: 'Debe tener al menos 8 dígitos' },
                        })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                    {errors.numeroDocumento && <ErrorMessage>{errors.numeroDocumento.message}</ErrorMessage>}
                </div>
            </div>

            {/* Teléfono */}
            <div className="space-y-1">
                <label htmlFor="telefono" className="text-sm font-medium text-gray-700">
                    Teléfono / Móvil
                </label>
                <input
                    id="telefono"
                    type="text"
                    {...register('telefono', {
                        required: 'El teléfono es obligatorio',
                        pattern: {
                            value: /^[0-9]{9}$/,
                            message: 'Debe contener 9 dígitos numéricos',
                        },
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
                {errors.telefono && <ErrorMessage>{errors.telefono.message}</ErrorMessage>}
            </div>

            {/* Botón */}
            <button
                type="submit"
                className="w-full py-3 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm cursor-pointer"
            >
                Continuar
            </button>
        </form>
    );
}
