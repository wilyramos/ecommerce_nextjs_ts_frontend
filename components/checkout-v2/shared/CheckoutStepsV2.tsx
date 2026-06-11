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
        <nav aria-label="Progreso del checkout" className="flex items-center select-none">
            {STEPS.map((step, index) => {
                const isActive = index === activeIndex
                const isDone   = index < activeIndex

                const content = (
                    <div className={cn(
                        'flex items-center gap-1.5 text-[11px] font-semibold transition-colors duration-200',
                        isActive && 'text-foreground',
                        isDone   && 'text-muted-foreground transition-colors',
                        !isActive && !isDone && 'text-muted-foreground/30 pointer-events-none'
                    )}>
                        <span className={cn(
                            'w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 border transition-all duration-200',
                            isActive && 'bg-foreground border-foreground text-background text-[9px] font-bold',
                            isDone   && 'bg-action-cta border-action-cta group-hover:opacity-90',
                            !isActive && !isDone && 'border-border'
                        )}>
                            {isDone ? (
                                <svg width="7" height="6" viewBox="0 0 7 6" fill="none" aria-hidden>
                                    <path d="M1 3L2.8 5L6 1" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            ) : (
                                <span className={cn(
                                    'text-[9px] font-bold leading-none',
                                    isActive ? 'text-background' : 'text-muted-foreground/30'
                                )}>
                                    {index + 1}
                                </span>
                            )}
                        </span>

                        <span className={cn(isActive ? 'inline' : 'hidden sm:inline')}>
                            {step.label}
                        </span>
                    </div>
                )

                return (
                    <div key={step.path} className="flex items-center">
                        {isDone ? (
                            <Link 
                                href={step.path} 
                                className="group rounded outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer hover:text-foreground transition-colors"
                            >
                                {content}
                            </Link>
                        ) : (
                            content
                        )}

                        {index < STEPS.length - 1 && (
                            <div className="mx-2.5 flex items-center gap-0.5" aria-hidden>
                                <div className={cn('w-4 h-px rounded-full transition-colors duration-300', isDone ? 'bg-action-cta' : 'bg-border')} />
                                <div className={cn('w-1.5 h-px rounded-full transition-colors duration-300 opacity-40', isDone ? 'bg-action-cta' : 'bg-border')} />
                            </div>
                        )}
                    </div>
                )
            })}
        </nav>
    )
}