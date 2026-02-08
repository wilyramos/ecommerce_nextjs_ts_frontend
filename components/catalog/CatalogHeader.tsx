"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
// Asegúrate de que la ruta de importación sea correcta según tu estructura
import { useCatalogNav } from "./hooks/useCatalogNav";

interface Props {
    title: string;
    totalProducts: number;
    breadcrumbs: { label: string; href: string }[];
}

//TODO: mEJORAR el fitlro de ordenamiento.

export default function CatalogHeader({ title, totalProducts, breadcrumbs }: Props) {
    const { updateFilter, searchParams } = useCatalogNav();
    
    // Obtenemos el sort actual de la URL o "recientes" por defecto
    const currentSort = searchParams.get("sort") || "recientes";

    return (
        <div className="flex flex-col gap-6 pb-6 border-b border-[var(--store-border)]">
            
            {/* 1. Breadcrumbs */}
            <nav aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-2 text-xs text-[var(--store-text-muted)]">
                    {breadcrumbs.map((crumb, index) => {
                        const isLast = index === breadcrumbs.length - 1;
                        const isPlaceholder = crumb.href === "#";
                        const isFirst = index === 0;

                        return (
                            <li key={`${crumb.label}-${index}`} className="flex items-center">
                                {/* Separador (no se muestra en el primero) */}
                                {index > 0 && (
                                    <ChevronRight className="w-3 h-3 mx-2 text-gray-300 flex-shrink-0" />
                                )}

                                {isLast || isPlaceholder ? (
                                    // Texto plano (Elemento actual o sin enlace válido)
                                    <span 
                                        className={`flex items-center gap-1 ${isLast ? "font-bold text-[var(--store-text)]" : "font-medium"}`}
                                        aria-current={isLast ? "page" : undefined}
                                    >
                                        {isFirst && <Home className="w-3.5 h-3.5 mb-0.5" />}
                                        {crumb.label}
                                    </span>
                                ) : (
                                    // Enlace funcional
                                    <Link 
                                        href={crumb.href} 
                                        className="flex items-center gap-1 hover:text-[var(--store-primary)] hover:underline transition-all font-medium"
                                    >
                                        {isFirst && <Home className="w-3.5 h-3.5 mb-0.5" />}
                                        {crumb.label}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                {/* 2. Título y Contador */}
                <div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--store-text)] capitalize">
                        {title}
                    </h1>
                    <p className="text-sm text-[var(--store-text-muted)] mt-1.5 font-medium">
                        {totalProducts} {totalProducts === 1 ? 'producto encontrado' : 'productos encontrados'}
                    </p>
                </div>

                {/* 3. Ordenamiento */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--store-text-muted)] whitespace-nowrap hidden sm:block">
                        Ordenar por:
                    </span>
                    <Select 
                        value={currentSort} 
                        onValueChange={(val) => updateFilter("sort", val)}
                    >
                        <SelectTrigger className="w-full sm:w-[180px] h-10 rounded-lg border-[var(--store-border)] bg-[var(--store-surface)] text-sm focus:ring-1 focus:ring-[var(--store-primary)] transition-all">
                            <SelectValue placeholder="Relevancia" />
                        </SelectTrigger>
                        <SelectContent align="end" className="bg-[var(--store-surface)]">
                            <SelectItem value="recientes">Más Nuevos</SelectItem>
                            <SelectItem value="price-asc">Precio: Bajo a Alto</SelectItem>
                            <SelectItem value="price-desc">Precio: Alto a Bajo</SelectItem>
                            <SelectItem value="name-asc">Nombre: A-Z</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}