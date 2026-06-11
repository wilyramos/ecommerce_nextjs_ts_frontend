'use client'

import { useActionState, useState, useCallback, useEffect, useRef, startTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'

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
    const router = useRouter()

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

    const handleRedirectToLogin = () => {
        router.push('/auth/login?redirect=/checkout')
    }

    const serverError = state?.ok === false ? state.error : undefined

    return (
        <form onSubmit={handleSubmit} className="space-y-7" noValidate>
            {serverError && (
                <div role="alert" className="rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3 text-[12px] font-medium text-destructive">
                    {serverError}
                </div>
            )}

            {/* Sección 1: Contacto con Acceso Estilo Shopify */}
            <section className="space-y-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h2 className="text-base font-semibold text-foreground tracking-tight">
                        Contacto
                    </h2>

                    {!lockedEmail && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span>¿Ya tienes una cuenta?</span>
                            <button
                                type="button"
                                onClick={handleRedirectToLogin}
                                className="text-foreground font-medium underline hover:text-foreground/80 transition-colors cursor-pointer hover:no-underline"
                            >
                                Iniciar sesión
                            </button>
                            <span className="text-muted-foreground/40 select-none">|</span>
                            <button
                                type="button"
                                onClick={handleRedirectToLogin}
                                className="flex items-center gap-1 text-foreground font-medium hover:opacity-80 transition-opacity cursor-pointer"
                                title="Iniciar sesión con Google"
                            >
                                <FcGoogle size={14} className="mt-[0.5px]" />
                                <span className="underline">Gmail</span>
                            </button>
                        </div>
                    )}
                </div>

                <CustomerProfileSection
                    values={profile}
                    errors={fieldErrors}
                    disabled={isPending}
                    lockedEmail={lockedEmail}
                    onChange={handleProfileChange}
                />
            </section>

            {/* Sección 2 */}
            <section className="space-y-4">
                <h2 className="text-base font-semibold text-foreground tracking-tight">
                    Entrega
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

            {/* Botón de Pago Principal e Información Legal */}
            <div className="space-y-3">
                <Button
                    type="submit"
                    disabled={isPending || cart.length === 0}
                    className="w-full h-12 bg-action-cta hover:bg-action-cta-hover text-action-cta-foreground text-sm font-semibold rounded-md transition-colors"
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

                <p className="text-[11px] text-center text-muted-foreground leading-normal px-2">
                    Al continuar con la compra, aceptas nuestros{' '}
                    <Link href="/terminos-y-condiciones" target="_blank" className="underline hover:text-foreground transition-colors">
                        términos y condiciones de venta
                    </Link>
                    .
                </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground border-t pt-4">
                <Link href="/politicas-de-privacidad" target="_blank" className="underline hover:text-foreground transition-colors">
                    Política de privacidad
                </Link>
                <Link href="/politicas-de-cambios-y-devoluciones" target="_blank" className="underline hover:text-foreground transition-colors">
                    Política de devoluciones
                </Link>
                <Link href="/hc/proceso-de-compra" target="_blank" className="underline hover:text-foreground transition-colors">
                    Envío
                </Link>

                <Link href="/hc/contacto-y-soporte" target="_blank" className="underline hover:text-foreground transition-colors">
                    Contacto y soporte
                </Link>
            </div>
        </form>
    )
}