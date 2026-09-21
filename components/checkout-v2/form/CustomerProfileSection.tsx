// File: frontend/components/checkout-v2/form/CustomerProfileSection.tsx
'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'
import { cn } from '@/lib/utils'
import type { CustomerProfile, TipoDocumento } from '@/src/schemas/order.schema'
import { InputV3 } from '@/components/ui/InputV3'

type Props = {
    values: CustomerProfile
    errors: Record<string, string>
    disabled?: boolean
    lockedEmail?: string
    isAuth?: boolean
    onChange: (field: keyof CustomerProfile, value: string | TipoDocumento | undefined) => void
}

export default function CustomerProfileSection({
    values,
    errors,
    disabled,
    lockedEmail,
    isAuth,
    onChange,
}: Props) {
    const router = useRouter()

    const fieldErrors = [
        errors['customerProfile.email'],
        errors['customerProfile.nombre'],
        errors['customerProfile.apellidos'],
        errors['customerProfile.telefono'],
        errors['customerProfile.tipoDocumento'],
        errors['customerProfile.numeroDocumento'],
    ].filter(Boolean)

    const renderField = (fieldKey: keyof CustomerProfile, labelPlaceholder: string, type = "text") => {
        const errorKey = `customerProfile.${fieldKey}`
        const hasError = !!errors[errorKey]
        const fieldId = `profile-field-${fieldKey}`

        return (
            <InputV3
                type={type}
                id={fieldId}
                label={labelPlaceholder}
                value={(values[fieldKey] as string) ?? ''}
                onChange={e => onChange(fieldKey, e.target.value)}
                error={hasError ? errors[errorKey] : undefined}
                disabled={disabled}
                className="text-base sm:text-sm"
            />
        )
    }

    return (
        <section className="space-y-5">
            <div className="border-b border-border-secondary pb-2.5">
                <h3 className="text-base font-semibold tracking-tight text-text-primary">1. Datos Personales</h3>
            </div>

            <fieldset className="space-y-4" disabled={disabled}>
                <legend className="sr-only">Formulario de datos personales</legend>

                {fieldErrors.length > 0 && (
                    <ul className="space-y-1 rounded-radius-md border border-status-error bg-status-error-light px-3.5 py-2.5">
                        {fieldErrors.map((msg) => (
                            <li key={msg} className="flex items-start gap-1.5 text-xs font-medium text-status-error">
                                <span className="select-none">•</span> {msg}
                            </li>
                        ))}
                    </ul>
                )}

                {/* Email con botón discreto de inicio con Google */}
                <div className="space-y-1.5">
                    {!isAuth && (
                        <div className="flex items-center justify-between text-[11px]">
                            <span className="text-text-tertiary">¿Ya tienes una cuenta?</span>
                            <button
                                type="button"
                                onClick={() => router.push('/auth/login?redirect=/checkout-v3')}
                                className="inline-flex items-center gap-1 font-medium text-text-primary transition-colors hover:text-brand-accent focus-visible:outline-none"
                            >
                                <FcGoogle className="size-3.5 shrink-0" />
                                <span>Iniciar sesión</span>
                            </button>
                        </div>
                    )}

                    {lockedEmail ? (
                        <div className="relative h-12 w-full">
                            <input
                                value={lockedEmail}
                                disabled
                                readOnly
                                className="peer h-12 w-full min-w-0 cursor-not-allowed rounded-radius-md border border-border-primary bg-surface-tertiary/50 px-3.5 pt-4.5 pb-1.5 text-sm font-normal text-text-disabled outline-none"
                            />
                            <label className="pointer-events-none absolute left-3.5 top-1.5 select-none text-[11px] font-normal tracking-normal text-text-tertiary">
                                Correo electrónico
                            </label>
                        </div>
                    ) : (
                        renderField('email', 'Correo electrónico', 'email')
                    )}
                </div>

                {/* Nombres */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {renderField('nombre', 'Nombre')}
                    {renderField('apellidos', 'Apellidos')}
                </div>

                {/* Documentación y Teléfono */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {renderField('telefono', 'Nro de teléfono', 'tel')}

                    <div className="group relative flex h-12 w-full flex-col justify-end">
                        <select
                            id="profile-field-tipoDocumento"
                            value={values.tipoDocumento ?? ''}
                            onChange={e => onChange('tipoDocumento', (e.target.value as TipoDocumento) || undefined)}
                            disabled={disabled}
                            aria-invalid={!!errors['customerProfile.tipoDocumento']}
                            className={cn(
                                "peer h-12 w-full min-w-0 cursor-pointer appearance-none rounded-radius-md border border-border-primary bg-surface-primary px-3.5 pt-4.5 pb-1.5 text-sm font-normal text-text-primary transition-all duration-fast outline-none",
                                "hover:border-border-strong",
                                "focus-visible:border-brand-accent focus-visible:ring-1 focus-visible:ring-brand-accent",
                                "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-surface-secondary disabled:border-border-secondary disabled:text-text-disabled",
                                "aria-invalid:border-status-error aria-invalid:focus-visible:border-status-error aria-invalid:focus-visible:ring-status-error"
                            )}
                        >
                            <option value="" disabled className="hidden"></option>
                            <option value="DNI" className="bg-surface-primary text-text-primary">DNI</option>
                            <option value="RUC" className="bg-surface-primary text-text-primary">RUC</option>
                            <option value="CE" className="bg-surface-primary text-text-primary">Carnet Ext.</option>
                        </select>

                        <svg
                            className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary transition-colors peer-focus:text-brand-accent"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M6 9l6 6 6-6" />
                        </svg>

                        <label
                            htmlFor="profile-field-tipoDocumento"
                            className={cn(
                                "pointer-events-none absolute left-3.5 top-1.5 origin-left select-none text-[11px] font-normal tracking-normal text-text-tertiary transition-all duration-fast",
                                !values.tipoDocumento && "top-3.5 text-sm text-text-secondary",
                                "peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:text-brand-accent"
                            )}
                        >
                            Tipo de doc.
                        </label>
                    </div>

                    {renderField('numeroDocumento', 'Nro. de documento')}
                </div>
            </fieldset>
        </section>
    )
}