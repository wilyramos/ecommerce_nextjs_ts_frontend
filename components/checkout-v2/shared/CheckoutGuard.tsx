//File: frontend/components/checkout-v2/shared/CheckoutGuard.tsx

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/src/store/cartStore'

export default function CheckoutGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const cart = useCartStore((state) => state.cart)
    const [isVerified, setIsVerified] = useState(false)

    useEffect(() => {
        if (!cart || cart.length === 0) {
            router.replace('/cart')
        } else {
            setIsVerified(true)
        }
    }, [cart, router])

    if (!isVerified) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
            </div>
        )
    }

    return <>{children}</>
}