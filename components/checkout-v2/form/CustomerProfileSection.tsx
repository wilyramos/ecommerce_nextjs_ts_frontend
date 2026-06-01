// File: frontend/components/checkout-v2/form/CustomerProfileSection.tsx

import { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Controller } from 'react-hook-form'
import ErrorMessage from '@/components/ui/ErrorMessage'
import type { CheckoutFormValues } from './CheckoutForm'

type Props = {
    form: UseFormReturn<CheckoutFormValues>
    disabled?: boolean
    lockedEmail?: string  // email del usuario autenticado — no editable
}

export default function CustomerProfileSection({ form, disabled, lockedEmail }: Props) {
    const { register, control, formState: { errors } } = form

    return (
        <fieldset className="space-y-4" disabled={disabled}>
            <legend className="sr-only">Datos personales</legend>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
                <Label>Correo electrónico</Label>
                {lockedEmail ? (
                    <Input
                        value={lockedEmail}
                        disabled
                        className="bg-muted text-muted-foreground cursor-not-allowed"
                    />
                ) : (
                    <>
                        <Input
                            {...register('customerProfile.email')}
                            type="email"
                            placeholder="correo@ejemplo.com"
                            aria-invalid={errors.customerProfile?.email ? 'true' : 'false'}
                        />
                        <div className="min-h-5 overflow-hidden">
                            {errors.customerProfile?.email && (
                                <ErrorMessage>{errors.customerProfile.email.message}</ErrorMessage>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Nombre / Apellidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label required>Nombre</Label>
                    <Input
                        {...register('customerProfile.nombre')}
                        placeholder="Tu nombre"
                        aria-invalid={errors.customerProfile?.nombre ? 'true' : 'false'}
                    />
                    <div className="min-h-5 overflow-hidden">
                        {errors.customerProfile?.nombre && (
                            <ErrorMessage>{errors.customerProfile.nombre.message}</ErrorMessage>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-1.5">
                    <Label required>Apellidos</Label>
                    <Input
                        {...register('customerProfile.apellidos')}
                        placeholder="Tus apellidos"
                        aria-invalid={errors.customerProfile?.apellidos ? 'true' : 'false'}
                    />
                    <div className="min-h-5 overflow-hidden">
                        {errors.customerProfile?.apellidos && (
                            <ErrorMessage>{errors.customerProfile.apellidos.message}</ErrorMessage>
                        )}
                    </div>
                </div>
            </div>

            {/* Teléfono */}
            <div className="flex flex-col gap-1.5">
                <Label required>Teléfono / Móvil</Label>
                <Input
                    {...register('customerProfile.telefono')}
                    placeholder="999999999"
                    aria-invalid={errors.customerProfile?.telefono ? 'true' : 'false'}
                />
                <div className="min-h-5 overflow-hidden">
                    {errors.customerProfile?.telefono && (
                        <ErrorMessage>{errors.customerProfile.telefono.message}</ErrorMessage>
                    )}
                </div>
            </div>

            {/* Documento */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label>Tipo Doc.</Label>
                    <Controller
                        control={control}
                        name="customerProfile.tipoDocumento"
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value ?? ''}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Opcional" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DNI">DNI</SelectItem>
                                    <SelectItem value="RUC">RUC</SelectItem>
                                    <SelectItem value="CE">Carnet Ext.</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <div className="min-h-5" />
                </div>
                <div className="md:col-span-2 flex flex-col gap-1.5">
                    <Label>N° Documento</Label>
                    <Input
                        {...register('customerProfile.numeroDocumento')}
                        placeholder="Opcional"
                    />
                    <div className="min-h-5" />
                </div>
            </div>
        </fieldset>
    )
}