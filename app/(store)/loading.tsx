// File: frontend/app/(store)/loading.tsx
import React from 'react'
import SpinnerLoadingV2 from '@/components/ui/SpinnerLoadingV2'

export default function Loading() {
    return (
        <div
            className="flex min-h-[65vh] w-full flex-col items-center justify-center bg-surface-primary"
            role="status"
            aria-live="polite"
            aria-label="Cargando contenido"
        >
            <SpinnerLoadingV2 size="md" />
        </div>
    )
}