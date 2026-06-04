// File: frontend/components/checkout-v2/shared/CheckoutStepsV2.tsx
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { FiUser, FiCreditCard } from 'react-icons/fi'
import { cn } from '@/lib/utils'

const STEPS = [
    { label: 'Datos y envío', path: '/checkout', icon: FiUser },
    { label: 'Pago', path: '/checkout/payment', icon: FiCreditCard },
]

export default function CheckoutStepsV2() {
    const pathname = usePathname()

    const currentIndex = STEPS.findIndex(s => s.path === pathname)
    const activeIndex = currentIndex === -1 ? 0 : currentIndex

    return (
        <nav aria-label="Pasos del checkout" className="flex items-center gap-1 w-fit select-none">
            {STEPS.map((step, index) => {
                const isActive = index === activeIndex
                const isDone = index < activeIndex

                const stepContent = (
                    <div className={cn(
                        'flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300',
                        isActive
                            ? 'bg-action-cta text-action-cta-foreground shadow-md'
                            : isDone
                                ? 'bg-background-secondary text-foreground hover:bg-muted/50 cursor-pointer'
                                : 'bg-transparent text-muted-foreground/40 cursor-default'
                    )}>
                        <div className={cn(
                            'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 transition-all duration-300 border-2',
                            isActive
                                ? 'bg-background/20 border-white/20 text-white'
                                : isDone
                                    ? 'bg-action-cta border-action-cta text-white'
                                    : 'bg-transparent border-muted-foreground/20 text-muted-foreground/40'
                        )}>
                            {isDone ? '✓' : index + 1}
                        </div>
                        <span className="inline text-[9px] md:text-xs">{step.label}</span>
                    </div>
                )

                return (
                    <div key={step.path} className="flex items-center gap-1">
                        {isDone ? (
                            <Link
                                href={step.path}
                                className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                {stepContent}
                            </Link>
                        ) : (
                            stepContent
                        )}

                        {/* Separador */}
                        {index < STEPS.length - 1 && (
                            <div className={cn(
                                'w-8 h-[2px] transition-colors duration-300 rounded-full mx-1',
                                isDone ? 'bg-action-cta' : 'bg-border'
                            )} />
                        )}
                    </div>
                )
            })}
        </nav>
    )
}