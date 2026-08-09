// File: frontend/app/(checkout)/checkout/page.tsx
import { getSession } from '@/src/auth/dal'
import CheckoutForm from '@/components/checkout-v2/form/CheckoutForm'
import type { CustomerProfile } from '@/src/schemas/order.schema'

export default async function CheckoutStepOnePage() {
    const session = await getSession()

    let defaultProfile: Partial<CustomerProfile> | undefined
    let lockedEmail: string | undefined

    if (session?.user) {
        const { nombre, apellidos, telefono, tipoDocumento, numeroDocumento, email } = session.user
        defaultProfile = {
            nombre: nombre ?? '',
            apellidos: apellidos ?? '',
            telefono: telefono ?? '',
            tipoDocumento: tipoDocumento ?? undefined,
            numeroDocumento: numeroDocumento ?? '',
        }
        lockedEmail = email
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-base font-semibold text-foreground tracking-tight">
                    Datos de entrega
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                    Ingresa la dirección donde recibirás tu pedido.
                </p>
            </div>
            <CheckoutForm defaultProfile={defaultProfile} lockedEmail={lockedEmail} />
        </div>
    )
}