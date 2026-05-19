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
        <div className="bg-background min-h-screen flex flex-col">
            {/* Header Compacto y Minimalista Unificado */}
            <header className="w-full border-b border-border bg-background">
                <div className="container mx-auto px-4 md:px-6 max-w-screen-2xl py-6 md:py-8 flex flex-col gap-4">

                    {/* Badge Dinámico Minimalista (Estilo iShop/Apple sin bloques sólidos de color innecesarios) */}
                    <div className="inline-flex items-center w-fit border-l-2 border-action-cta pl-2.5 py-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-action-cta">
                            {badge}
                        </span>
                    </div>

                    {/* Título con Soporte para Highlights */}
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                        {title}
                    </h1>

                    {/* Descripción */}
                    <p className="text-sm md:text-base text-muted-foreground max-w-2xl font-medium">
                        {description}
                    </p>
                </div>
            </header>

            {/* Contenido Principal (Catálogo) */}
            <main className="flex-1 bg-background">
                {children}
            </main>
        </div>
    );
}