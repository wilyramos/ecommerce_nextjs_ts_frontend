// File: frontend/components/checkout-v2/form/CheckoutForm.tsx
'use client'

import { useActionState, useState, useCallback, useEffect, useRef, startTransition } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

import { useCartStore } from '@/src/store/cartStore'
import { useCheckoutStoreV2 } from '@/src/store/checkoutStoreV2'
import { createOrderAction } from '@/actions/order-actions'
import {
    CreateOrderDTOSchema,
    type CustomerProfile,
    type ShippingAddress,
    type TipoDocumento,
} from '@/src/schemas/order.schema'
import { Button } from '@/components/ui/button'

import CustomerProfileSection from './CustomerProfileSection'
import ShippingAddressSection from './ShippingAddressSection'

type Props = {
    defaultProfile?: Partial<CustomerProfile>
    lockedEmail?: string
}

function buildInitialProfile(
    stored?: CustomerProfile | null,
    defaultProfile?: Partial<CustomerProfile>,
    lockedEmail?: string
): CustomerProfile {
    return stored ?? {
        nombre: defaultProfile?.nombre ?? '',
        apellidos: defaultProfile?.apellidos ?? '',
        email: lockedEmail ?? defaultProfile?.email ?? '',
        telefono: defaultProfile?.telefono ?? '',
        tipoDocumento: defaultProfile?.tipoDocumento ?? undefined,
        numeroDocumento: defaultProfile?.numeroDocumento ?? '',
    }
}

const EMPTY_ADDRESS: ShippingAddress = {
    departamento: '',
    provincia: '',
    distrito: '',
    direccion: '',
    numero: '',
    pisoDpto: '',
    referencia: '',
}

export default function CheckoutForm({ defaultProfile, lockedEmail }: Props) {
    const { cart } = useCartStore()

    const {
        customerProfile: storedProfile,
        shippingAddress: storedAddress,
        notes: storedNotes,
        setCustomerProfile,
        setShippingAddress,
        setNotes: storeSetNotes,
    } = useCheckoutStoreV2()

    const [profile, setProfile] = useState<CustomerProfile>(() =>
        buildInitialProfile(storedProfile, defaultProfile, lockedEmail)
    )
    const [address, setAddress] = useState<ShippingAddress>(
        storedAddress ?? EMPTY_ADDRESS
    )
    const [notes, setNotes] = useState(storedNotes)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    const pendingProfile = useRef<CustomerProfile | null>(null)
    const pendingAddress = useRef<ShippingAddress | null>(null)

    useEffect(() => {
        if (pendingProfile.current) {
            setCustomerProfile(pendingProfile.current)
            pendingProfile.current = null
        }
    })

    useEffect(() => {
        if (pendingAddress.current) {
            setShippingAddress(pendingAddress.current)
            pendingAddress.current = null
        }
    })

    useEffect(() => {
        if (lockedEmail) {
            setProfile(prev => ({ ...prev, email: lockedEmail }))
        }
    }, [lockedEmail])

    const [state, formAction, isPending] = useActionState(createOrderAction, undefined)

    const handleProfileChange = useCallback(
        (field: keyof CustomerProfile, value: string | TipoDocumento | undefined) => {
            setProfile(prev => {
                const next = { ...prev, [field]: value }
                pendingProfile.current = next
                return next
            })
            setFieldErrors(prev => {
                const next = { ...prev }
                delete next[`customerProfile.${field}`]
                return next
            })
        },
        []
    )

    const handleAddressChange = useCallback(
        (field: keyof ShippingAddress, value: string) => {
            setAddress(prev => {
                const next = { ...prev, [field]: value }
                pendingAddress.current = next
                return next
            })
            setFieldErrors(prev => {
                const next = { ...prev }
                delete next[`shippingAddress.${field}`]
                return next
            })
        },
        []
    )

    const handleNotesChange = useCallback(
        (value: string) => {
            setNotes(value)
            storeSetNotes(value)
        },
        [storeSetNotes]
    )

    function validate(): boolean {
        const result = CreateOrderDTOSchema.safeParse({
            customerProfile: { ...profile, email: lockedEmail ?? profile.email },
            items: cart.map(item => ({
                productId: item._id,
                variantId: item.variant?._id,
                quantity: item.cantidad,
            })),
            shippingAddress: address,
            notes: notes || undefined,
            currency: 'PEN',
        })

        if (result.success) {
            setFieldErrors({})
            return true
        }

        const errors: Record<string, string> = {}
        for (const issue of result.error.errors) {
            const path = issue.path.join('.')
            if (!errors[path]) errors[path] = issue.message
        }
        setFieldErrors(errors)
        return false
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (cart.length === 0) {
            toast.error('Tu carrito está vacío.')
            return
        }

        if (!validate()) {
            toast.error('Revisa los campos marcados antes de continuar.')
            return
        }

        const fd = new FormData()
        fd.append('payload', JSON.stringify({
            customerProfile: { ...profile, email: lockedEmail ?? profile.email },
            items: cart.map(item => ({
                productId: item._id,
                variantId: item.variant?._id,
                quantity: item.cantidad,
            })),
            shippingAddress: address,
            notes: notes || undefined,
            currency: 'PEN',
        }))

        startTransition(() => {
            formAction(fd)
        })
    }

    const serverError = state?.ok === false ? state.error : undefined

    return (
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {serverError && (
                <div role="alert" className="rounded-[var(--radius-sm)] border border-destructive/20 bg-destructive/5 px-4 py-3 text-[11px] font-bold text-destructive ">
                    {serverError}
                </div>
            )}

            <section className="">
                <h2 className="text-[9px] font-black text-[var(--ring)] uppercase mb-5 ">
                    1. Información Personal
                </h2>
                <CustomerProfileSection
                    values={profile}
                    errors={fieldErrors}
                    disabled={isPending}
                    lockedEmail={lockedEmail}
                    onChange={handleProfileChange}
                />
            </section>

            <section className="">
                <h2 className="text-[9px] font-black text-[var(--ring)] uppercase mb-5 ">
                    2. Dirección de Envío
                </h2>
                <ShippingAddressSection
                    values={address}
                    errors={fieldErrors}
                    disabled={isPending}
                    notes={notes}
                    onChange={handleAddressChange}
                    onNotesChange={handleNotesChange}
                />
            </section>

            <Button
                type="submit"
                disabled={isPending || cart.length === 0}
                className="w-full bg-action-cta hover:bg-action-cta-hover text-action-cta-foreground font-bold  transition-all"
            >
                {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Procesando...
                    </span>
                ) : (
                    'Ir a pagar'
                )}
            </Button>
        </form>
    )
}