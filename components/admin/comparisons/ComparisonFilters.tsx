"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ComparisonFiltersProps {
    filters: {
        search?: string;
        isActive?: string;
        isFeatured?: string;
    };
}

export default function ComparisonFilters({ filters }: ComparisonFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [search, setSearch] = useState(filters.search || "");

    const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateQueryParams({ search: search.trim() || undefined, page: undefined });
    };

    const updateQueryParams = (newParams: Record<string, string | undefined>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(newParams).forEach(([key, value]) => {
            if (value === undefined || value === "all") {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    return (
        <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
            <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center gap-2 max-w-md">
                <Input
                    placeholder="Buscar por título o palabras clave..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-10 bg-[var(--color-bg-primary)]"
                />
                <Button type="submit" disabled={isPending} className="h-10 px-4">
                    Buscar
                </Button>
            </form>

            <div className="flex flex-wrap items-center gap-3">
                <div className="w-[160px]">
                    <Select
                        defaultValue={filters.isActive || "all"}
                        onValueChange={(val) => updateQueryParams({ isActive: val, page: undefined })}
                        disabled={isPending}
                    >
                        <SelectTrigger className="h-10 bg-[var(--color-bg-primary)]">
                            <SelectValue placeholder="Estado Visibilidad" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los estados</SelectItem>
                            <SelectItem value="true">Activos</SelectItem>
                            <SelectItem value="false">Inactivos</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-[160px]">
                    <Select
                        defaultValue={filters.isFeatured || "all"}
                        onValueChange={(val) => updateQueryParams({ isFeatured: val, page: undefined })}
                        disabled={isPending}
                    >
                        <SelectTrigger className="h-10 bg-[var(--color-bg-primary)]">
                            <SelectValue placeholder="Destacado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="true">Destacados</SelectItem>
                            <SelectItem value="false">No Destacados</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {(filters.search || filters.isActive || filters.isFeatured) && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setSearch("");
                            startTransition(() => router.push(pathname));
                        }}
                        disabled={isPending}
                        className="text-xs uppercase tracking-wider text-[var(--color-text-tertiary)] hover:bg-transparent"
                    >
                        Limpiar Filtros
                    </Button>
                )}
            </div>
        </div>
    );
}