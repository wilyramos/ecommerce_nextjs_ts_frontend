'use client'

import { useMemo } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { locations } from '@/src/data/locations'
import { cn } from '@/lib/utils'
import type { ShippingAddress } from '@/src/schemas/order.schema'
import { InputV2 } from '@/components/ui/InputV2'

type Props = {
    values: ShippingAddress
    errors: Record<string, string>
    disabled?: boolean
    notes: string
    onChange: (field: keyof ShippingAddress, value: string) => void
    onNotesChange: (value: string) => void
}

export default function ShippingAddressSection({ values, errors, disabled, notes, onChange, onNotesChange }: Props) {
    const provincias = useMemo(() => (values.departamento ? Object.keys(locations[values.departamento] ?? {}) : []), [values.departamento])
    const distritos = useMemo(() => (values.departamento && values.provincia ? locations[values.departamento]?.[values.provincia] ?? [] : []), [values.departamento, values.provincia])

    const handleSelectChange = (field: 'departamento' | 'provincia', val: string) => {
        onChange(field, val)
        onChange('provincia', field === 'departamento' ? '' : val)
        onChange('distrito', '')
    }

    const renderField = (fieldKey: keyof ShippingAddress, labelPlaceholder: string) => {
        const errorKey = `shippingAddress.${fieldKey}`
        const error = errors[errorKey]
        const fieldId = `shipping-field-${fieldKey}`

        return (
            <div className={cn(
                "relative w-full transition-all",
                error && "mb-5"
            )}>
                <InputV2
                    id={fieldId}
                    label={labelPlaceholder}
                    value={values[fieldKey] ?? ''}
                    onChange={e => onChange(fieldKey, e.target.value)}
                    aria-invalid={!!error}
                    disabled={disabled}
                    className={cn(
                        error && "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive"
                    )}
                />
                {error && (
                    <p className="absolute top-11 left-0 text-[10px] text-destructive mt-1 px-1 tracking-wide">
                        {error}
                    </p>
                )}
            </div>
        )
    }

    return (
        <fieldset className="space-y-4 text-foreground" disabled={disabled}>
            <legend className="sr-only">Dirección de envío</legend>

            {/* Ubigeo Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                {/* Departamento */}
                <div className={cn(
                    "relative w-full h-11 flex flex-col justify-end transition-all",
                    errors['shippingAddress.departamento'] && "mb-5"
                )}>
                    <Select value={values.departamento} onValueChange={val => handleSelectChange('departamento', val)}>
                        <SelectTrigger className={cn(
                            "h-11 px-3 pt-4 pb-1 text-xs font-normal text-foreground rounded-md border-border text-left w-full flex items-center justify-between [&>span]:line-clamp-1 [&>span]:text-xs [&>span]:text-foreground",
                            errors['shippingAddress.departamento'] && "border-destructive focus:ring-destructive/20"
                        )}>
                            <SelectValue placeholder=" " />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(locations).map(dep => <SelectItem key={dep} value={dep} className="text-xs">{dep}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <label className={cn(
                        "absolute left-3 top-1 text-[10px] text-muted-foreground pointer-events-none transition-all select-none origin-left",
                        !values.departamento && "top-3 text-xs"
                    )}>
                        Departamento
                    </label>
                    {errors['shippingAddress.departamento'] && (
                        <p className="absolute top-11 left-0 text-[10px] text-destructive mt-1 px-1 tracking-wide">
                            {errors['shippingAddress.departamento']}
                        </p>
                    )}
                </div>

                {/* Provincia */}
                <div className={cn(
                    "relative w-full h-11 flex flex-col justify-end transition-all",
                    errors['shippingAddress.provincia'] && "mb-5"
                )}>
                    <Select value={values.provincia} onValueChange={val => handleSelectChange('provincia', val)} disabled={provincias.length === 0}>
                        <SelectTrigger className={cn(
                            "h-11 px-3 pt-4 pb-1 text-xs font-normal text-foreground rounded-md border-border text-left w-full flex items-center justify-between [&>span]:line-clamp-1 [&>span]:text-xs [&>span]:text-foreground",
                            errors['shippingAddress.provincia'] && "border-destructive focus:ring-destructive/20"
                        )}>
                            <SelectValue placeholder=" " />
                        </SelectTrigger>
                        <SelectContent>
                            {provincias.map(p => <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <label className={cn(
                        "absolute left-3 top-1 text-[10px] text-muted-foreground pointer-events-none transition-all select-none origin-left",
                        !values.provincia && "top-3 text-xs"
                    )}>
                        Provincia
                    </label>
                    {errors['shippingAddress.provincia'] && (
                        <p className="absolute top-11 left-0 text-[10px] text-destructive mt-1 px-1 tracking-wide">
                            {errors['shippingAddress.provincia']}
                        </p>
                    )}
                </div>

                {/* Distrito */}
                <div className={cn(
                    "relative w-full h-11 flex flex-col justify-end transition-all",
                    errors['shippingAddress.distrito'] && "mb-5"
                )}>
                    <Select value={values.distrito} onValueChange={val => onChange('distrito', val)} disabled={distritos.length === 0} >
                        <SelectTrigger className={cn(
                            "h-11 px-3 pt-4 pb-1 text-xs font-normal text-foreground rounded-md border-border text-left w-full flex items-center justify-between [&>span]:line-clamp-1 [&>span]:text-xs [&>span]:text-foreground",
                            errors['shippingAddress.distrito'] && "border-destructive focus:ring-destructive/20"
                        )}>
                            <SelectValue placeholder=" " />
                        </SelectTrigger>
                        <SelectContent>
                            {distritos.map(d => <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <label className={cn(
                        "absolute left-3 top-1 text-[10px] text-muted-foreground pointer-events-none transition-all select-none origin-left",
                        !values.distrito && "top-3 text-xs"
                    )}>
                        Distrito
                    </label>
                    {errors['shippingAddress.distrito'] && (
                        <p className="absolute top-11 left-0 text-[10px] text-destructive mt-1 px-1 tracking-wide">
                            {errors['shippingAddress.distrito']}
                        </p>
                    )}
                </div>
            </div>

            {/* Dirección Principal */}
            {renderField('direccion', 'Dirección (Calle, avenida, número)')}

            {/* Referencia */}
            {renderField('referencia', 'Referencia de entrega')}

            {/* Notas Especiales */}
            <div className="relative w-full group flex flex-col justify-end h-11">
                <InputV2
                    id="shipping-notes"
                    label="Notas adicionales del pedido (Opcional)"
                    value={notes}
                    onChange={e => onNotesChange(e.target.value)}
                    maxLength={300}
                />
            </div>
        </fieldset>
    )
}