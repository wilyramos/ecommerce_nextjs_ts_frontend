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
import { toast } from 'sonner'

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
        setLoading(true);
        setShipping(data);

        const subtotal = cart.reduce((t, i) => t + i.precio * i.cantidad, 0);
        const shippingCost = 0;
        const totalPrice = subtotal + shippingCost;

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
        };

        const result = await createOrderAction(payload);

        if (!result.ok) {
            toast.error(result.message);
            setLoading(false);
            return;
        }

        // Orden creada correctamente
        localStorage.setItem("currentOrderId", result.order._id);
        router.push(`/checkout/payment?orderId=${result.order._id}`);
        setLoading(false);
    };

    // --- CLASES DE ESTILO REUTILIZABLES ---
    const labelClass = "block text-xs font-medium text-[var(--store-text-muted)] mb-1.5 uppercase tracking-wide";
    const inputClass = "w-full px-4 py-2.5 bg-transparent border border-[var(--store-border)] rounded-lg text-[var(--store-text)] text-sm focus:outline-none focus:border-[var(--store-text-muted)] focus:ring-1 focus:ring-[var(--store-text-muted)] transition-all placeholder:text-gray-300";
    const selectTriggerClass = "w-full px-4 py-2.5 bg-transparent border border-[var(--store-border)] rounded-lg text-[var(--store-text)] text-sm focus:ring-1 focus:ring-[var(--store-text-muted)] data-[placeholder]:text-gray-300";


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* UBIGEO: Departamento / Provincia / Distrito */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                    <label className={labelClass}>Departamento <span className="text-red-500">*</span></label>
                    <Select
                        value={selectedDepartamento || ""}
                        onValueChange={(val) => {
                            setValue('departamento', val)
                            setValue('provincia', '')
                            setValue('distrito', '')
                            trigger(['departamento', 'provincia', 'distrito'])
                        }}
                    >
                        <SelectTrigger className={selectTriggerClass}>
                            <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--store-surface)] border-[var(--store-border)] text-[var(--store-text)]">
                            {Object.keys(locations).map(dep => (
                                <SelectItem key={dep} value={dep} className="hover:bg-[var(--store-bg)] cursor-pointer focus:bg-[var(--store-bg)]">
                                    {dep}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <input type="hidden" {...register('departamento', { required: 'Requerido' })} />
                    {errors.departamento && <ErrorMessage>{errors.departamento.message}</ErrorMessage>}
                </div>

                <div>
                    <label className={labelClass}>Provincia <span className="text-red-500">*</span></label>
                    <Select
                        value={selectedProvincia || ""}
                        onValueChange={(val) => {
                            setValue('provincia', val)
                            setValue('distrito', '')
                            trigger(['provincia', 'distrito'])
                        }}
                        disabled={!provincias.length}
                    >
                        <SelectTrigger className={`${selectTriggerClass} disabled:opacity-50 disabled:bg-[var(--store-bg)]`}>
                            <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--store-surface)] border-[var(--store-border)] text-[var(--store-text)]">
                            {provincias.map(p => (
                                <SelectItem key={p} value={p} className="hover:bg-[var(--store-bg)] cursor-pointer focus:bg-[var(--store-bg)]">
                                    {p}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <input type="hidden" {...register('provincia', { required: 'Requerido' })} />
                    {errors.provincia && <ErrorMessage>{errors.provincia.message}</ErrorMessage>}
                </div>

                <div>
                    <label className={labelClass}>Distrito <span className="text-red-500">*</span></label>
                    <Select
                        value={watch('distrito') || ""}
                        onValueChange={(val) => {
                            setValue('distrito', val)
                            trigger('distrito')
                        }}
                        disabled={!distritos.length}
                    >
                        <SelectTrigger className={`${selectTriggerClass} disabled:opacity-50 disabled:bg-[var(--store-bg)]`}>
                            <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--store-surface)] border-[var(--store-border)] text-[var(--store-text)]">
                            {distritos.map(d => (
                                <SelectItem key={d} value={d} className="hover:bg-[var(--store-bg)] cursor-pointer focus:bg-[var(--store-bg)]">
                                    {d}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <input type="hidden" {...register('distrito', { required: 'Requerido' })} />
                    {errors.distrito && <ErrorMessage>{errors.distrito.message}</ErrorMessage>}
                </div>
            </div>

            {/* DIRECCIÓN */}
            <div>
                <label className={labelClass}>Dirección <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    {...register('direccion', { required: 'La dirección es obligatoria' })}
                    placeholder="Av. Principal 123"
                    className={inputClass}
                />
                {errors.direccion && <ErrorMessage>{errors.direccion.message}</ErrorMessage>}
            </div>

            {/* NÚMERO Y PISO */}
            <div className="grid grid-cols-2 gap-5">
                <div>
                    <label className={labelClass}>Número</label>
                    <input
                        type="text"
                        {...register('numero')}
                        placeholder="N°"
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className={labelClass}>Piso / Dpto</label>
                    <input
                        type="text"
                        {...register('pisoDpto')}
                        placeholder="Opcional"
                        className={inputClass}
                    />
                </div>
            </div>

            {/* REFERENCIA */}
            <div>
                <label className={labelClass}>Referencia <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    {...register('referencia', { required: 'La referencia es obligatoria' })}
                    placeholder="Ej. Frente al parque, casa color verde..."
                    className={inputClass}
                />
                {errors.referencia && <ErrorMessage>{errors.referencia.message}</ErrorMessage>}
            </div>

            {/* BOTÓN */}
            <div className="pt-4">
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 text-base font-medium shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                    {loading ? 'Procesando orden...' : 'Confirmar y Pagar'}
                </Button>
            </div>
        </form>
    )
}