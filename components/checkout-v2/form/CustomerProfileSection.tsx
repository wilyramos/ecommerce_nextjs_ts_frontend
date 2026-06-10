'use client'

import * as React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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

    const renderField = (fieldKey: keyof CustomerProfile, labelPlaceholder: string, type = "text") => {
        const errorKey = `customerProfile.${fieldKey}`
        const error = errors[errorKey]
        const fieldId = `profile-field-${fieldKey}`

        return (
            <div className={cn(
                "relative w-full transition-all",
                error && "mb-5"
            )}>
                <InputV2
                    type={type}
                    id={fieldId}
                    label={labelPlaceholder}
                    value={(values[fieldKey] as string) ?? ''}
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
            <legend className="sr-only">Datos personales</legend>

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

            {/* Teléfono y Documentos perfectamente alineados arriba */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">

                {/* Teléfono */}
                <div className="sm:col-span-1 w-full">
                    {renderField('telefono', 'Nro de teléfono', 'tel')}
                </div>

                {/* Tipo de Documento */}
                <div className="sm:col-span-1 w-full flex flex-col">
                    <div className={cn(
                        "relative w-full h-11 flex flex-col justify-end transition-all",
                        errors['customerProfile.tipoDocumento'] && "mb-5"
                    )}>
                        <Select
                            value={values.tipoDocumento ?? ''}
                            onValueChange={val => onChange('tipoDocumento', (val as TipoDocumento) || undefined)}
                            disabled={disabled}
                        >
                            <SelectTrigger className={cn(
                                "h-11 px-3 pt-4 pb-1 text-xs font-normal text-foreground rounded-md border-border text-left w-full flex items-center justify-between [&>span]:line-clamp-1 [&>span]:text-xs [&>span]:text-foreground focus:ring-[1px]",
                                errors['customerProfile.tipoDocumento'] && "border-destructive focus:ring-destructive/20"
                            )}>
                                <SelectValue placeholder=" " />
                                <SelectContent className="w-full">
                                    <SelectItem value="DNI" className="text-xs">DNI</SelectItem>
                                    <SelectItem value="RUC" className="text-xs">RUC</SelectItem>
                                    <SelectItem value="CE" className="text-xs">Carnet Ext.</SelectItem>
                                </SelectContent>
                            </SelectTrigger>
                        </Select>
                        <label className={cn(
                            "absolute left-3 top-1 text-[10px] text-muted-foreground pointer-events-none transition-all select-none origin-left",
                            !values.tipoDocumento && "top-3 text-xs"
                        )}>
                            Tipo de documento
                        </label>
                        {errors['customerProfile.tipoDocumento'] && (
                            <p className="absolute top-11 left-0 text-[10px] text-destructive mt-1 px-1 tracking-wide">
                                {errors['customerProfile.tipoDocumento']}
                            </p>
                        )}
                    </div>
                </div>

                {/* Número de Documento */}
                <div className="sm:col-span-1 w-full">
                    {renderField('numeroDocumento', 'Número de documento')}
                </div>

            </div>
        </fieldset>
    )
}