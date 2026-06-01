import { ReactNode } from 'react'
// import CheckoutGuard from '@/components/checkout-v2/shared/CheckoutGuard'
import OrderSummary from '@/components/checkout-v2/summary/OrderSummary'
import CheckoutStepsV2 from '@/components/checkout-v2/shared/CheckoutStepsV2'

type Props = {
    children: ReactNode
}

export default function CheckoutLayoutV2({ children }: Props) {
    return (
        <>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                
                {/* Cabecera central con los pasos */}
                <header className="mb-10 flex justify-center">
                    <CheckoutStepsV2 />
                </header>
                
                {/* Estructura dividida de Checkout */}
                <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-12">
                    
                    {/* Contenido principal dinámico (Paso 1 o Paso 2) */}
                    <main className="lg:col-span-7">
                        {children}
                    </main>

                    {/* Resumen lateral estático y persistente */}
                    <aside className="lg:col-span-5 lg:sticky lg:top-24 h-fit">
                        <OrderSummary />
                    </aside>
                    
                </div>
            </div>
        </>
    )
}