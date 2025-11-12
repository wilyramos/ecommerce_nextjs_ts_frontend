'use client'

import { useState, useMemo } from 'react'
import { useCheckoutStore } from '@/src/store/checkoutStore'
import { useCartStore } from '@/src/store/cartStore'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { createOrderAction } from '@/actions/order/create-order-action'
import { locations } from '@/src/data/locations'
import ErrorMessage from '@/components/ui/ErrorMessage'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '../ui/button'
import type { TCreateOrder } from '@/src/schemas'
import { Input } from '../ui/input'

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

    const { register, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm<ShippingData>({
        defaultValues: shipping || {},
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
        try {
            setLoading(true)
            setShipping(data)

            const subtotal = cart.reduce((t, i) => t + i.precio * i.cantidad, 0)
            const shippingCost = 0
            const totalPrice = subtotal + shippingCost

            const orderPayload: TCreateOrder = {
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
                payment: { provider: 'IZIPAY', status: 'pending' },
            }

            const order = await createOrderAction(orderPayload)
            localStorage.setItem('currentOrderId', order.order._id || '')
            router.push(`/checkout/payment?orderId=${order.order._id}`)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto space-y-3">
            {/* Departamento / Provincia / Distrito */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label className="text-xs font-bold">Departamento <span className="text-red-500">*</span></label>
                    <Select
                        value={selectedDepartamento || ""}
                        onValueChange={(val) => {
                            setValue('departamento', val)
                            setValue('provincia', '')
                            setValue('distrito', '')
                            trigger('departamento')
                        }}
                    >
                        <SelectTrigger><SelectValue placeholder="--Seleccione--" /></SelectTrigger>
                        <SelectContent>
                            {Object.keys(locations).map(dep => (
                                <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <input type="hidden" {...register('departamento', { required: 'El departamento es obligatorio' })} />
                    {errors.departamento && <ErrorMessage>{errors.departamento.message}</ErrorMessage>}
                </div>

                <div>
                    <label className="text-xs font-bold">Provincia <span className="text-red-500">*</span></label>
                    <Select
                        value={selectedProvincia || ""}
                        onValueChange={(val) => {
                            setValue('provincia', val)
                            setValue('distrito', '')
                            trigger('provincia')
                        }}
                        disabled={!provincias.length}
                    >
                        <SelectTrigger><SelectValue placeholder="--Seleccione--" /></SelectTrigger>
                        <SelectContent>
                            {provincias.map(p => (
                                <SelectItem key={p} value={p}>{p}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <input type="hidden" {...register('provincia', { required: 'La provincia es obligatoria' })} />
                    {errors.provincia && <ErrorMessage>{errors.provincia.message}</ErrorMessage>}
                </div>

                <div>
                    <label className="text-xs font-bold">Distrito <span className="text-red-500">*</span></label>
                    <Select
                        onValueChange={(val) => {
                            setValue('distrito', val)
                            trigger('distrito')
                        }}
                        disabled={!distritos.length}
                    >
                        <SelectTrigger><SelectValue placeholder="--Seleccione--" /></SelectTrigger>
                        <SelectContent>
                            {distritos.map(d => (
                                <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <input type="hidden" {...register('distrito', { required: 'El distrito es obligatorio' })} />
                    {errors.distrito && <ErrorMessage>{errors.distrito.message}</ErrorMessage>}
                </div>
            </div>

            <div>
                <label className="text-xs font-bold">Dirección <span className="text-red-500">*</span></label>
                <Input
                    type="text"
                    {...register('direccion', { required: 'La dirección es obligatoria' })}
                    placeholder="Av. abc 123"
                />
                {errors.direccion && <ErrorMessage>{errors.direccion.message}</ErrorMessage>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold">Número</label>
                    <Input type="text" {...register('numero')} />
                </div>
                <div>
                    <label className="text-xs font-bold">Piso / Dpto</label>
                    <Input type="text" {...register('pisoDpto')} />
                </div>
            </div>

            <div>
                <label className="text-xs font-bold">Referencia *</label>
                <input
                    type="text"
                    {...register('referencia', { required: 'La referencia es obligatoria' })}
                    placeholder="Ej. Frente a la tienda Tottus"
                    className="w-full px-3 py-2 border rounded-lg"
                />
                {errors.referencia && <ErrorMessage>{errors.referencia.message}</ErrorMessage>}
            </div>

            <Button
                type="submit"
                disabled={loading}
                className="w-full mt-2 disabled:opacity-50 cursor-pointer"
            >
                {loading ? 'Creando orden...' : 'Ir a pagar'}
            </Button>
        </form>
    )
}
