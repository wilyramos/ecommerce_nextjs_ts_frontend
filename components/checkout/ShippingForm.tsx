'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { useCheckoutStore } from '@/src/store/checkoutStore'
import { useCartStore } from '@/src/store/cartStore'
import { createOrderAction } from '@/actions/order/create-order-action'
import { locations } from '@/src/data/locations'
import ErrorMessage from '../ui/ErrorMessage'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { TCreateOrder } from '@/src/schemas'

type ShippingData = {
    departamento: string
    provincia: string
    distrito: string
    direccion: string
    numero?: string
    pisoDpto?: string
    referencia: string
}

export default function ShippingForm() {
    const router = useRouter()
    const { shipping, setShipping } = useCheckoutStore()
    const { cart } = useCartStore()
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        trigger,
        control,
        formState: { errors, isValid },
    } = useForm<ShippingData>({
        mode: 'onChange',
        defaultValues: shipping || {
            departamento: '',
            provincia: '',
            distrito: '',
            direccion: '',
            referencia: ''
        },
    })

    const selectedDepartamento = watch('departamento')
    const selectedProvincia = watch('provincia')

    const provincias = useMemo(
        () => (selectedDepartamento ? Object.keys(locations[selectedDepartamento] || {}) : []),
        [selectedDepartamento]
    )

    const distritos = useMemo(
        () => (selectedDepartamento && selectedProvincia
            ? locations[selectedDepartamento]?.[selectedProvincia] || []
            : []),
        [selectedDepartamento, selectedProvincia]
    )

    const onSubmit = async (data: ShippingData) => {
        setLoading(true)
        setShipping(data)

        const subtotal = cart.reduce((t, i) => t + i.precio * i.cantidad, 0)
        const shippingCost = 0
        const totalPrice = subtotal + shippingCost

        const payload: TCreateOrder = {
            items: cart.map(item => ({
                productId: item._id,
                quantity: item.cantidad,
                price: item.precio,
                variantId: item.variant?._id,
                variantAttributes: item.variant?.atributos || {},
                nombre: item.nombre,
                imagen: item.imagenes?.[0],
            })),
            subtotal,
            shippingCost,
            totalPrice,
            shippingAddress: data,
            currency: 'PEN',
            payment: { provider: 'IZIPAY', status: 'pending' }
        }

        const result = await createOrderAction(payload)

        if (!result.ok) {
            toast.error(result.message)
            setLoading(false)
            return
        }

        localStorage.setItem("currentOrderId", result.order._id)
        router.push(`/checkout/payment?orderId=${result.order._id}`)
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
            
            {/* UBIGEO: Departamento / Provincia / Distrito */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
                <div className="flex flex-col gap-2">
                    <Label required>Departamento</Label>
                    <Controller
                        control={control}
                        name="departamento"
                        
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Select 
                                onValueChange={(val) => {
                                    field.onChange(val)
                                    setValue('provincia', '')
                                    setValue('distrito', '')
                                    trigger(['departamento', 'provincia', 'distrito'])
                                }} 
                                value={field.value}
                            >
                                <SelectTrigger aria-invalid={errors.departamento ? "true" : "false"} className='w-full'>
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
                    <div className="h-6">
                        {errors.departamento && <ErrorMessage>Requerido</ErrorMessage>}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <Label required>Provincia</Label>
                    <Controller
                        control={control}
                        name="provincia"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Select 
                                disabled={!provincias.length}
                                onValueChange={(val) => {
                                    field.onChange(val)
                                    setValue('distrito', '')
                                    trigger(['provincia', 'distrito'])
                                }} 
                                value={field.value}
                            >
                                <SelectTrigger aria-invalid={errors.provincia ? "true" : "false"} className='w-full'>
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
                    <div className="h-6">
                        {errors.provincia && <ErrorMessage>Requerido</ErrorMessage>}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <Label required>Distrito</Label>
                    <Controller
                        control={control}
                        name="distrito"
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Select 
                                disabled={!distritos.length}
                                onValueChange={(val) => {
                                    field.onChange(val)
                                    trigger('distrito')
                                }} 
                                value={field.value}
                            >
                                <SelectTrigger aria-invalid={errors.distrito ? "true" : "false"} className='w-full'>
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
                    <div className="h-6">
                        {errors.distrito && <ErrorMessage>Requerido</ErrorMessage>}
                    </div>
                </div>
            </div>

            {/* DIRECCIÓN */}
            <div className="flex flex-col gap-2">
                <Label required>Dirección</Label>
                <Input 
                    {...register('direccion', { required: true })} 
                    aria-invalid={errors.direccion ? "true" : "false"}
                    placeholder="Av. Principal 123"
                />
                <div className="h-6">
                    {errors.direccion && <ErrorMessage>La dirección es obligatoria</ErrorMessage>}
                </div>
            </div>

            {/* NÚMERO Y PISO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <div className="flex flex-col gap-2">
                    <Label>Número</Label>
                    <Input {...register('numero')} placeholder="N°" />
                    <div className="h-6" />
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Piso / Dpto</Label>
                    <Input {...register('pisoDpto')} placeholder="Opcional" />
                    <div className="h-6" />
                </div>
            </div>

            {/* REFERENCIA */}
            <div className="flex flex-col gap-2">
                <Label required>Referencia</Label>
                <Input 
                    {...register('referencia', { required: true })} 
                    aria-invalid={errors.referencia ? "true" : "false"}
                    placeholder="Ej. Frente al parque, casa color verde..."
                />
                <div className="h-6">
                    {errors.referencia && <ErrorMessage>La referencia es obligatoria</ErrorMessage>}
                </div>
            </div>

            {/* Botón de envío */}
            <div className="pt-6 border-t border-[var(--color-border-subtle)] mt-4">
                <Button
                    type="submit"
                    disabled={loading || !isValid}
                    variant="accent"
                    className="w-full"
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span>Procesando orden...</span>
                        </div>
                    ) : (
                        'Confirmar y Pagar'
                    )}
                </Button>
            </div>
        </form>
    )
}