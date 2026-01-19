'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useCheckoutStore } from '@/src/store/checkoutStore'
import type { CheckoutRegister, User } from '@/src/schemas'
import ErrorMessage from '../ui/ErrorMessage'
import { useActionState } from 'react'
import { EditUserAction } from '@/actions/user/edit-user-action'
import { Button } from '../ui/button'

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

    // Clases reutilizables para mantener consistencia
    const labelClass = "block text-xs font-medium text-[var(--store-text-muted)] mb-1.5 uppercase tracking-wide";
    const inputClass = "w-full px-4 py-2.5 bg-transparent border border-[var(--store-border)] rounded-lg text-[var(--store-text)] text-sm focus:outline-none focus:border-[var(--store-text-muted)] focus:ring-1 focus:ring-[var(--store-text-muted)] transition-all placeholder:text-gray-300";
    const disabledInputClass = "bg-[var(--store-bg)] opacity-70 cursor-not-allowed border-transparent";

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
        >
            {/* Email */}
            <div>
                <label htmlFor="email" className={labelClass}>
                    Correo electrónico
                </label>
                <input
                    id="email"
                    type="email"
                    {...register('email')}
                    disabled
                    className={`${inputClass} ${disabledInputClass}`}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Nombre */}
                <div>
                    <label htmlFor="nombre" className={labelClass}>
                        Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="nombre"
                        type="text"
                        placeholder="Tu nombre"
                        {...register('nombre', { required: 'El nombre es obligatorio' })}
                        className={inputClass}
                    />
                    {errors.nombre && <ErrorMessage>{errors.nombre.message}</ErrorMessage>}
                </div>

                {/* Apellidos */}
                <div>
                    <label htmlFor="apellidos" className={labelClass}>
                        Apellidos <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="apellidos"
                        type="text"
                        placeholder="Tus apellidos"
                        {...register('apellidos', {
                            required: 'Los apellidos son obligatorios',
                        })}
                        className={inputClass}
                    />
                    {errors.apellidos && (
                        <ErrorMessage>{errors.apellidos.message}</ErrorMessage>
                    )}
                </div>
            </div>

            {/* Tipo + Número documento */}
            <div className="grid grid-cols-3 gap-5">
                <div className="col-span-1">
                    <label htmlFor="tipoDocumento" className={labelClass}>
                        Documento
                    </label>
                    <div className="relative">
                        <select
                            id="tipoDocumento"
                            {...register('tipoDocumento', {
                                required: 'Requerido',
                            })}
                            className={`${inputClass} appearance-none bg-[var(--store-surface)]`}
                        >
                            <option value="DNI">DNI</option>
                            <option value="CE">CE</option>
                            <option value="PAS">PAS</option>
                        </select>
                        {/* Flecha custom para el select */}
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-[var(--store-text-muted)]">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                    {errors.tipoDocumento && (
                        <ErrorMessage>{errors.tipoDocumento.message}</ErrorMessage>
                    )}
                </div>

                <div className="col-span-2">
                    <label htmlFor="numeroDocumento" className={labelClass}>
                        N° de documento <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="numeroDocumento"
                        type="text"
                        placeholder="00000000"
                        {...register('numeroDocumento', {
                            required: 'El número es obligatorio',
                            minLength: {
                                value: 8,
                                message: 'Mínimo 8 dígitos',
                            },
                        })}
                        className={inputClass}
                    />
                    {errors.numeroDocumento && (
                        <ErrorMessage>{errors.numeroDocumento.message}</ErrorMessage>
                    )}
                </div>
            </div>

            {/* Teléfono */}
            <div>
                <label htmlFor="telefono" className={labelClass}>
                    Teléfono / Móvil <span className="text-red-500">*</span>
                </label>
                <input
                    id="telefono"
                    type="text"
                    placeholder="999 999 999"
                    {...register('telefono', {
                        required: 'El teléfono es obligatorio',
                        pattern: {
                            value: /^[0-9]{9}$/,
                            message: 'Debe contener 9 dígitos numéricos',
                        },
                    })}
                    className={inputClass}
                />
                {errors.telefono && (
                    <ErrorMessage>{errors.telefono.message}</ErrorMessage>
                )}
            </div>

            {/* Errores desde el server action */}
            {state.errors.length > 0 && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
                    {state.errors.map((err, i) => (
                        <p key={i} className="flex items-center gap-2">
                            <span className="block w-1 h-1 bg-red-500 rounded-full" /> {err}
                        </p>
                    ))}
                </div>
            )}

            {/* Botón */}
            <div className="pt-4">
                <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-3 text-base font-medium shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                    {isPending ? 'Guardando información...' : 'Continuar a Entrega'}
                </Button>
            </div>
        </form>
    )
}