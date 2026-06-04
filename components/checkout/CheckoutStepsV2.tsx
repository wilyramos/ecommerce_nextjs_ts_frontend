// File: frontend/components/checkout-v2/shared/CheckoutStepsV2.tsx

'use client'

import { usePathname } from 'next/navigation'
import { FiUser, FiCreditCard } from 'react-icons/fi'
import { cn } from '@/lib/utils'

const STEPS = [
    { label: 'Datos y envío', path: '/checkout',          icon: FiUser       },
    { label: 'Pago',          path: '/checkout/payment',  icon: FiCreditCard },
]

export default function CheckoutStepsV2() {
    const pathname = usePathname()

    const currentIndex = STEPS.findIndex(s => s.path === pathname)
    const activeIndex  = currentIndex === -1 ? 0 : currentIndex

    return (
        <nav aria-label="Pasos del checkout" className="flex items-center gap-2">
            {STEPS.map((step, index) => {
                const Icon      = step.icon
                const isActive  = index === activeIndex
                const isDone    = index < activeIndex

                return (
                    <div key={step.path} className="flex items-center gap-2">
                        {/* Step pill */}
                        <div className={cn(
                            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors',
                            isActive && 'bg-foreground text-background',
                            isDone  && 'bg-muted text-muted-foreground',
                            !isActive && !isDone && 'bg-muted text-muted-foreground opacity-50'
                        )}>
                            <div className={cn(
                                'w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                                isActive && 'bg-background text-foreground',
                                isDone  && 'bg-muted-foreground text-background',
                                !isActive && !isDone && 'bg-muted-foreground/30 text-muted-foreground'
                            )}>
                                {isDone ? '✓' : index + 1}
                            </div>
                            <Icon size={14} strokeWidth={2} />
                            <span className="hidden sm:inline">{step.label}</span>
                        </div>

                        {/* Separator */}
                        {index < STEPS.length - 1 && (
                            <div className={cn(
                                'w-8 h-px transition-colors',
                                isDone ? 'bg-foreground' : 'bg-border'
                            )} />
                        )}
                    </div>
                )
            })}
        </nav>
    )
}