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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
            
            {/* Email - Solo lectura */}
            <div className="flex flex-col gap-2 mb-4">
                <Label className="">
                    Cuenta de usuario
                </Label>
                <Input {...register('email')} disabled className="opacity-60 bg-[var(--color-bg-secondary)]" />
            </div>

            {/* Fila: Nombre y Apellidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <div className="flex flex-col gap-2">
                    <Label required className="">
                        Nombre
                    </Label>
                    <Input 
                        {...register('nombre', { required: true })} 
                        aria-invalid={errors.nombre ? "true" : "false"}
                        placeholder="Escribe tu nombre"
                    />
                    <div className="h-6 overflow-hidden">
                        {errors.nombre && <ErrorMessage>Campo requerido</ErrorMessage>}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <Label required className="">
                        Apellidos
                    </Label>
                    <Input 
                        {...register('apellidos', { required: true })} 
                        aria-invalid={errors.apellidos ? "true" : "false"}
                        placeholder="Escribe tus apellidos"
                    />
                    <div className="h-6 overflow-hidden">
                        {errors.apellidos && <ErrorMessage>Campo requerido</ErrorMessage>}
                    </div>
                </div>
            </div>

            {/* Fila: Documentos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
                <div className="flex flex-col gap-2">
                    <Label required className="w-full">
                        Tipo Doc.
                    </Label>
                    <Controller
                        control={control}
                        name="tipoDocumento"
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger aria-invalid={errors.tipoDocumento ? "true" : "false"} className = "w-full">
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
                    <div className="h-6" />
                </div>

                <div className="md:col-span-2 flex flex-col gap-2">
                    <Label required className="">
                        N° Documento
                    </Label>
                    <Input 
                        {...register('numeroDocumento', { required: true, minLength: 8 })} 
                        aria-invalid={errors.numeroDocumento ? "true" : "false"}
                        placeholder="00000000"
                    />
                    <div className="h-6 overflow-hidden">
                        {errors.numeroDocumento && <ErrorMessage>Documento inválido</ErrorMessage>}
                    </div>
                </div>
            </div>

            {/* Teléfono */}
            <div className="flex flex-col gap-2">
                <Label required className="">
                    Teléfono / Móvil
                </Label>
                <Input 
                    {...register('telefono', { required: true, pattern: /^[0-9]{9}$/ })} 
                    aria-invalid={errors.telefono ? "true" : "false"}
                    placeholder="999999999"
                />
                <div className="h-6 overflow-hidden">
                    {errors.telefono && <ErrorMessage>9 dígitos numéricos</ErrorMessage>}
                </div>
            </div>

            {/* Botón de envío */}
            <div className="pt-6 border-t border-[var(--color-border-subtle)] mt-4">
                <Button
                    type="submit"
                    disabled={isPending || !isValid}
                    variant="accent"
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