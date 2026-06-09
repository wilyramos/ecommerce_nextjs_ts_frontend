"use client";

import Link from "next/link";
import { ArrowUpDown } from "lucide-react";
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
        <div className="w-full flex flex-col gap-8 pt-2 pb-4 border-b border-border">

            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="px-1">
                <ol className="flex items-center flex-wrap gap-x-1.5 text-sm text-muted-foreground">
                    {breadcrumbs.map((crumb, index) => {
                        const isLast = index === breadcrumbs.length - 1;
                        const isFirst = index === 0;

                        return (
                            <li key={`${crumb.label}-${index}`} className="flex items-center">
                                {index > 0 && (
                                    <span className="mx-1 opacity-40">/</span>
                                )}

                                {isLast ? (
                                    <span className="text-foreground font-medium" aria-current="page">
                                        {crumb.label}
                                    </span>
                                ) : (
                                    <Link
                                        href={crumb.href}
                                        className="flex items-center gap-1 hover:text-foreground transition-colors duration-200"
                                    >
                                        {isFirst}
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
                        <h1 className="text-xl md:text-2xl font-semibold tracking-tighter text-foreground uppercase">
                            {title.map((part, i) => (
                                <span
                                    key={i}
                                    className={part.italic ? "font-light italic" : ""}
                                >
                                    {part.text}{" "}
                                </span>
                            ))}
                        </h1>

                        <span className="h-6 w-[1px] bg-border hidden sm:block" />

                        <span className="text-[11px] font-bold tracking-widest text-action-cta uppercase">
                            {totalProducts} Items
                        </span>
                    </div>
                </div>

                {/* Sorting */}
                <div className="hidden md:flex items-center gap-4">
                    <div className="group relative flex items-center">
                        <div className="absolute left-3 z-10 pointer-events-none">
                            <ArrowUpDown className="w-3.5 h-3.5" />
                        </div>

                        <Select
                            value={currentSort}
                            onValueChange={(val) => updateFilter("sort", val)}
                        >
                            <SelectTrigger className="w-[200px] h-11 pl-9 pr-4  ">
                                <SelectValue placeholder="Ordenar por" />
                            </SelectTrigger>

                            <SelectContent
                                align="end"
                                className=""
                            >
                                <SelectItem value="relevancia">
                                    Relevancia
                                </SelectItem>

                                <SelectItem value="recientes">
                                    Más Recientes
                                </SelectItem>

                                <SelectItem value="discount">
                                    Mayor Descuento
                                </SelectItem>

                                <SelectItem value="price-asc">
                                    Precio: Menor a Mayor
                                </SelectItem>

                                <SelectItem value="price-desc">
                                    Precio: Mayor a Menor
                                </SelectItem>

                                <SelectItem value="name-asc">
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