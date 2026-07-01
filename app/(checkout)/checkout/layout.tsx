//File: frontend/app/%28checkout%29/checkout/layout.tsx

"use client"

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from '@/components/ui/Logo'
import OrderSummary from '@/components/checkout-v2/summary/OrderSummary'
import CheckoutStepsV2 from '@/components/checkout-v2/shared/CheckoutStepsV2'
import { FiArrowLeft } from 'react-icons/fi'

export default function CheckoutLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname()

    // Lógica de retorno dinámico estilo Shopify
    // Si estás en /checkout/pago (o la ruta que uses para el pago), el botón regresa a /checkout
    const isPaymentPage = pathname.includes('/pago') || pathname.includes('/payment')
    const backHref = isPaymentPage ? '/checkout' : '/carrito'

    return (
        <div className="min-h-screen flex flex-col bg-background antialiased">

            {/* --- HEADER --- */}
            <header className="bg-background border-b border-border sticky top-0 z-30 shrink-0">
                <div className="h-14 px-4 sm:px-8 flex items-center justify-between max-w-screen-xl w-full mx-auto gap-4">

                    {/* Botón de retroceso dinámico a la izquierda */}
                    <div className="flex items-center flex-1 sm:flex-initial">
                        <Link
                            href={backHref}
                            className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring rounded p-1 shrink-0"
                        >
                            <FiArrowLeft size={13} strokeWidth={2.5} />
                            <span className="inline">Volver</span>
                        </Link>
                    </div>

                    {/* Pasos del Checkout en el centro */}
                    <div className="flex justify-center flex-shrink-0">
                        <CheckoutStepsV2 />
                    </div>

                    {/* Logo en el extremo derecho */}
                    <div className="flex items-center justify-end flex-1 sm:flex-initial">
                        <Link href="/" className="outline-none focus-visible:ring-2 focus-visible:ring-ring rounded shrink-0 p-1">
                            <Logo color="black" size={24} />
                        </Link>
                    </div>

                </div>
            </header>

            {/* --- CONTENEDOR SPLIT --- */}
            <div className="relative flex flex-col lg:flex-row flex-1 bg-background-secondary lg:bg-background">

                {/* Fondo gris absoluto lateral (Solo en escritorio) */}
                <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[50%] xl:w-[calc(50%-20px)] bg-background-secondary border-l border-border pointer-events-none z-0" />

                {/* Grid Responsivo Inteligente */}
                <div className="relative w-full max-w-6xl mx-auto flex flex-col lg:flex-row flex-1 z-10">

                    {/* COLUMNA: Resumen de Orden */}
                    <aside className="
                        w-full lg:w-[360px] xl:w-[400px] shrink-0
                        bg-background-secondary lg:bg-transparent
                        border-b border-border lg:border-b-0
                        order-1 lg:order-2
                        lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:overflow-y-auto
                        flex justify-start px-4 sm:px-8 lg:px-0 lg:pl-12
                    ">
                        <div className="w-full py-4 lg:py-14">
                            <OrderSummary />
                        </div>
                    </aside>

                    {/* COLUMNA: Formulario Dinámico (children) */}
                    <main className="flex-1 bg-background order-2 lg:order-1 flex justify-start px-4 sm:px-8 lg:px-0 lg:pr-12">
                        <div className="w-full max-w-xl py-8 mx-auto lg:mx-0">
                            {children}
                        </div>
                    </main>

                </div>
            </div>

            {/* --- FOOTER --- */}
            <footer className="bg-background border-t border-border py-4 shrink-0 z-10">
                <p className="text-center text-[11px] text-muted-foreground/40 select-none">
                    © {new Date().getFullYear()} GoPhone · Todos los derechos reservados
                </p>
            </footer>

        </div>
    )
}