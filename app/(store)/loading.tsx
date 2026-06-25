//File: frontend/app/(store)/loading.tsx
import React from 'react'
import SpinnerLoadingV2 from '@/components/ui/SpinnerLoadingV2'

export default function Loading() {
    return (
        <div
            className="min-h-screen flex items-center justify-center"
            role="status"
            aria-live="polite"
            aria-label="Cargando contenido"
        >
            <SpinnerLoadingV2 />
        </div>
    )
}