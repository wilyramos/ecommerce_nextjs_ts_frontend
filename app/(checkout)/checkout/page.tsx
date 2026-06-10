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
            nombre:          nombre          ?? '',
            apellidos:       apellidos       ?? '',
            telefono:        telefono        ?? '',
            tipoDocumento:   tipoDocumento   ?? undefined,
            numeroDocumento: numeroDocumento ?? '',
        }
        lockedEmail = email
    }

    return (
        <div className="space-y-6">
            <div className="border-b border-border pb-5">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                    Datos de entrega
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                    Completa tu información para continuar.
                </p>
            </div>
            <CheckoutForm defaultProfile={defaultProfile} lockedEmail={lockedEmail} />
        </div>
    )
}