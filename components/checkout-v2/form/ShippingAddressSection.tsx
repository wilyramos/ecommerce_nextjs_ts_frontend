// File: frontend/components/checkout-v2/form/ShippingAddressSection.tsx
'use client'

import { useMemo } from 'react'
import { locations } from '@/src/data/locations'
import { cn } from '@/lib/utils'
import type { ShippingAddress } from '@/src/schemas/order.schema'
import { InputV3 } from '@/components/ui/InputV3'

type Props = {
    values: ShippingAddress
    errors: Record<string, string>
    disabled?: boolean
    notes: string
    onChange: (field: keyof ShippingAddress, value: string) => void
    onNotesChange: (value: string) => void
}

const ChevronIcon = () => (
    <svg
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary peer-focus:text-brand-accent transition-colors"
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
)

type NativeSelectProps = {
    id: string
    label: string
    value: string
    options: string[]
    disabled?: boolean
    hasError?: boolean
    onChange: (val: string) => void
}

function NativeSelect({ id, label, value, options, disabled, hasError, onChange }: NativeSelectProps) {
    return (
        <div className="relative w-full group flex flex-col justify-end h-12">
            <select
                id={id}
                value={value}
                onChange={e => onChange(e.target.value)}
                disabled={disabled || options.length === 0}
                aria-invalid={hasError || undefined}
                className={cn(
                    "peer h-12 w-full min-w-0 rounded-radius-md border border-border-primary bg-surface-primary px-3.5 pt-4.5 pb-1.5 text-sm font-normal text-text-primary transition-all duration-fast outline-none appearance-none cursor-pointer",
                    "hover:border-border-strong",
                    "focus-visible:border-brand-accent focus-visible:ring-1 focus-visible:ring-brand-accent",
                    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-surface-secondary disabled:border-border-secondary disabled:text-text-disabled",
                    "aria-invalid:border-status-error aria-invalid:focus-visible:border-status-error aria-invalid:focus-visible:ring-status-error"
                )}
            >
                <option value="" disabled className="hidden"></option>
                {options.map(opt => (
                    <option key={opt} value={opt} className="text-text-primary bg-surface-primary">{opt}</option>
                ))}
            </select>
            <ChevronIcon />
            <label
                htmlFor={id}
                className={cn(
                    "pointer-events-none absolute left-3.5 top-1.5 select-none text-[11px] font-normal tracking-normal text-text-tertiary transition-all duration-fast origin-left",
                    !value && "top-3.5 text-sm text-text-secondary",
                    "peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:text-brand-accent",
                    hasError && "text-status-error peer-focus:text-status-error"
                )}
            >
                {label}
            </label>
        </div>
    )
}

export default function ShippingAddressSection({ values, errors, disabled, notes, onChange, onNotesChange }: Props) {
    const provincias = useMemo(() =>
        values.departamento ? Object.keys(locations[values.departamento] ?? {}) : []
    , [values.departamento])

    const distritos = useMemo(() =>
        values.departamento && values.provincia
            ? locations[values.departamento]?.[values.provincia] ?? []
            : []
    , [values.departamento, values.provincia])

    const handleDepartamentoChange = (val: string) => {
        onChange('departamento', val)
        onChange('provincia', '')
        onChange('distrito', '')
    }

    const handleProvinciaChange = (val: string) => {
        onChange('provincia', val)
        onChange('distrito', '')
    }

    const fieldErrors = [
        errors['shippingAddress.departamento'],
        errors['shippingAddress.provincia'],
        errors['shippingAddress.distrito'],
        errors['shippingAddress.direccion'],
        errors['shippingAddress.referencia'],
    ].filter(Boolean)

    const renderField = (fieldKey: keyof ShippingAddress, labelPlaceholder: string) => {
        const errorKey = `shippingAddress.${fieldKey}`
        const hasError = !!errors[errorKey]
        
        return (
            <InputV3
                id={`shipping-field-${fieldKey}`}
                label={labelPlaceholder}
                value={values[fieldKey] ?? ''}
                onChange={e => onChange(fieldKey, e.target.value)}
                error={hasError ? errors[errorKey] : undefined}
                disabled={disabled}
                className="text-base sm:text-sm"
            />
        )
    }

    return (
        <section className="space-y-6 pt-4">
            <div className="space-y-1 border-b border-border-secondary pb-3">
                <h3 className="text-lg font-semibold tracking-tight text-text-primary">2. Dirección de Envío</h3>
                <p className="text-sm text-text-secondary">¿Dónde entregaremos tu pedido?</p>
            </div>

            <fieldset className="space-y-4 text-text-primary" disabled={disabled}>
                <legend className="sr-only">Dirección de envío</legend>

                {fieldErrors.length > 0 && (
                    <ul className="space-y-1.5 rounded-radius-md border border-status-error/20 bg-status-error-light px-4 py-3">
                        {fieldErrors.map((msg) => (
                            <li key={msg} className="text-xs font-medium text-status-error tracking-wide flex items-start gap-1.5">
                                <span className="select-none">•</span> {msg}
                            </li>
                        ))}
                    </ul>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <NativeSelect
                        id="shipping-field-departamento"
                        label="Departamento"
                        value={values.departamento}
                        options={Object.keys(locations)}
                        disabled={disabled}
                        hasError={!!errors['shippingAddress.departamento']}
                        onChange={handleDepartamentoChange}
                    />
                    <NativeSelect
                        id="shipping-field-provincia"
                        label="Provincia"
                        value={values.provincia}
                        options={provincias}
                        disabled={disabled || provincias.length === 0}
                        hasError={!!errors['shippingAddress.provincia']}
                        onChange={handleProvinciaChange}
                    />
                    <NativeSelect
                        id="shipping-field-distrito"
                        label="Distrito"
                        value={values.distrito}
                        options={distritos}
                        disabled={disabled || distritos.length === 0}
                        hasError={!!errors['shippingAddress.distrito']}
                        onChange={val => onChange('distrito', val)}
                    />
                </div>

                {renderField('direccion', 'Dirección (Calle, avenida, número)')}
                {renderField('referencia', 'Referencia (Opcional)')}

                <div className="pt-2">
                    <InputV3
                        id="shipping-notes"
                        label="Notas adicionales del pedido (Opcional)"
                        value={notes}
                        onChange={e => onNotesChange(e.target.value)}
                        maxLength={300}
                        disabled={disabled}
                        className="text-base sm:text-sm"
                    />
                </div>
            </fieldset>
        </section>
    )
}