'use client'

import { useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { locations } from '@/src/data/locations'
import type { ShippingAddress } from '@/src/schemas/order.schema'

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

    // Helper compacto con el error alineado a la derecha del Label
    const renderField = (fieldKey: keyof ShippingAddress, label: string, placeholder: string, required = true) => {
        const errorKey = `shippingAddress.${fieldKey}`
        const error = errors[errorKey]
        return (
            <div className="flex flex-col gap-1.5 w-full">
                <div className="flex items-center justify-between gap-2 h-5">
                    <Label required={required}>{label}</Label>
                    {error && <div className="text-xs mt-[-4px]"><ErrorMessage>{error}</ErrorMessage></div>}
                </div>
                <Input
                    value={values[fieldKey] ?? ''}
                    onChange={e => onChange(fieldKey, e.target.value)}
                    placeholder={placeholder}
                    aria-invalid={!!error}
                    disabled={disabled}
                />
            </div>
        )
    }

    return (
        <fieldset className="space-y-1 text-foreground" disabled={disabled}>

            {/* Ubigeo (Departamento / Provincia / Distrito) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {/* Departamento */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between h-5">
                        <Label required>Departamento</Label>
                        {errors['shippingAddress.departamento'] && <div className="text-xs mt-[-4px]"><ErrorMessage>{errors['shippingAddress.departamento']}</ErrorMessage></div>}
                    </div>
                    <Select value={values.departamento} onValueChange={val => handleSelectChange('departamento', val)}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                        <SelectContent>
                            {Object.keys(locations).map(dep => <SelectItem key={dep} value={dep}>{dep}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                {/* Provincia */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between h-5">
                        <Label required>Provincia</Label>
                        {errors['shippingAddress.provincia'] && <div className="text-xs mt-[-4px]"><ErrorMessage>{errors['shippingAddress.provincia']}</ErrorMessage></div>}
                    </div>
                    <Select value={values.provincia} onValueChange={val => handleSelectChange('provincia', val)} disabled={provincias.length === 0}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                        <SelectContent>
                            {provincias.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                {/* Distrito */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between h-5">
                        <Label required>Distrito</Label>
                        {errors['shippingAddress.distrito'] && <div className="text-xs mt-[-4px]"><ErrorMessage>{errors['shippingAddress.distrito']}</ErrorMessage></div>}
                    </div>
                    <Select value={values.distrito} onValueChange={val => onChange('distrito', val)} disabled={distritos.length === 0}>
                        <SelectTrigger className="w-full"><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                        <SelectContent>
                            {distritos.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Dirección Principal */}
            {renderField('direccion', 'Dirección', 'Av. Principal 123', true)}


            {/* Referencia */}
            {renderField('referencia', 'Referencia', 'Ej. Frente al parque, casa color verde...', true)}

            {/* Notas Especiales */}
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between h-5">
                    <Label>Notas del pedido <span className="text-muted-foreground text-xs"></span></Label>
                </div>
                <Input
                    value={notes}
                    onChange={e => onNotesChange(e.target.value)}
                    placeholder="Instrucciones especiales de entrega..."
                    maxLength={300}
                />
            </div>
        </fieldset>
    )
}