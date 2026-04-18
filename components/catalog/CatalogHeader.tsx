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
import { useCatalogNav } from "./hooks/useCatalogNav";

interface Props {
    title: string;
    totalProducts: number;
    breadcrumbs: { label: string; href: string }[];
}

export default function CatalogHeader({ title, totalProducts, breadcrumbs }: Props) {
    const { updateFilter, searchParams } = useCatalogNav();

    const currentSort = searchParams.get("sort") || "recientes";

    return (
        <div className="flex flex-col gap-6 pb-1 border-b my-2 border-[var(--color-border-default)]">

            {/* 1. Breadcrumbs */}
            <nav aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                    {breadcrumbs.map((crumb, index) => {
                        const isLast = index === breadcrumbs.length - 1;
                        const isPlaceholder = crumb.href === "#";
                        const isFirst = index === 0;

                        return (
                            <li key={`${crumb.label}-${index}`} className="flex items-center">
                                {/* Separator */}
                                {index > 0 && (
                                    <ChevronRight className="w-3 h-3 mx-2 text-[var(--color-text-tertiary)] flex-shrink-0" />
                                )}

                                {isLast || isPlaceholder ? (
                                    <span
                                        className={`flex items-center gap-1 ${isLast ? "font-bold text-[var(--color-text-primary)]" : "font-medium"}`}
                                        aria-current={isLast ? "page" : undefined}
                                    >
                                        {isFirst && <Home className="w-3.5 h-3.5 mb-0.5" />}
                                        {crumb.label}
                                    </span>
                                ) : (
                                    <Link
                                        href={crumb.href}
                                        className="flex items-center gap-1 hover:text-[var(--color-action-primary)] hover:underline transition-all font-medium"
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
                {/* 2. Title and Counter */}
                <div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-[var(--color-text-primary)] capitalize">
                        {title}
                    </h1>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1.5 font-medium">
                        {totalProducts} {totalProducts === 1 ? 'producto encontrado' : 'productos encontrados'}
                    </p>
                </div>

                {/* 3. Sorting */}
                <div className="flex items-center gap-3 w-auto">
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] whitespace-nowrap">
                        Ordenar por:
                    </span>

                    <Select
                        value={currentSort}
                        onValueChange={(val) => updateFilter("sort", val)}
                    >
                        <SelectTrigger className="w-[180px] h-10 rounded border-[var(--color-border-default)] bg-[var(--color-bg-primary)] text-sm focus:ring-1 focus:ring-[var(--color-action-primary)] transition-all">
                            <SelectValue placeholder="Relevancia" />
                        </SelectTrigger>

                        <SelectContent align="end" className="bg-[var(--color-bg-primary)] border-[var(--color-border-default)]">
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