// File: src/components/catalog/CatalogHeader.tsx
"use client";

import Link from "next/link";
import { Home, ArrowUpDown } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCatalogNav } from "./hooks/useCatalogNav";

export type TitlePart = {
    text: string;
    italic?: boolean;
};

interface Props {
    title: TitlePart[];
    totalProducts: number;
    breadcrumbs: { label: string; href: string }[];
}

export default function CatalogHeader({ title, totalProducts, breadcrumbs }: Props) {
    const { updateFilter, searchParams } = useCatalogNav();

    const currentSort = searchParams.get("sort") || "recientes";

    return (
        <div className="w-full flex flex-col gap-8 pt-4 pb-6 border-b border-[var(--color-border-subtle)]">

            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="px-1">
                <ol className="flex items-center flex-wrap gap-x-1.5 text-sm text-[var(--color-text-tertiary)]">
                    {breadcrumbs.map((crumb, index) => {
                        const isLast = index === breadcrumbs.length - 1;
                        const isFirst = index === 0;

                        return (
                            <li key={`${crumb.label}-${index}`} className="flex items-center">
                                {index > 0 && (
                                    <span className="mx-1 opacity-40">/</span>
                                )}

                                {isLast ? (
                                    <span className="text-[var(--color-text-primary)]" aria-current="page">
                                        {crumb.label}
                                    </span>
                                ) : (
                                    <Link
                                        href={crumb.href}
                                        className="flex items-center gap-1 hover:text-[var(--color-text-primary)] transition-colors duration-200"
                                    >
                                        {isFirst && <Home className="w-2.5 h-2.5 mb-0.5" />}
                                        {crumb.label}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
                <div className="space-y-1.5">
                    <div className="flex items-baseline gap-4">
                        <h1 className="text-xl md:text-2xl font-semibold tracking-tighter text-[var(--color-text-primary)] uppercase">
                            {title.map((part, i) => (
                                <span
                                    key={i}
                                    className={part.italic ? "font-light italic " : ""}
                                >
                                    {part.text}{" "}
                                </span>
                            ))}
                        </h1>

                        <span className="h-6 w-[1px] bg-[var(--color-border-default)] hidden sm:block" />

                        <span className="text-[11px] font-bold tracking-widest text-[var(--color-accent-warm)]">
                            {totalProducts} Items
                        </span>
                    </div>
                </div>

                {/* Sorting */}
                <div className="hidden md:flex items-center gap-4">
                    <div className="group relative flex items-center">
                        <div className="absolute left-3 z-10 pointer-events-none">
                            <ArrowUpDown className="w-3.5 h-3.5 text-[var(--color-text-tertiary)] group-focus-within:text-[var(--color-action-primary)] transition-colors" />
                        </div>

                        <Select
                            value={currentSort}
                            onValueChange={(val) => updateFilter("sort", val)}
                        >
                            <SelectTrigger className="w-[200px] h-11 pl-9 pr-4 border-[var(--color-border-default)] bg-[var(--color-bg-primary)] text-[13px] font-semibold text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-action-primary-light)] focus:border-[var(--color-action-primary)] transition-all hover:bg-[var(--color-bg-secondary)]">
                                <SelectValue placeholder="Ordenar por" />
                            </SelectTrigger>

                            <SelectContent
                                align="end"
                                className="bg-[var(--color-bg-primary)] border-[var(--color-border-default)] rounded-xl p-1"
                            >
                                <SelectItem value="recientes" className="rounded-lg text-[13px] focus:bg-[var(--color-bg-secondary)]">
                                    Más Recientes
                                </SelectItem>
                                <SelectItem value="price-asc" className="rounded-lg text-[13px] focus:bg-[var(--color-bg-secondary)]">
                                    Precio: Menor a Mayor
                                </SelectItem>
                                <SelectItem value="price-desc" className="rounded-lg text-[13px] focus:bg-[var(--color-bg-secondary)]">
                                    Precio: Mayor a Menor
                                </SelectItem>
                                <SelectItem value="name-asc" className="rounded-lg text-[13px] focus:bg-[var(--color-bg-secondary)]">
                                    Nombre: A - Z
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );
}