'use client'

import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useCheckoutStore } from '@/src/store/checkoutStore'
import type { CheckoutRegister, User } from '@/src/schemas'
import ErrorMessage from '../ui/ErrorMessage'
import { useActionState } from 'react'
import { EditUserAction } from '@/actions/user/edit-user-action'

type Props = {
    user: User
}

export default function IdentificacionForm({ user }: Props) {
    const router = useRouter()
    const { profile, setProfile } = useCheckoutStore()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CheckoutRegister>({
        defaultValues: {
            email: user.email || profile?.email || '',
            nombre: user.nombre || profile?.nombre || '',
            apellidos: user.apellidos || "",
            tipoDocumento: user.tipoDocumento || profile?.tipoDocumento || 'DNI',
            numeroDocumento: user.numeroDocumento || profile?.numeroDocumento || '',
            telefono: user.telefono || profile?.telefono || '',
        },
    })

    const [state, formAction] = useActionState(EditUserAction, {
        errors: [],
        success: '',
    })
    const [isPending, startTransition] = useTransition()

    const onSubmit = (data: CheckoutRegister) => {
        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) =>
            formData.append(key, value as string)
        )

        startTransition(async () => {
            await formAction(formData)

            if (state.errors.length === 0) {
                setProfile({ ...data, userId: user._id })
                router.push('/checkout/shipping')
            }
        })
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-md mx-auto space-y-3"
        >
            {/* Email */}
            <div>
                <label htmlFor="email" className="text-xs font-bold">
                    Correo electrónico
                </label>
                <input
                    id="email"
                    type="email"
                    {...register('email')}
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 text-gray-500 border rounded-lg"
                />
            </div>

            {/* Nombre */}
            <div>
                <label htmlFor="nombre" className="text-xs font-bold">
                    Nombre <span className="text-red-500">*</span>
                </label>
                <input
                    id="nombre"
                    type="text"
                    {...register('nombre', { required: 'El nombre es obligatorio' })}
                    className="w-full px-3 py-2 border rounded-lg"
                />
                {errors.nombre && <ErrorMessage>{errors.nombre.message}</ErrorMessage>}
            </div>

            {/* Apellidos */}
            <div>
                <label htmlFor="apellidos" className="text-xs font-bold">
                    Apellidos <span className="text-red-500">*</span>
                </label>
                <input
                    id="apellidos"
                    type="text"
                    {...register('apellidos', {
                        required: 'Los apellidos son obligatorios',
                    })}
                    className="w-full px-3 py-2 border rounded-lg"
                />
                {errors.apellidos && (
                    <ErrorMessage>{errors.apellidos.message}</ErrorMessage>
                )}
            </div>

            {/* Tipo + Número documento */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="tipoDocumento" className="text-xs font-bold">
                        Tipo de documento
                    </label>
                    <select
                        id="tipoDocumento"
                        {...register('tipoDocumento', {
                            required: 'Selecciona el tipo de documento',
                        })}
                        className="w-full px-3 py-2 border rounded-lg bg-white"
                    >
                        <option value="DNI">DNI</option>
                        <option value="CE">Carné de extranjería</option>
                        <option value="PAS">Pasaporte</option>
                    </select>
                    {errors.tipoDocumento && (
                        <ErrorMessage>{errors.tipoDocumento.message}</ErrorMessage>
                    )}
                </div>

                <div>
                    <label htmlFor="numeroDocumento" className="text-xs font-bold">
                        N° de documento <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="numeroDocumento"
                        type="text"
                        {...register('numeroDocumento', {
                            required: 'El número de documento es obligatorio',
                            minLength: {
                                value: 8,
                                message: 'Debe tener al menos 8 dígitos',
                            },
                        })}
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                    {errors.numeroDocumento && (
                        <ErrorMessage>{errors.numeroDocumento.message}</ErrorMessage>
                    )}
                </div>
            </div>

            {/* Teléfono */}
            <div>
                <label htmlFor="telefono" className="text-xs font-bold">
                    Teléfono / Móvil <span className="text-red-500">*</span>
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
                    className="w-full px-3 py-2 border rounded-lg"
                />
                {errors.telefono && (
                    <ErrorMessage>{errors.telefono.message}</ErrorMessage>
                )}
            </div>

            {/* Errores desde el server action */}
            {state.errors.length > 0 && (
                <div className="text-red-500 text-sm">
                    {state.errors.map((err, i) => (
                        <p key={i}>{err}</p>
                    ))}
                </div>
            )}

            {/* Botón */}
            <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 text-white bg-gray-900 rounded-lg disabled:opacity-50 cursor-pointer"
            >
                {isPending ? 'Guardando...' : 'Continuar'}
            </button>
        </form>
    )
}
