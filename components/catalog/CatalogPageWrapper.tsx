import React from "react";

interface CatalogPageWrapperProps {
    badge: string;
    title: React.ReactNode; // Permite pasar JSX para el estilo italic/light
    description: string;
    children: React.ReactNode;
}

export default function CatalogPageWrapper({
    badge,
    title,
    description,
    children,
}: CatalogPageWrapperProps) {
    return (
        <div className="bg-[var(--color-bg-primary)] min-h-screen flex flex-col">
            {/* Header Compacto y Minimalista Unificado */}
            <header className="w-full border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]">
                <div className="container mx-auto px-4 md:px-6 max-w-[1440px] py-6 md:py-8 flex flex-col gap-4">

                    {/* Badge Dinámico */}
                    <div className="inline-flex items-center gap-2 w-fit px-3 py-1 bg-[var(--color-accent-warm)]">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-inverse)]">
                            {badge}
                        </span>
                    </div>

                    {/* Título con Soporte para Highlights */}
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--color-text-primary)]">
                        {title}
                    </h1>

                    {/* Descripción */}
                    <p className="text-sm md:text-base text-[var(--color-text-secondary)] max-w-2xl font-medium">
                        {description}
                    </p>
                </div>
            </header>

            {/* Contenido Principal (Catálogo) */}
            <main className="flex-1 bg-[var(--color-bg-primary)]">
                {children}
            </main>
        </div>
    );
}