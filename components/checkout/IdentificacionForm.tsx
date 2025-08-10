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


    // TODO: implementar para que el usuario pueda editar sus datos
    // Hacer con un actionstate que actualice el perfil del usuario
    // y luego redirigir a la página de envío

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
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto space-y-1 pt-2">
            {/* Email */}
            <div>
                <label htmlFor="email" className="text-xs font-bold text-black">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-full bg-gray-200 cursor-not-allowed text-gray-700"
                />
                {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
            </div>

            {/* Nombre */}
            <div className="space-y-1">
                <label htmlFor="nombre" className="text-xs font-bold text-black">
                    Nombre
                </label>
                <input
                    id="nombre"
                    type="text"
                    {...register('nombre', { required: 'El nombre es obligatorio' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-full"
                />
                {errors.nombre && <ErrorMessage>{errors.nombre.message}</ErrorMessage>}
            </div>

            {/* Apellidos */}
            <div className="space-y-1">
                <label htmlFor="apellidos" className="text-xs font-bold text-black">
                    Apellidos
                </label>
                <input
                    id="apellidos"
                    type="text"
                    {...register('apellidos', { required: 'Los apellidos son obligatorios' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-full text-gray-700"
                />
                {errors.apellidos && <ErrorMessage>{errors.apellidos.message}</ErrorMessage>}
            </div>

            {/* Tipo + Número documento */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label htmlFor="tipoDocumento" className="text-xs font-bold text-black">
                        Tipo de documento
                    </label>
                    <select
                        id="tipoDocumento"
                        {...register('tipoDocumento', { required: 'Selecciona el tipo de documento' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-full bg-white"
                    >
                        <option value="DNI">DNI</option>
                        <option value="CE">Carné de extranjería</option>
                        <option value="PAS">Pasaporte</option>
                    </select>
                    {errors.tipoDocumento && <ErrorMessage>{errors.tipoDocumento.message}</ErrorMessage>}
                </div>

                <div className="space-y-1">
                    <label htmlFor="numeroDocumento" className="text-xs font-bold text-black">
                        N° de documento
                    </label>
                    <input
                        id="numeroDocumento"
                        type="text"
                        {...register('numeroDocumento', {
                            required: 'El número de documento es obligatorio',
                            minLength: { value: 8, message: 'Debe tener al menos 8 dígitos' },
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-full"
                    />
                    {errors.numeroDocumento && <ErrorMessage>{errors.numeroDocumento.message}</ErrorMessage>}
                </div>
            </div>

            {/* Teléfono */}
            <div className="space-y-1">
                <label htmlFor="telefono" className="text-xs font-bold text-black">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-full"
                />
                {errors.telefono && <ErrorMessage>{errors.telefono.message}</ErrorMessage>}
            </div>

            {/* Botón */}
            <button
                type="submit"
                className="w-full py-2 px-4 text-white bg-indigo-600 rounded-full hover:bg-indigo-700 font-bold transition-colors mt-4 hover:cursor-pointer"
            >
                Continuar 
            </button>
        </form>
    );
}
