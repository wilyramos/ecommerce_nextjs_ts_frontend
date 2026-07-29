// File: frontend/components/admin/inventory/InventoryFilters.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function InventoryFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [, startTransition] = useTransition();

    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const currentFilter = searchParams.get("filter") || "all";

    const applySearchDebounced = useDebouncedCallback((value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value.trim()) {
            params.set("search", value.trim());
        } else {
            params.delete("search");
        }

        params.set("page", "1");

        startTransition(() => {
            router.push(`/admin/inventory?${params.toString()}`);
        });
    }, 400);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        applySearchDebounced(value);
    };

    const handleFilterChange = (filterValue: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (filterValue && filterValue !== "all") {
            params.set("filter", filterValue);
        } else {
            params.delete("filter");
        }

        params.set("page", "1");

        startTransition(() => {
            router.push(`/admin/inventory?${params.toString()}`);
        });
    };

    const handleReset = () => {
        setSearchTerm("");
        startTransition(() => {
            router.push("/admin/inventory");
        });
    };

    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 ">
            <div className="flex-1">
                <Input
                    type="text"
                    placeholder="Buscar por Nombre, SKU o Código de barras..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="text-xs h-8"
                />
            </div>

            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-md">
                <button
                    type="button"
                    onClick={() => handleFilterChange("all")}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded transition-colors ${
                        currentFilter === "all"
                            ? "bg-background text-foreground shadow-xs"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    Todos
                </button>
                <button
                    type="button"
                    onClick={() => handleFilterChange("low")}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded transition-colors ${
                        currentFilter === "low"
                            ? "bg-amber-500 text-white shadow-xs"
                            : "text-amber-600 hover:bg-amber-500/10"
                    }`}
                >
                    Bajo Stock
                </button>
                <button
                    type="button"
                    onClick={() => handleFilterChange("out")}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded transition-colors ${
                        currentFilter === "out"
                            ? "bg-destructive text-destructive-foreground shadow-xs"
                            : "text-destructive hover:bg-destructive/10"
                    }`}
                >
                    Agotados
                </button>

                {(searchTerm || currentFilter !== "all") && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        className="h-7 text-xs font-semibold text-muted-foreground hover:text-foreground ml-1"
                    >
                        Limpiar
                    </Button>
                )}
            </div>
        </div>
    );
}