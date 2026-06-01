// File: frontend/components/checkout-v2/payment/PaymentSection.tsx

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCheckoutStoreV2 } from '@/src/store/checkoutStoreV2'
import { useCartStore } from '@/src/store/cartStore'
import { FiMapPin, FiUser } from 'react-icons/fi'
// import IzipayButton from './IzipayButton'
// import MercadoPagoButton from './MercadoPagoButton'
// import CulqiButton from './CulqiButton'

type Props = {
    orderId: string
}

export default function PaymentSection({ orderId }: Props) {
    const router = useRouter()
    const { customerProfile, shippingAddress, orderId: storedOrderId } = useCheckoutStoreV2()
    const { total } = useCartStore()

    // Guard: si no hay orden en el store o no coincide, redirigir al paso 1
    useEffect(() => {
        if (!storedOrderId || storedOrderId !== orderId) {
            router.replace('/checkout-v2')
        }
    }, [storedOrderId, orderId, router])

    if (!customerProfile || !shippingAddress) return null

    const shippingCost = 0
    const totalFinal   = total + shippingCost

    return (
        <div className="space-y-6">

            {/* ── Resumen de datos confirmados ── */}
            <section className="bg-card border border-border rounded-[var(--radius-lg)] p-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
                    Confirmación de datos
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    {/* Perfil */}
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-background-secondary border border-border flex items-center justify-center shrink-0 mt-0.5">
                            <FiUser size={14} strokeWidth={2} />
                        </div>
                        <div className="space-y-0.5">
                            <p className="font-semibold text-foreground">
                                {customerProfile.nombre} {customerProfile.apellidos}
                            </p>
                            <p className="text-muted-foreground">{customerProfile.email}</p>
                            <p className="text-muted-foreground">{customerProfile.telefono}</p>
                        </div>
                    </div>

                    {/* Dirección */}
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-background-secondary border border-border flex items-center justify-center shrink-0 mt-0.5">
                            <FiMapPin size={14} strokeWidth={2} />
                        </div>
                        <div className="space-y-0.5">
                            <p className="font-semibold text-foreground">
                                {shippingAddress.direccion}
                                {shippingAddress.numero && ` ${shippingAddress.numero}`}
                            </p>
                            <p className="text-muted-foreground">
                                {shippingAddress.distrito}, {shippingAddress.provincia}
                            </p>
                            <p className="text-muted-foreground">{shippingAddress.departamento}</p>
                            {shippingAddress.referencia && (
                                <p className="text-muted-foreground text-xs">
                                    Ref: {shippingAddress.referencia}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Total a pagar ── */}
            <section className="bg-card border border-border rounded-[var(--radius-lg)] p-6">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-muted-foreground">Total a pagar</p>
                        <p className="text-2xl font-bold text-foreground">
                            S/ {totalFinal.toFixed(2)}
                        </p>
                    </div>
                    <p className="text-xs text-muted-foreground text-right">
                        🔒 Transacción segura<br />SSL encriptado
                    </p>
                </div>
            </section>

            {/* ── Métodos de pago ── */}
            <section className="bg-card border border-border rounded-[var(--radius-lg)] p-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-5">
                    Elige tu método de pago
                </h2>

                <div className="space-y-3">
                    {/* <IzipayButton       orderId={orderId} totalPrice={totalFinal} /> */}
                    {/* <MercadoPagoButton  orderId={orderId} totalPrice={totalFinal} /> */}
                    {/* <CulqiButton        orderId={orderId} totalPrice={totalFinal} /> */}
                </div>
            </section>

        </div>
    )
}