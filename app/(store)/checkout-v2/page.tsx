import { cookies } from 'next/headers'
import CheckoutForm from '@/components/checkout-v2/form/CheckoutForm'

async function getAuthenticatedUserProfile(token: string) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            cache: 'no-store'
        })

        if (!response.ok) return null
        const json = await response.json()
        return json.data 
    } catch (error) {
        console.error('❌ Error precargando perfil en checkout v2:', error)
        return null
    }
}

export default async function StepOnePage() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    let defaultProfile = undefined
    let lockedEmail = undefined

    if (token) {
        const profile = await getAuthenticatedUserProfile(token)
        if (profile) {
            defaultProfile = {
                nombre: profile.nombre,
                apellidos: profile.apellidos,
                telefono: profile.telefono,
                tipoDocumento: profile.tipoDocumento,
                numeroDocumento: profile.numeroDocumento,
            }
            lockedEmail = profile.email 
        }
    }

    return (
        <div className="space-y-6">
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