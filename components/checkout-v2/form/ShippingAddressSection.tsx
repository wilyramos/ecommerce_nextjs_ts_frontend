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
                    "peer h-12 w-full min-w-0 rounded-radius-md border border-border-primary bg-surface-primary px-3.5 pt-4.5 pb-1.5 text-sm font-normal text-text-primary transition-all duration-fast outline-none appearance-none",
                    "hover:border-border-strong",
                    "focus-visible:border-brand-accent focus-visible:ring-1 focus-visible:ring-brand-accent",
                    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-surface-secondary disabled:border-border-secondary disabled:text-text-disabled",
                    "aria-invalid:border-status-error aria-invalid:focus-visible:border-status-error aria-invalid:focus-visible:ring-status-error"
                )}
            >
                <option value="" disabled />
                {options.map(opt => (
                    <option key={opt} value={opt} className="text-text-primary bg-surface-primary">{opt}</option>
                ))}
            </select>
            <ChevronIcon />
            <label
                htmlFor={id}
                className={cn(
                    "pointer-events-none absolute left-3.5 top-1.5 select-none text-[11px] font-normal tracking-normal text-text-tertiary transition-all duration-fast origin-left",
                    !value && "top-3.5 text-sm text-text-secondary"
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
        const hasError = !!errors[`shippingAddress.${fieldKey}`]
        return (
            <InputV3
                id={`shipping-field-${fieldKey}`}
                label={labelPlaceholder}
                value={values[fieldKey] ?? ''}
                onChange={e => onChange(fieldKey, e.target.value)}
                aria-invalid={hasError}
                disabled={disabled}
                className="text-base sm:text-xs"
            />
        )
    }

    return (
        <fieldset className="space-y-3.5 text-text-primary" disabled={disabled}>
            <legend className="sr-only">Dirección de envío</legend>

            {fieldErrors.length > 0 && (
                <ul className="space-y-1 rounded-radius-md border border-status-error/20 bg-status-error-light px-3 py-2">
                    {fieldErrors.map((msg) => (
                        <li key={msg} className="text-[11px] text-status-error tracking-wide">
                            · {msg}
                        </li>
                    ))}
                </ul>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
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

            <InputV3
                id="shipping-notes"
                label="Notas adicionales del pedido (Opcional)"
                value={notes}
                onChange={e => onNotesChange(e.target.value)}
                maxLength={300}
                disabled={disabled}
                className="text-base sm:text-xs"
            />
        </fieldset>
    )
}