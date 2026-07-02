// File: frontend/app/(store)/productos/not-found.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Store, Home } from 'lucide-react';
import { routes } from "@/lib/routes";

export default function NotFound() {
    return (
        <main className="max-w-screen-2xl mx-auto px-4 py-8 animate-fade-in">
            {/* Breadcrumbs Semánticos de Recuperación */}
            <nav aria-label="Breadcrumb" className="flex items-center text-xs text-muted-foreground/80 font-medium pb-6 px-2">
                <ol className="flex items-center whitespace-nowrap overflow-hidden">
                    <li className="flex items-center shrink-0">
                        <Link href="/" className="hover:text-action-cta transition-colors">
                            Inicio
                        </Link>
                    </li>
                    <li className="flex items-center min-w-0">
                        <span className="mx-2 text-muted-foreground/40 select-none">/</span>
                        <Link href={routes.catalog()} className="hover:text-action-cta transition-colors">
                            Catálogo
                        </Link>
                    </li>
                    <li className="flex items-center min-w-0 text-foreground font-semibold">
                        <span className="mx-2 text-muted-foreground/40 select-none">/</span>
                        <span className="truncate" aria-current="page">
                            Producto no encontrado
                        </span>
                    </li>
                </ol>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch min-h-[50vh]">
                {/* Contenedor Visual Izquierdo con Logo de GoPhone */}
                <div className="md:col-span-7 flex flex-col items-center justify-center bg-muted/20 border border-border/40 rounded-lg p-8 relative overflow-hidden group min-h-[300px] md:min-h-auto">
                    <div className="relative w-32 h-32 ">
                        <Image
                            src="/logoapp.svg"
                            alt="GoPhone Logo"
                            fill
                            className="object-contain"
                            priority
                            unoptimized
                        />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mt-4">
                        Artículo no disponible
                    </span>
                </div>

                {/* Contenedor de Información Derecho */}
                <div className="md:col-span-5">
                    <div className="bg-card p-6 rounded-lg border border-border h-full flex flex-col justify-between shadow-xs">
                        <header className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-bold">
                                <span className="text-muted-foreground">GOPHONE</span>
                                <span className="text-destructive px-2 py-0.5 bg-destructive/10 rounded-xs">RECURSO 404</span>
                            </div>

                            <h1 className="text-2xl md:text-3xl font-normal text-foreground tracking-tight leading-tight">
                                Este producto no está disponible actualmente
                            </h1>

                            <div className="flex items-baseline text-muted-foreground/40 font-mono select-none">
                                <span className="text-sm mr-1">S/</span>
                                <span className="text-3xl font-light">--.--</span>
                            </div>

                            <div>
                                <span className="inline-flex items-center px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-destructive/10 text-destructive border border-destructive/20">
                                    Enlace incorrecto o agotado
                                </span>
                            </div>
                        </header>

                        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed my-6">
                            Es posible que el enlace que seguiste esté desactualizado, el artículo haya cambiado de URL o el inventario se encuentre completamente agotado en nuestros almacenes de Cañete.
                        </p>

                        <div className="space-y-3 pt-4 border-t border-border/40">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                Explorar alternativas alternativas:
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link href={routes.catalog()} className="flex-1">
                                    <Button variant="default" size="sm" className="w-full flex items-center justify-center gap-2 h-10 font-semibold text-xs tracking-wide uppercase bg-foreground text-background hover:bg-foreground/90 rounded-none">
                                        <Store className="w-4 h-4 shrink-0" />
                                        Ver Catálogo
                                    </Button>
                                </Link>

                                <Link href="/" className="flex-1">
                                    <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-2 h-10 font-semibold text-xs tracking-wide uppercase border-border text-foreground hover:bg-muted/40 rounded-none">
                                        <Home className="w-4 h-4 shrink-0" />
                                        Ir al Inicio
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}