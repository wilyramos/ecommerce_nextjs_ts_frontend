'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { FiUser, FiMapPin } from 'react-icons/fi'

import { useCartStore } from '@/src/store/cartStore'
// import { useCheckoutStoreV2 } from '@/src/store/checkoutStoreV2'
import { CustomerProfileSchema, ShippingAddressSchema } from '@/src/schemas/order.schema'

import CustomerProfileSection from './CustomerProfileSection'
import ShippingAddressSection from './ShippingAddressSection'
import { Button } from '@/components/ui/button'

// ── Schema unificado del formulario ───────────────────────────────────────────

const checkoutFormSchema = z.object({
    customerProfile: CustomerProfileSchema,
    shippingAddress: ShippingAddressSchema.extend({
        referencia: z.string().trim().min(1, 'La referencia es obligatoria'),
    }),
    notes: z.string().max(300).optional(),
})

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>

// ── Resolver Personalizado Nativo (Reemplazo de zodResolver) ──────────────────

const customZodResolver = (schema: typeof checkoutFormSchema) => async (values: CheckoutFormValues) => {
    const result = await schema.safeParseAsync(values)

    if (result.success) {
        return { values: result.data, errors: {} }
    }

    // Mapear los errores estructurados de Zod al formato plano de React Hook Form
    const errors = result.error.errors.reduce((acc, currentError) => {
        const path = currentError.path.join('.')
        acc[path] = {
            type: currentError.code,
            message: currentError.message
        }
        return acc
    }, {} as Record<string, { type: string; message: string }>)

    return { values: {}, errors }
}

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = {
    defaultProfile?: Partial<CheckoutFormValues['customerProfile']>
    lockedEmail?: string
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function CheckoutForm({ defaultProfile, lockedEmail }: Props) {
    const [loading, setLoading] = useState(false)

    const { cart } = useCartStore()
    // const { setOrder, setCustomerProfile, setShippingAddress } = useCheckoutStoreV2()


    const form = useForm<CheckoutFormValues>({
        resolver: customZodResolver(checkoutFormSchema), // Inyección del resolver nativo personalizado
        mode: 'onChange',
        defaultValues: {
            customerProfile: {
                nombre: defaultProfile?.nombre ?? '',
                apellidos: defaultProfile?.apellidos ?? '',
                email: defaultProfile?.email ?? lockedEmail ?? '',
                telefono: defaultProfile?.telefono ?? '',
                tipoDocumento: defaultProfile?.tipoDocumento ?? undefined,
                numeroDocumento: defaultProfile?.numeroDocumento ?? '',
            },
            shippingAddress: {
                departamento: '',
                provincia: '',
                distrito: '',
                direccion: '',
                numero: '',
                pisoDpto: '',
                referencia: '',
            },
            notes: '',
        },
    })

    const { handleSubmit, formState: { isValid } } = form

    const onSubmit = async (data: CheckoutFormValues) => {
        if (cart.length === 0) {
            toast.error('Tu carrito está vacío.')
            return
        }

        console.log('Datos del formulario validados:', data)

        setLoading(true)

        // setCustomerProfile(data.customerProfile)
        // setShippingAddress(data.shippingAddress)

        // const payload = {
        //     customerProfile: {
        //         ...data.customerProfile,
        //         email: lockedEmail ?? data.customerProfile.email,
        //     },
        //     items: cart.map(item => ({
        //         productId: item._id,
        //         variantId: item.variant?._id,
        //         quantity:  item.cantidad,
        //     })),
        //     shippingAddress: data.shippingAddress,
        //     notes: data.notes,
        //     currency: 'PEN',
        // }


    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            {/* ── Sección 1: Datos personales ── */}
            <section className="bg-card border border-border rounded-[var(--radius-lg)] p-6 md:p-8">
                <header className="flex items-center gap-3 mb-6 pb-5 border-b border-border">
                    <div className="w-8 h-8 rounded-full bg-background-secondary border border-border flex items-center justify-center text-foreground shrink-0">
                        <FiUser size={15} strokeWidth={2} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                            Paso 01
                        </p>
                        <h2 className="text-base font-semibold text-foreground leading-tight">
                            Información personal
                        </h2>
                    </div>
                </header>

                <CustomerProfileSection
                    form={form}
                    disabled={loading}
                    lockedEmail={lockedEmail}
                />
            </section>

            {/* ── Sección 2: Dirección de envío ── */}
            <section className="bg-card border border-border rounded-[var(--radius-lg)] p-6 md:p-8">
                <header className="flex items-center gap-3 mb-6 pb-5 border-b border-border">
                    <div className="w-8 h-8 rounded-full bg-background-secondary border border-border flex items-center justify-center text-foreground shrink-0">
                        <FiMapPin size={15} strokeWidth={2} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                            Paso 01 — continuación
                        </p>
                        <h2 className="text-base font-semibold text-foreground leading-tight">
                            Dirección de envío
                        </h2>
                    </div>
                </header>

                <ShippingAddressSection form={form} disabled={loading} />
            </section>

            {/* ── Submit ── */}
            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={loading || !isValid || cart.length === 0}
                    className="w-full md:w-auto bg-action-cta hover:bg-action-cta-hover text-action-cta-foreground font-bold px-10 py-3 rounded-[var(--radius-sm)] text-sm"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Procesando...
                        </span>
                    ) : (
                        'Continuar al pago →'
                    )}
                </Button>
            </div>
        </form>
    )
}