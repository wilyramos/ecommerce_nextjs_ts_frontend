// src/components/admin/layout/admin-table-toolbar.tsx
import React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminTableToolbarProps {
    searchPlaceholder?: string;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    filters?: React.ReactNode; // Selects, DatePickers
    actions?: React.ReactNode; // Botones de exportar, eliminar masivo
    className?: string;
}

export function AdminTableToolbar({
    searchPlaceholder = "Buscar...",
    searchValue,
    onSearchChange,
    filters,
    actions,
    className
}: AdminTableToolbarProps) {
    return (
        <div className={cn("p-4 border-b border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-t-xl", className)}>
            <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2 h-4 w-4 text-zinc-400" />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchValue}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        className="h-8 w-full rounded-md border border-zinc-200 bg-transparent pl-9 pr-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-900"
                    />
                </div>
                {filters && <div className="flex items-center gap-2">{filters}</div>}
            </div>

            {actions && (
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {actions}
                </div>
            )}
        </div>
    );
}