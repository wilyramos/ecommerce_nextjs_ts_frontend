'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ErrorMessage from '@/components/ui/ErrorMessage'
import type { CustomerProfile, TipoDocumento } from '@/src/schemas/order.schema'

type Props = {
    values: CustomerProfile
    errors: Record<string, string>
    disabled?: boolean
    lockedEmail?: string
    onChange: (field: keyof CustomerProfile, value: string | TipoDocumento | undefined) => void
}

export default function CustomerProfileSection({ values, errors, disabled, lockedEmail, onChange }: Props) {

    // Helper ultracompacto con manejo de errores inline al lado del label
    const renderField = (fieldKey: keyof CustomerProfile, label: string, placeholder: string, type = "text", required = true) => {
        const errorKey = `customerProfile.${fieldKey}`
        const error = errors[errorKey]

        return (
            <div className="flex flex-col gap-0.5 w-full">
                <div className="flex items-center justify-between h-5">
                    <Label required={required} className="text-[10px] font-bold text-muted-foreground">{label}</Label>                    {error && <div className="text-xs mt-[-4px]"><ErrorMessage>{error}</ErrorMessage></div>}
                </div>
                <Input
                    type={type}
                    value={(values[fieldKey] as string) ?? ''}
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
            <legend className="sr-only">Datos personales</legend>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
                {lockedEmail ? (
                    <>
                        <div className="flex items-center justify-between h-5">
                            <Label className="text-[10px]">Correo</Label>
                        </div>
                        <Input
                            value={lockedEmail}
                            disabled
                            readOnly
                            className="border-border cursor-not-allowed select-none"
                        />
                    </>
                ) : (
                    renderField('email', 'Correo electrónico', 'correo@ejemplo.com', 'email', true)
                )}
            </div>

            {/* Nombre / Apellidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField('nombre', 'Nombre', 'Tu nombre', 'text', true)}
                {renderField('apellidos', 'Apellidos', 'Tus apellidos', 'text', true)}
            </div>

            {/* Teléfono y Documento de Identidad alineados en la misma fila */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Teléfono */}
                <div>
                    {renderField('telefono', 'Teléfono / Móvil', '999 999 999', 'tel', true)}
                </div>

                {/* Tipo Doc. */}
                <div className="flex flex-col gap-0.5 w-full">
                    <div className="flex items-center justify-between h-5">
                        <Label className="text-[10px]">Tipo Doc.</Label>
                    </div>
                    <Select
                        value={values.tipoDocumento ?? ''}
                        onValueChange={val => onChange('tipoDocumento', (val as TipoDocumento) || undefined)}
                        disabled={disabled}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Opcional" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="DNI">DNI</SelectItem>
                            <SelectItem value="RUC">RUC</SelectItem>
                            <SelectItem value="CE">Carnet Ext.</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* N° Documento */}
                <div>
                    {renderField('numeroDocumento', 'N° Documento', 'Opcional', 'text', false)}
                </div>
            </div>
        </fieldset>
    )
}