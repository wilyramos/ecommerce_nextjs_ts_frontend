'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { CustomerProfile, TipoDocumento } from '@/src/schemas/order.schema'
import { InputV3 } from '@/components/ui/InputV3'

type Props = {
    values: CustomerProfile
    errors: Record<string, string>
    disabled?: boolean
    lockedEmail?: string
    onChange: (field: keyof CustomerProfile, value: string | TipoDocumento | undefined) => void
}

export default function CustomerProfileSection({ values, errors, disabled, lockedEmail, onChange }: Props) {

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
                aria-invalid={hasError}
                disabled={disabled}
                className="text-base sm:text-xs"
            />
        )
    }

    return (
        <fieldset className="space-y-3.5 text-text-primary" disabled={disabled}>
            <legend className="sr-only">Datos personales</legend>

            {fieldErrors.length > 0 && (
                <ul className="space-y-1 rounded-radius-md border border-status-error/20 bg-status-error-light px-3 py-2">
                    {fieldErrors.map((msg) => (
                        <li key={msg} className="text-[11px] text-status-error tracking-wide">
                            · {msg}
                        </li>
                    ))}
                </ul>
            )}

            {/* Email */}
            <div className="w-full">
                {lockedEmail ? (
                    <div className="relative w-full h-12">
                        <input
                            value={lockedEmail}
                            disabled
                            readOnly
                            className="peer h-12 w-full min-w-0 rounded-radius-md border border-border-primary bg-surface-secondary/50 px-3.5 pt-4.5 pb-1.5 text-sm font-normal text-text-disabled cursor-not-allowed outline-none"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {renderField('nombre', 'Nombre')}
                {renderField('apellidos', 'Apellidos')}
            </div>

            {/* Documentación y Teléfono */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {renderField('telefono', 'Nro de teléfono', 'tel')}

                <div className="relative w-full group flex flex-col justify-end h-12">
                    <select
                        id="profile-field-tipoDocumento"
                        value={values.tipoDocumento ?? ''}
                        onChange={e => onChange('tipoDocumento', (e.target.value as TipoDocumento) || undefined)}
                        disabled={disabled}
                        aria-invalid={!!errors['customerProfile.tipoDocumento']}
                        className={cn(
                            "peer h-12 w-full min-w-0 rounded-radius-md border border-border-primary bg-surface-primary px-3.5 pt-4.5 pb-1.5 text-sm font-normal text-text-primary transition-all duration-fast outline-none appearance-none",
                            "hover:border-border-strong",
                            "focus-visible:border-brand-accent focus-visible:ring-1 focus-visible:ring-brand-accent",
                            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-surface-secondary disabled:border-border-secondary disabled:text-text-disabled",
                            "aria-invalid:border-status-error aria-invalid:focus-visible:border-status-error aria-invalid:focus-visible:ring-status-error"
                        )}
                    >
                        <option value="">Seleccionar...</option>
                        <option value="DNI" className="text-text-primary bg-surface-primary">DNI</option>
                        <option value="RUC" className="text-text-primary bg-surface-primary">RUC</option>
                        <option value="CE" className="text-text-primary bg-surface-primary">Carnet Ext.</option>
                    </select>

                    <svg
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-secondary"
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
                            "pointer-events-none absolute left-3.5 top-1.5 select-none text-[11px] font-normal tracking-normal text-text-tertiary transition-all duration-fast origin-left",
                            !values.tipoDocumento && "top-3.5 text-sm text-text-secondary"
                        )}
                    >
                        Tipo de doc.
                    </label>
                </div>

                {renderField('numeroDocumento', 'Nro. de documento')}
            </div>
        </fieldset>
    )
}