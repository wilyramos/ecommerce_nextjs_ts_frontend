"use client";

import { ArrowUpDown } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCatalogNav } from "./hooks/useCatalogNav";

export default function CatalogMobileSort() {
    const { updateFilter, searchParams } = useCatalogNav();
    const currentSort = searchParams.get("sort") || "recientes";

    return (
        <div className="relative flex items-center">
            <div className="absolute left-3 z-10 pointer-events-none">
                <ArrowUpDown className="w-3.5 h-3.5 text-[var(--color-text-tertiary)]" />
            </div>

            <Select
                value={currentSort}
                onValueChange={(val) => updateFilter("sort", val)}
            >
                <SelectTrigger
                    className="
                        h-9 pl-9 pr-3
                        text-[13px] font-medium
                        border border-[var(--color-border-subtle)]
                        bg-[var(--color-bg-primary)]
                        text-[var(--color-text-primary)]
                        rounded-md
                        focus:ring-0 focus:outline-none
                        hover:bg-[var(--color-bg-secondary)]
                        transition-colors
                        w-auto
                    "
                >
                    <SelectValue placeholder="Ordenar" />
                </SelectTrigger>

                <SelectContent
                    align="end"
                    className="bg-[var(--color-bg-primary)] border-[var(--color-border-default)] rounded-xl p-1"
                >
                    <SelectItem value="recientes" className="rounded-lg text-[13px]">Más Recientes</SelectItem>
                    <SelectItem value="price-asc" className="rounded-lg text-[13px]">Menor Precio</SelectItem>
                    <SelectItem value="price-desc" className="rounded-lg text-[13px]">Mayor Precio</SelectItem>
                    <SelectItem value="name-asc" className="rounded-lg text-[13px]">A - Z</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}