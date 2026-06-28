"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SECTION_TYPE_LABELS, SectionType } from "@/src/schemas/section.schema";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface FiltersProps {
    filters: {
        type?: SectionType;
        isActive?: string;
    };
}

export default function SectionFiltersComponent({ filters }: FiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        // En Shadcn Select, usamos un string vacío o un valor específico para resetear
        if (value && value !== "all") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set("page", "1");
        router.push(`?${params.toString()}`);
    };

    const handleReset = () => {
        router.push("?");
    };

    const hasActiveFilters = filters.type || filters.isActive;

    return (
        <div className="p-4 rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-end sm:items-center justify-between">
                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                    {/* Filtro por Tipo de Componente */}
                    <div className="flex flex-col gap-1 w-full sm:w-48">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tipo de Sección</label>
                        <Select
                            value={filters.type || "all"}
                            onValueChange={(value) => handleFilterChange("type", value)}
                        >
                            <SelectTrigger className="w-full h-9 bg-background border-border text-sm focus:ring-ring focus:ring-1 outline-none">
                                <SelectValue placeholder="Todos los tipos" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover text-popover-foreground border-border">
                                <SelectItem value="all">Todos los tipos</SelectItem>
                                {Object.entries(SECTION_TYPE_LABELS).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Filtro por Estado */}
                    <div className="flex flex-col gap-1 w-full sm:w-40">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado</label>
                        <Select
                            value={filters.isActive || "all"}
                            onValueChange={(value) => handleFilterChange("isActive", value)}
                        >
                            <SelectTrigger className="w-full h-9 bg-background border-border text-sm focus:ring-ring focus:ring-1 outline-none">
                                <SelectValue placeholder="Todos los estados" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover text-popover-foreground border-border">
                                <SelectItem value="all">Todos los estados</SelectItem>
                                <SelectItem value="true">Activas</SelectItem>
                                <SelectItem value="false">Inactivas</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        onClick={handleReset}
                        className="flex items-center gap-1.5 h-9 px-3 text-xs font-semibold text-destructive hover:bg-destructive/10 border-dashed border-destructive/30 hover:text-destructive"
                    >
                        <X className="w-3.5 h-3.5" />
                        Limpiar Filtros
                    </Button>
                )}
            </div>
        </div>
    );
}