// File: frontend/components/checkout-v2/form/ShippingAddressSection.tsx

import { useMemo } from 'react'
import { UseFormReturn, Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { locations } from '@/src/data/locations'
import type { CheckoutFormValues } from './CheckoutForm'

type Props = {
    form: UseFormReturn<CheckoutFormValues>
    disabled?: boolean
}

export default function ShippingAddressSection({ form, disabled }: Props) {
    const { register, control, watch, setValue, trigger, formState: { errors } } = form

    const selectedDepartamento = watch('shippingAddress.departamento')
    const selectedProvincia    = watch('shippingAddress.provincia')

    const provincias = useMemo(
        () => selectedDepartamento ? Object.keys(locations[selectedDepartamento] ?? {}) : [],
        [selectedDepartamento]
    )

    const distritos = useMemo(
        () => selectedDepartamento && selectedProvincia
            ? locations[selectedDepartamento]?.[selectedProvincia] ?? []
            : [],
        [selectedDepartamento, selectedProvincia]
    )

    return (
        <fieldset className="space-y-4" disabled={disabled}>
            <legend className="sr-only">Dirección de envío</legend>

            {/* Ubigeo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Departamento */}
                <div className="flex flex-col gap-1.5">
                    <Label required>Departamento</Label>
                    <Controller
                        control={control}
                        name="shippingAddress.departamento"
                        render={({ field }) => (
                            <Select
                                onValueChange={(val) => {
                                    field.onChange(val)
                                    setValue('shippingAddress.provincia', '')
                                    setValue('shippingAddress.distrito', '')
                                    trigger(['shippingAddress.departamento', 'shippingAddress.provincia', 'shippingAddress.distrito'])
                                }}
                                value={field.value}
                            >
                                <SelectTrigger
                                    className="w-full"
                                    aria-invalid={errors.shippingAddress?.departamento ? 'true' : 'false'}
                                >
                                    <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(locations).map(dep => (
                                        <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <div className="min-h-5 overflow-hidden">
                        {errors.shippingAddress?.departamento && (
                            <ErrorMessage>{errors.shippingAddress.departamento.message}</ErrorMessage>
                        )}
                    </div>
                </div>

                {/* Provincia */}
                <div className="flex flex-col gap-1.5">
                    <Label required>Provincia</Label>
                    <Controller
                        control={control}
                        name="shippingAddress.provincia"
                        render={({ field }) => (
                            <Select
                                disabled={!provincias.length}
                                onValueChange={(val) => {
                                    field.onChange(val)
                                    setValue('shippingAddress.distrito', '')
                                    trigger(['shippingAddress.provincia', 'shippingAddress.distrito'])
                                }}
                                value={field.value}
                            >
                                <SelectTrigger
                                    className="w-full"
                                    aria-invalid={errors.shippingAddress?.provincia ? 'true' : 'false'}
                                >
                                    <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent>
                                    {provincias.map(p => (
                                        <SelectItem key={p} value={p}>{p}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <div className="min-h-5 overflow-hidden">
                        {errors.shippingAddress?.provincia && (
                            <ErrorMessage>{errors.shippingAddress.provincia.message}</ErrorMessage>
                        )}
                    </div>
                </div>

                {/* Distrito */}
                <div className="flex flex-col gap-1.5">
                    <Label required>Distrito</Label>
                    <Controller
                        control={control}
                        name="shippingAddress.distrito"
                        render={({ field }) => (
                            <Select
                                disabled={!distritos.length}
                                onValueChange={(val) => {
                                    field.onChange(val)
                                    trigger('shippingAddress.distrito')
                                }}
                                value={field.value}
                            >
                                <SelectTrigger
                                    className="w-full"
                                    aria-invalid={errors.shippingAddress?.distrito ? 'true' : 'false'}
                                >
                                    <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent>
                                    {distritos.map(d => (
                                        <SelectItem key={d} value={d}>{d}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <div className="min-h-5 overflow-hidden">
                        {errors.shippingAddress?.distrito && (
                            <ErrorMessage>{errors.shippingAddress.distrito.message}</ErrorMessage>
                        )}
                    </div>
                </div>
            </div>

            {/* Dirección */}
            <div className="flex flex-col gap-1.5">
                <Label required>Dirección</Label>
                <Input
                    {...register('shippingAddress.direccion')}
                    placeholder="Av. Principal 123"
                    aria-invalid={errors.shippingAddress?.direccion ? 'true' : 'false'}
                />
                <div className="min-h-5 overflow-hidden">
                    {errors.shippingAddress?.direccion && (
                        <ErrorMessage>{errors.shippingAddress.direccion.message}</ErrorMessage>
                    )}
                </div>
            </div>

            {/* Número y Piso */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label>Número</Label>
                    <Input {...register('shippingAddress.numero')} placeholder="N° (opcional)" />
                    <div className="min-h-5" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label>Piso / Dpto</Label>
                    <Input {...register('shippingAddress.pisoDpto')} placeholder="Opcional" />
                    <div className="min-h-5" />
                </div>
            </div>

            {/* Referencia */}
            <div className="flex flex-col gap-1.5">
                <Label required>Referencia</Label>
                <Input
                    {...register('shippingAddress.referencia')}
                    placeholder="Ej. Frente al parque, casa color verde..."
                    aria-invalid={errors.shippingAddress?.referencia ? 'true' : 'false'}
                />
                <div className="min-h-5 overflow-hidden">
                    {errors.shippingAddress?.referencia && (
                        <ErrorMessage>{errors.shippingAddress.referencia.message}</ErrorMessage>
                    )}
                </div>
            </div>

            {/* Notas opcionales */}
            <div className="flex flex-col gap-1.5">
                <Label>Notas del pedido <span className="text-muted-foreground text-xs">(opcional)</span></Label>
                <Input
                    {...register('notes')}
                    placeholder="Instrucciones especiales de entrega..."
                />
                <div className="min-h-5" />
            </div>
        </fieldset>
    )
}