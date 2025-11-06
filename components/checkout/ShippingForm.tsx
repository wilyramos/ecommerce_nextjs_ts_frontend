'use client'

import { useCheckoutStore } from '@/src/store/checkoutStore'
import { useCartStore } from '@/src/store/cartStore'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
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

    const { register, handleSubmit, watch, reset, setValue, trigger, formState: { errors } } = useForm<ShippingData>({
        defaultValues: {
            departamento: shipping?.departamento || '',
            provincia: shipping?.provincia || '',
            distrito: shipping?.distrito || '',
            direccion: shipping?.direccion || '',
            numero: shipping?.numero || '',
            pisoDpto: shipping?.pisoDpto || '',
            referencia: shipping?.referencia || '',
        },
    })

    const selectedDepartamento = watch('departamento')
    const selectedProvincia = watch('provincia')
    const [provincias, setProvincias] = useState<string[]>([])
    const [distritos, setDistritos] = useState<string[]>([])

    useEffect(() => {
        console.log('Shipping data loaded:', shipping)
        if (shipping) reset(shipping)
    }, [shipping, reset])

    // Actualizar provincias al cambiar departamento
    useEffect(() => {
        console.log('Departamento changed:', selectedDepartamento)
        const dept = locations.find(d => d.departamento === selectedDepartamento)
        setProvincias(dept ? dept.provincias.map(p => p.nombre) : [])
        setDistritos([])
        setValue('provincia', '')
        setValue('distrito', '')
    }, [selectedDepartamento, setValue])

    // Actualizar distritos al cambiar provincia
    useEffect(() => {
        const dept = locations.find(d => d.departamento === selectedDepartamento)
        const prov = dept?.provincias.find(p => p.nombre === selectedProvincia)
        setDistritos(prov ? prov.distritos : [])
        setValue('distrito', '')
    }, [selectedProvincia, selectedDepartamento, setValue])

    const onSubmit = async (data: ShippingData) => {
        console.log('Shipping data submitted:', data)
        setShipping(data)

        // Totals
        const subtotal = cart.reduce((t, i) => t + i.precio * i.cantidad, 0)
        const shippingCost = 0
        const totalPrice = subtotal + shippingCost;

        // items for order


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
            subtotal: subtotal,
            shippingCost: shippingCost,
            totalPrice: totalPrice,
            shippingAddress: data,
            currency: 'PEN',
            payment: { provider: 'IZIPAY', status: 'pending' },
        }

        const order = await createOrderAction(orderPayload)
        localStorage.setItem('currentOrderId', order.order._id || '')
        router.push(`/checkout/payment?orderId=${order.order._id}`)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto space-y-3">
            {/* Departamento / Provincia / Distrito */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                {/* Departamento */}
                <div>
                    <label className="text-xs font-bold">Departamento <span className="text-red-500">*</span></label>
                    <Select
                        onValueChange={(val) => {
                            setValue('departamento', val)
                            trigger('departamento')
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="--Seleccione--" />
                        </SelectTrigger>
                        <SelectContent>
                            {locations.map(d => (
                                <SelectItem key={d.departamento} value={d.departamento}>
                                    {d.departamento}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <input
                        type="hidden"
                        {...register('departamento', { required: 'El departamento es obligatorio' })}
                    />
                    {errors.departamento && <ErrorMessage>{errors.departamento.message}</ErrorMessage>}
                </div>

                {/* Provincia */}
                <div>
                    <label className="text-xs font-bold">Provincia <span className="text-red-500">*</span></label>
                    <Select
                        onValueChange={(val) => {
                            setValue('provincia', val)
                            trigger('provincia')
                        }}
                        disabled={!provincias.length}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="--Seleccione--" />
                        </SelectTrigger>
                        <SelectContent>
                            {provincias.map(p => (
                                <SelectItem key={p} value={p}>{p}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <input
                        type="hidden"
                        {...register('provincia', { required: 'La provincia es obligatoria' })}
                    />
                    {errors.provincia && <ErrorMessage>{errors.provincia.message}</ErrorMessage>}
                </div>

                {/* Distrito */}
                <div>
                    <label className="text-xs font-bold">Distrito <span className="text-red-500">*</span></label>
                    <Select
                        onValueChange={(val) => {
                            setValue('distrito', val)
                            trigger('distrito')
                        }}
                        disabled={!distritos.length}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="--Seleccione--" />
                        </SelectTrigger>
                        <SelectContent>
                            {distritos.map(d => (
                                <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <input
                        type="hidden"
                        {...register('distrito', { required: 'El distrito es obligatorio' })}
                    />
                    {errors.distrito && <ErrorMessage>{errors.distrito.message}</ErrorMessage>}
                </div>
            </div>

            {/* Dirección */}
            <div>
                <label className="text-xs font-bold">Dirección *</label>
                <input
                    type="text"
                    {...register('direccion', { required: 'La dirección es obligatoria' })}
                    placeholder="Av. Siempre Viva 123"
                    className="w-full px-3 py-2 border rounded-lg"
                />
                {errors.direccion && <ErrorMessage>{errors.direccion.message}</ErrorMessage>}
            </div>

            {/* Número y Piso/Dpto */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold">Número</label>
                    <input
                        type="text"
                        {...register('numero')}
                        placeholder="Ej. 202"
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>

                <div>
                    <label className="text-xs font-bold">Piso / Dpto</label>
                    <input
                        type="text"
                        {...register('pisoDpto')}
                        placeholder="Ej. 2do piso / 307"
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>
            </div>

            {/* Referencia */}
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

            {/* Botón */}
            <Button
                type="submit"
                className="w-full mt-2 disabled:opacity-50 cursor-pointer"
            >
                Ir a pagar
            </Button>
        </form>
    )
}
