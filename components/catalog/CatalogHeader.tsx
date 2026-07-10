// File: frontend/components/catalog/CatalogHeader.tsx
"use client";

import Link from "next/link";
import { ArrowUpDown, ChevronRight } from "lucide-react";
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
        <div className="w-full flex flex-col gap-4 pt-1 pb-4 border-b border-border select-none">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb">
                <ol className="flex items-center flex-wrap gap-x-1.5 text-[11px] font-medium  tracking-wider text-muted-foreground/80">
                    {breadcrumbs.map((crumb, index) => {
                        const isLast = index === breadcrumbs.length - 1;

                        return (
                            <li key={`${crumb.label}-${index}`} className="flex items-center">
                                {index > 0 && (
                                    <ChevronRight className="w-3 h-3 mx-1 opacity-40 text-foreground" />
                                )}

                                {isLast ? (
                                    <span className="text-foreground font-semibold" aria-current="page">
                                        {crumb.label}
                                    </span>
                                ) : (
                                    <Link
                                        href={crumb.href}
                                        className="hover:text-action-cta transition-colors duration-150"
                                    >
                                        {crumb.label}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>

            {/* Header Title & Sorting */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-2">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h1 className="text-xl md:text-2xl font-bold tracking-tight text-primary uppercase">
                        {title.map((part, i) => (
                            <span
                                key={i}
                                className={part.italic ? "font-normal italic text-muted-foreground/90 lowercase first-letter:uppercase" : ""}
                            >
                                {part.text}{" "}
                            </span>
                        ))}
                    </h1>

                    <span className="text-[11px] font-bold tracking-widest text-action-cta bg-action-cta/10 px-2 py-0.5 rounded-sm uppercase">
                        {totalProducts} Items
                    </span>
                </div>

                {/* Sorting */}
                <div className="hidden md:flex items-center">
                    <div className="relative flex items-center">
                        <ArrowUpDown className="absolute left-3.5 w-3.5 h-3.5 text-muted-foreground pointer-events-none z-10" />
                        <Select
                            value={currentSort}
                            onValueChange={(val) => updateFilter("sort", val)}
                        >
                            <SelectTrigger className="w-[210px] h-10 pl-9 pr-4 text-xs font-semibold uppercase tracking-wider border-border bg-background hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-150 rounded-none cursor-pointer">
                                <SelectValue placeholder="Ordenar por" />
                            </SelectTrigger>

                            <SelectContent align="end" className="rounded-none border-border">
                                <SelectItem value="relevancia" className="text-xs uppercase tracking-wider font-medium cursor-pointer focus:bg-action-cta focus:text-white">Relevancia</SelectItem>
                                <SelectItem value="recientes" className="text-xs uppercase tracking-wider font-medium cursor-pointer focus:bg-action-cta focus:text-white">Más Recientes</SelectItem>
                                <SelectItem value="discount" className="text-xs uppercase tracking-wider font-medium cursor-pointer focus:bg-action-cta focus:text-white">Mayor Descuento</SelectItem>
                                <SelectItem value="price-asc" className="text-xs uppercase tracking-wider font-medium cursor-pointer focus:bg-action-cta focus:text-white">Precio: Menor a Mayor</SelectItem>
                                <SelectItem value="price-desc" className="text-xs uppercase tracking-wider font-medium cursor-pointer focus:bg-action-cta focus:text-white">Precio: Mayor a Menor</SelectItem>
                                <SelectItem value="name-asc" className="text-xs uppercase tracking-wider font-medium cursor-pointer focus:bg-action-cta focus:text-white">Nombre: A - Z</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );
}