// File: frontend/components/checkout/IdentificacionForm.tsx

'use client'

import { useTransition, useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { useCheckoutStore } from '@/src/store/checkoutStore'
import type { CheckoutRegister, User } from '@/src/schemas'
import ErrorMessage from '../ui/ErrorMessage'
import { EditUserAction } from '@/actions/user/edit-user-action'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from 'lucide-react'

type Props = {
    user: User
}

export default function IdentificacionForm({ user }: Props) {
    const router = useRouter()
    const { profile, setProfile } = useCheckoutStore()

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isValid },
    } = useForm<CheckoutRegister>({
        mode: 'onChange',
        defaultValues: {
            email: user.email || profile?.email || '',
            nombre: user.nombre || profile?.nombre || '',
            apellidos: user.apellidos || profile?.apellidos || "",
            tipoDocumento: user.tipoDocumento || profile?.tipoDocumento || 'DNI',
            numeroDocumento: user.numeroDocumento || profile?.numeroDocumento || '',
            telefono: user.telefono || profile?.telefono || '',
        },
    })

    const [state, formAction] = useActionState(EditUserAction, { errors: [], success: '' })
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        if (state.success && state.errors.length === 0) {
            router.push('/checkout/shipping')
        }
    }, [state.success, state.errors, router])

    const onSubmit = (data: CheckoutRegister) => {
        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => formData.append(key, value as string))
        
        startTransition(async () => {
            setProfile({ ...data, userId: user._id })
            await formAction(formData)
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-foreground">
            
            {/* Email - Solo lectura */}
            <div className="flex flex-col gap-1.5">
                <Label>
                    Cuenta de usuario
                </Label>
                <Input 
                    {...register('email')} 
                    disabled 
                    className="bg-muted-neutral text-muted-neutral-foreground border-border cursor-not-allowed select-none" 
                />
            </div>

            {/* Fila: Nombre y Apellidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label required>
                        Nombre
                    </Label>
                    <Input 
                        {...register('nombre', { required: true })} 
                        aria-invalid={errors.nombre ? "true" : "false"}
                        placeholder="Escribe tu nombre"
                        disabled={isPending}
                    />
                    <div className="min-h-5 overflow-hidden">
                        {errors.nombre && <ErrorMessage>Campo requerido</ErrorMessage>}
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label required>
                        Apellidos
                    </Label>
                    <Input 
                        {...register('apellidos', { required: true })} 
                        aria-invalid={errors.apellidos ? "true" : "false"}
                        placeholder="Escribe tus apellidos"
                        disabled={isPending}
                    />
                    <div className="min-h-5 overflow-hidden">
                        {errors.apellidos && <ErrorMessage>Campo requerido</ErrorMessage>}
                    </div>
                </div>
            </div>

            {/* Fila: Documentos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label required>
                        Tipo Doc.
                    </Label>
                    <Controller
                        control={control}
                        name="tipoDocumento"
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value} disabled={isPending}>
                                <SelectTrigger aria-invalid={errors.tipoDocumento ? "true" : "false"} className="w-full">
                                    <SelectValue placeholder="DNI" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DNI">DNI</SelectItem>
                                    <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                                    <SelectItem value="CE">Carnet de Ext.</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    <div className="min-h-5" />
                </div>

                <div className="md:col-span-2 flex flex-col gap-1.5">
                    <Label required>
                        N° Documento
                    </Label>
                    <Input 
                        {...register('numeroDocumento', { required: true, minLength: 8 })} 
                        aria-invalid={errors.numeroDocumento ? "true" : "false"}
                        placeholder="00000000"
                        disabled={isPending}
                    />
                    <div className="min-h-5 overflow-hidden">
                        {errors.numeroDocumento && <ErrorMessage>Documento inválido</ErrorMessage>}
                    </div>
                </div>
            </div>

            {/* Teléfono */}
            <div className="flex flex-col gap-1.5">
                <Label required>
                    Teléfono / Móvil
                </Label>
                <Input 
                    {...register('telefono', { required: true, pattern: /^[0-9]{9}$/ })} 
                    aria-invalid={errors.telefono ? "true" : "false"}
                    placeholder="999999999"
                    disabled={isPending}
                />
                <div className="min-h-5 overflow-hidden">
                    {errors.telefono && <ErrorMessage>Requiere 9 dígitos numéricos</ErrorMessage>}
                </div>
            </div>

            {/* Botón de envío */}
            <div className="pt-6 border-t border-border mt-2 flex justify-end">
                <Button
                    type="submit"
                    disabled={isPending || !isValid}
                    className="w-full md:w-auto bg-action-cta hover:bg-action-cta-hover text-action-cta-foreground font-bold px-8 rounded-[var(--radius-sm)]"
                >
                    {isPending ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span>Procesando...</span>
                        </div>
                    ) : (
                        'Continuar a Entrega'
                    )}
                </Button>
            </div>
        </form>
    )
}