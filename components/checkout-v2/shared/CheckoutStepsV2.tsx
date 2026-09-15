// File: frontend/components/checkout-v2/shared/CheckoutStepsV2.tsx

'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const STEPS = [
    { label: 'Datos y envío', path: '/checkout' },
    { label: 'Pago',          path: '/checkout/payment' },
]

export default function CheckoutStepsV2() {
    const pathname = usePathname()
    const activeIndex = Math.max(STEPS.findIndex(s => s.path === pathname), 0)

    return (
        <nav aria-label="Progreso del checkout" className="flex items-center select-none min-w-0">
            {STEPS.map((step, index) => {
                const isActive = index === activeIndex
                const isDone   = index < activeIndex

                const content = (
                    <div className={cn(
                        'flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-semibold transition-colors duration-normal min-w-0',
                        isActive && 'text-text-primary',
                        isDone   && 'text-text-secondary transition-colors hover:text-text-primary',
                        !isActive && !isDone && 'text-text-disabled pointer-events-none'
                    )}>
                        <span className={cn(
                            'w-4 h-4 sm:w-[18px] sm:h-[18px] rounded-radius-full flex items-center justify-center shrink-0 border transition-all duration-normal',
                            isActive && 'bg-brand-primary border-brand-primary text-text-inverse text-[8px] sm:text-[9px] font-bold',
                            isDone   && 'bg-brand-accent border-brand-accent text-text-inverse group-hover:opacity-90',
                            !isActive && !isDone && 'border-border-primary text-text-disabled bg-surface-secondary'
                        )}>
                            {isDone ? (
                                <svg width="6" height="5" viewBox="0 0 7 6" fill="none" aria-hidden className="sm:w-[7px] sm:h-[6px]">
                                    <path d="M1 3L2.8 5L6 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            ) : (
                                <span className={cn(
                                    'text-[8px] sm:text-[9px] font-bold leading-none',
                                    isActive ? 'text-text-inverse' : 'text-text-disabled'
                                )}>
                                    {index + 1}
                                </span>
                            )}
                        </span>

                        <span className={cn(
                            'truncate max-w-[88px] sm:max-w-none',
                            isActive ? 'inline' : 'hidden sm:inline'
                        )}>
                            {step.label}
                        </span>
                    </div>
                )

                return (
                    <div key={step.path} className="flex items-center min-w-0">
                        {isDone ? (
                            <Link 
                                href={step.path} 
                                className="group rounded-radius-sm outline-none focus-visible:ring-2 focus-visible:ring-brand-accent cursor-pointer transition-colors duration-fast min-w-0"
                            >
                                {content}
                            </Link>
                        ) : (
                            content
                        )}

                        {index < STEPS.length - 1 && (
                            <div className="mx-1.5 sm:mx-2.5 flex items-center gap-0.5 shrink-0" aria-hidden>
                                <div className={cn('w-2.5 sm:w-4 h-px rounded-radius-full transition-colors duration-slow', isDone ? 'bg-brand-accent' : 'bg-border-primary')} />
                                <div className={cn('w-1 sm:w-1.5 h-px rounded-radius-full transition-colors duration-slow opacity-60', isDone ? 'bg-brand-accent' : 'bg-border-primary')} />
                            </div>
                        )}
                    </div>
                )
            })}
        </nav>
    )
}