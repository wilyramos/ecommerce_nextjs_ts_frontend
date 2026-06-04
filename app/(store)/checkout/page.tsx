// File: frontend/app/(store)/checkout-v2/page.tsx

import { getSession } from '@/src/auth/dal'
import CheckoutForm   from '@/components/checkout-v2/form/CheckoutForm'
import type { CustomerProfile } from '@/src/schemas/order.schema'

export default async function CheckoutStepOnePage() {
    // getSession() usa el DAL: lee la cookie, valida con UserSchema, retorna null si no hay sesión
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
        <div className="space-y-2">
            <div className="space-y-1">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                    Datos de entrega
                </h1>
                <p className="text-sm text-muted-foreground">
                    Ingresa tus datos personales y la ubicación para tu despacho.
                </p>
            </div>

            <CheckoutForm
                defaultProfile={defaultProfile}
                lockedEmail={lockedEmail}
            />
        </div>
    )
}