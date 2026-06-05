// File: frontend/app/(store)/checkout-v2/layout.tsx

import { ReactNode } from 'react'
import OrderSummary from '@/components/checkout-v2/summary/OrderSummary'
import CheckoutStepsV2 from '@/components/checkout-v2/shared/CheckoutStepsV2'

type Props = {
    children: ReactNode
}

export default function CheckoutLayoutV2({ children }: Props) {
    return (
        <div className="min-h-screen bg-background-secondary p-2">
            <div className="mx-auto max-w-7xl">
                
                {/* Cabecera central con los pasos */}
                <header className="mb-5 flex justify-center">
                    <CheckoutStepsV2 />
                </header>
                
                {/* Estructura dividida de Checkout */}
                <div className="grid grid-cols-1 gap-x-12 lg:grid-cols-12">
                    
                    {/* Contenido principal dinámico (Paso 1 o Paso 2) */}
                    <main className="lg:col-span-7">
                        <div className="bg-card p-4">
                            {children}
                        </div>
                    </main>

                    {/* Resumen lateral estático y persistente */}
                    <aside className="lg:col-span-5 lg:sticky lg:top-24 h-fit">
                        <div className="bg-card p-4">
                            <OrderSummary />
                        </div>
                    </aside>
                    
                </div>
            </div>
        </div>
    )
}