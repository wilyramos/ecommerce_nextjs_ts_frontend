// File: frontend/app/(checkout)/layout.tsx
"use client"

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from '@/components/ui/Logo'
import OrderSummary from '@/components/checkout-v2/summary/OrderSummary'
import CheckoutStepsV2 from '@/components/checkout-v2/shared/CheckoutStepsV2'
import { FiArrowLeft, FiShoppingCart } from 'react-icons/fi'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'

export default function CheckoutLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname()

    const isPaymentPage = pathname.includes('/pago') || pathname.includes('/payment')
    const backHref = isPaymentPage ? '/checkout' : '/carrito'

    return (
        <div className="min-h-screen flex flex-col bg-background antialiased font-sans text-foreground">
            {/* Header minimalista estilo Shopify */}
            <header className="bg-background border-b border-border sticky top-0 z-40 shrink-0">
                <div className="h-14 px-4 sm:px-8 grid grid-cols-[auto_1fr_auto] items-center max-w-6xl w-full mx-auto gap-4">
                    <Link
                        href={backHref}
                        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors p-1"
                    >
                        <FiArrowLeft size={14} />
                        <span className="hidden sm:inline">Volver</span>
                    </Link>

                    <div className="flex justify-center min-w-0">
                        <CheckoutStepsV2 />
                    </div>

                    <Link href="/" className="shrink-0 p-1">
                        <Logo color="black" />
                    </Link>
                </div>

                {/* Acordeón Móvil de Resumen */}
                <div className="lg:hidden border-t border-border bg-background-secondary">
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="summary" className="border-b-0">
                            <AccordionTrigger className="px-4 py-3 text-xs font-medium text-foreground hover:no-underline">
                                <div className="flex items-center gap-2">
                                    <FiShoppingCart size={15} className="text-muted-foreground" />
                                    <span>Mostrar resumen del pedido</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-6 pt-2 border-t border-border bg-background-secondary">
                                <OrderSummary />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </header>

            {/* Split Screen Estilo Shopify */}
            <div className="relative flex-1 flex flex-col lg:flex-row">
                {/* Fondo secundario para la columna derecha en Desktop */}
                <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/2 bg-background-secondary border-l border-border pointer-events-none z-0" />

                <div className="relative w-full max-w-6xl mx-auto flex flex-col lg:flex-row flex-1 z-10">
                    {/* Formulario Principal (Izquierda) */}
                    <main className="w-full lg:w-1/2 bg-background px-4 sm:px-8 lg:px-0 lg:pr-12 py-8 sm:py-12">
                        <div className="w-full max-w-lg mx-auto lg:mx-0">
                            {children}
                        </div>
                    </main>

                    {/* Resumen de Pedido (Derecha - Desktop) */}
                    <aside className="hidden lg:flex w-full lg:w-1/2 shrink-0 bg-transparent lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:overflow-y-auto pl-12 py-12">
                        <div className="w-full max-w-md">
                            <OrderSummary />
                        </div>
                    </aside>
                </div>
            </div>

            <footer className="bg-background border-t border-border py-4 shrink-0 z-10">
                <p className="text-center text-[11px] text-muted-foreground select-none">
                    © {new Date().getFullYear()} GoPhone · Todos los derechos reservados
                </p>
            </footer>
        </div>
    )
}