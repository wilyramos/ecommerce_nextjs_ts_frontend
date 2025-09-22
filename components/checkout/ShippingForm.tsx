'use client'

import { useCheckoutStore } from '@/src/store/checkoutStore'
import { useForm } from 'react-hook-form'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { TCreateOrder } from '@/src/schemas'
import { useCartStore } from '@/src/store/cartStore'
import { createOrderAction } from '@/actions/order/create-order-action'
import { locations } from '@/src/data/locations'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

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
    const { shipping, setShipping } = useCheckoutStore((state) => state)
    const { cart } = useCartStore((state) => state)

    const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<ShippingData>({
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

    // Reset form if shipping exists
    useEffect(() => {
        if (shipping) reset(shipping)
    }, [shipping, reset])

    // Actualizar provincias al cambiar departamento
    useEffect(() => {
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
        setShipping(data)

        const orderPayload: TCreateOrder = {
            items: cart.map(item => ({
                productId: item._id,
                quantity: item.cantidad,
                price: item.precio,
            })),
            subtotal: cart.reduce((t, i) => t + i.precio * i.cantidad, 0),
            shippingCost: 0,
            totalPrice: cart.reduce((t, i) => t + i.precio * i.cantidad, 0),
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
                    <Select onValueChange={(val) => setValue('departamento', val)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="--Seleccione--" />
                        </SelectTrigger>
                        <SelectContent>
                            {locations.map(d => (
                                <SelectItem key={d.departamento} value={d.departamento}>{d.departamento}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.departamento && <ErrorMessage>{errors.departamento.message}</ErrorMessage>}
                </div>

                {/* Provincia */}
                <div>
                    <label className="text-xs font-bold">Provincia <span className="text-red-500">*</span></label>
                    <Select onValueChange={(val) => setValue('provincia', val)} disabled={!provincias.length}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="--Seleccione--" />
                        </SelectTrigger>
                        <SelectContent>
                            {provincias.map(p => (
                                <SelectItem key={p} value={p}>{p}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.provincia && <ErrorMessage>{errors.provincia.message}</ErrorMessage>}
                </div>

                {/* Distrito */}
                <div>
                    <label className="text-xs font-bold">Distrito <span className="text-red-500">*</span></label>
                    <Select onValueChange={(val) => setValue('distrito', val)} disabled={!distritos.length}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="--Seleccione--" />
                        </SelectTrigger>
                        <SelectContent>
                            {distritos.map(d => (
                                <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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
            <button
                type="submit"
                className="w-full py-3 text-white bg-gray-900 rounded-lg disabled:opacity-50 cursor-pointer"
            >
                Ir a pagar
            </button>
        </form>
    )
}
