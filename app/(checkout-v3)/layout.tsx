// File: frontend/app/(checkout-v3)/layout.tsx
'use client'

import React from 'react';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { ChevronLeft } from 'lucide-react';

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-surface-secondary text-text-primary selection:bg-brand-primary selection:text-text-inverse">
            {/* Header minimalista */}
            <header className="sticky top-0 z-50 w-full border-b border-border-primary/80 bg-surface-primary/80 backdrop-blur-md">
                <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link href="/carrito" className="group flex items-center gap-3 transition-opacity duration-fast hover:opacity-80">
                        <Logo size={24} />
                    </Link>

                    <Link 
                        href="/carrito" 
                        className="group flex items-center gap-1.5 text-xs font-medium text-text-secondary transition-colors duration-fast hover:text-text-primary"
                    >
                        <ChevronLeft className="size-4 transition-transform duration-fast group-hover:-translate-x-0.5" />
                        <span>Volver al carrito</span>
                    </Link>
                </div>
            </header>

            <main className="flex-1 w-full">
                {children}
            </main>

            {/* Footer con rutas legales exactas del grupo (store)/(legal) */}
            <footer className="mt-auto border-t border-border-primary/80 bg-surface-primary py-6">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-xs text-text-tertiary sm:flex-row sm:px-6 lg:px-8">
                    <span>© {new Date().getFullYear()} GoPhone. </span>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <Link 
                            href="/terminos" 
                            className="transition-colors duration-fast hover:text-text-primary"
                        >
                            Términos y Condiciones
                        </Link>
                        <span>·</span>
                        <Link 
                            href="/politicas-de-privacidad" 
                            className="transition-colors duration-fast hover:text-text-primary"
                        >
                            Privacidad
                        </Link>
                        <span>·</span>
                        <Link 
                            href="/politicas-de-cambios-y-devoluciones" 
                            className="transition-colors duration-fast hover:text-text-primary"
                        >
                            Cambios y Devoluciones
                        </Link>
                        <span>·</span>
                        <Link 
                            href="/cookies" 
                            className="transition-colors duration-fast hover:text-text-primary"
                        >
                            Cookies
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}