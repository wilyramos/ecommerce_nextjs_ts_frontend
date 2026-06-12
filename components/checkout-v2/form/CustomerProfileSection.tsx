'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import type { CustomerProfile, TipoDocumento } from '@/src/schemas/order.schema'
import { InputV2 } from '@/components/ui/InputV2'

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
            <InputV2
                type={type}
                id={fieldId}
                label={labelPlaceholder}
                value={(values[fieldKey] as string) ?? ''}
                onChange={e => onChange(fieldKey, e.target.value)}
                aria-invalid={hasError}
                disabled={disabled}
                className={cn(
                    hasError && "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive"
                )}
            />
        )
    }

    return (
        <fieldset className="space-y-4 text-foreground" disabled={disabled}>
            <legend className="sr-only">Datos personales</legend>

            {/* Errores al tope, fuera del flujo de los campos */}
            {fieldErrors.length > 0 && (
                <ul className="space-y-0.5 rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2">
                    {fieldErrors.map((msg) => (
                        <li key={msg} className="text-[11px] text-destructive tracking-wide">
                            · {msg}
                        </li>
                    ))}
                </ul>
            )}

            {/* Email */}
            <div className="w-full">
                {lockedEmail ? (
                    <div className="relative w-full h-11">
                        <input
                            value={lockedEmail}
                            disabled
                            readOnly
                            className="h-11 w-full px-3 pt-4 pb-1 text-xs bg-muted/30 border border-border cursor-not-allowed select-none rounded-md text-foreground outline-none"
                        />
                        <label className="absolute left-3 top-1 text-[10px] text-muted-foreground/70 select-none">
                            Correo electrónico
                        </label>
                    </div>
                ) : (
                    renderField('email', 'Correo electrónico', 'email')
                )}
            </div>

            {/* Nombre / Apellidos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderField('nombre', 'Nombre')}
                {renderField('apellidos', 'Apellidos')}
            </div>

            {/* Teléfono · Tipo doc · Número doc */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                {renderField('telefono', 'Nro de teléfono', 'tel')}

                {/* Select nativo — mismo patrón que InputV2 */}
                <div className="relative w-full group flex flex-col justify-end h-11">
                    <select
                        id="profile-field-tipoDocumento"
                        value={values.tipoDocumento ?? ''}
                        onChange={e => onChange('tipoDocumento', (e.target.value as TipoDocumento) || undefined)}
                        disabled={disabled}
                        className={cn(
                            "peer h-11 w-full border bg-background border-border px-3 pt-4 pb-1 text-xs",
                            "transition-all outline-none rounded-md text-foreground appearance-none",
                            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                            "focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-[1px]",
                            !values.tipoDocumento && "text-transparent",
                            errors['customerProfile.tipoDocumento'] && "border-destructive focus-visible:ring-destructive/20"
                        )}
                    >
                        <option value="" disabled />
                        <option value="DNI">DNI</option>
                        <option value="RUC">RUC</option>
                        <option value="CE">Carnet Ext.</option>
                    </select>

                    {/* Flecha SVG custom para reemplazar la flecha nativa */}
                    <svg
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground"
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
                            "absolute left-3 text-[10px] text-muted-foreground pointer-events-none transition-all origin-left select-none",
                            values.tipoDocumento ? "top-1" : "top-3 text-xs"
                        )}
                    >
                        Tipo de documento
                    </label>
                </div>

                {renderField('numeroDocumento', 'Número de documento')}
            </div>
        </fieldset>
    )
}