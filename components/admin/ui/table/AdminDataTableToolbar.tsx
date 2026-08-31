// File: frontend/components/admin/ui/table/AdminDataTableToolbar.tsx
"use client";

import React from "react";
import { Table } from "@tanstack/react-table";
import { Search, SlidersHorizontal, X, Download, FilterX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface TableTab {
    value: string;
    label: string;
    badge?: number;
}

interface AdminDataTableToolbarProps<TData> {
    table: Table<TData>;
    globalFilter: string;
    setGlobalFilter: (val: string) => void;
    searchPlaceholder: string;
    tabs?: TableTab[];
    activeTab?: string;
    onTabChange?: (value: string) => void;
    selectedRows: TData[];
    clearSelection: () => void;
    renderBulkActions?: (selectedRows: TData[], clearSelection: () => void) => React.ReactNode;
    onExport?: (format: "csv" | "excel" | "pdf", data: TData[]) => void;
}

export function AdminDataTableToolbar<TData>({
    table,
    globalFilter,
    setGlobalFilter,
    searchPlaceholder,
    tabs,
    activeTab,
    onTabChange,
    selectedRows,
    clearSelection,
    renderBulkActions,
    onExport
}: AdminDataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0 || globalFilter !== "";

    return (
        <div className="flex flex-col">
            {tabs && tabs.length > 0 && (
                <div className="flex items-center gap-6 px-4 border-b border-zinc-200 bg-zinc-50/50 overflow-x-auto slim-scrollbar">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.value;
                        return (
                            <button
                                key={tab.value}
                                onClick={() => onTabChange?.(tab.value)}
                                className={cn(
                                    "relative flex items-center gap-2 py-3 text-sm font-medium transition-colors whitespace-nowrap outline-none",
                                    isActive ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-700"
                                )}
                            >
                                {tab.label}
                                {tab.badge !== undefined && (
                                    <span className="px-1.5 py-0.5 bg-zinc-200/80 text-[10px] font-bold text-zinc-600">
                                        {tab.badge}
                                    </span>
                                )}
                                {isActive && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-900" />}
                            </button>
                        );
                    })}
                </div>
            )}

            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white min-h-[64px]">
                <div className={cn(
                    "flex items-center justify-between w-full transition-all duration-300",
                    selectedRows.length > 0 ? "opacity-0 pointer-events-none absolute" : "opacity-100 relative"
                )}>
                    <div className="flex items-center gap-2 w-full sm:max-w-md">
                        <div className="flex items-center bg-zinc-100/80 border-transparent focus-within:bg-white focus-within:border-zinc-300 border px-3 w-full transition-all">
                            <Search className="h-4 w-4 text-zinc-400 mr-2 flex-shrink-0" />
                            <Input
                                placeholder={searchPlaceholder}
                                value={globalFilter ?? ""}
                                onChange={(event) => setGlobalFilter(event.target.value)}
                                className="border-0 bg-transparent px-0 text-[13px] font-medium focus-visible:ring-0 focus-visible:ring-offset-0 h-9 w-full placeholder:text-zinc-500"
                            />
                        </div>
                        
                        {isFiltered && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => { setGlobalFilter(""); table.resetColumnFilters(); }}
                                className="h-9 px-2 text-zinc-500 hover:text-zinc-900"
                                title="Limpiar Filtros"
                            >
                                <FilterX className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {onExport && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-9 text-[13px] text-zinc-700 bg-white border-zinc-200">
                                        <Download className="mr-2 h-3.5 w-3.5" /> Exportar
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[140px] border-zinc-200 bg-white">
                                    <DropdownMenuItem onClick={() => onExport("csv", table.getFilteredRowModel().rows.map(r => r.original))} className="text-xs cursor-pointer">Exportar a CSV</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onExport("excel", table.getFilteredRowModel().rows.map(r => r.original))} className="text-xs cursor-pointer">Exportar a Excel</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9 text-[13px] bg-white border-zinc-200 text-zinc-700">
                                    <SlidersHorizontal className="mr-2 h-3.5 w-3.5" /> Columnas
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px] border-zinc-200 p-1 bg-white">
                                <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-2 py-1.5">Alternar Vista</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-zinc-100 mx-1" />
                                {table.getAllColumns().filter((col) => typeof col.accessorFn !== "undefined" && col.getCanHide()).map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize text-[13px] cursor-pointer my-0.5"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div className={cn(
                    "absolute inset-x-3 top-3 bottom-3 flex items-center justify-between bg-zinc-900 px-4 transition-all duration-300 z-10 text-white",
                    selectedRows.length > 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
                )}>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-zinc-800 text-zinc-300 hover:text-white" onClick={clearSelection}>
                            <X className="h-4 w-4" />
                        </Button>
                        <span className="text-[13px] font-semibold">
                            {selectedRows.length} fila(s) seleccionada(s)
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {renderBulkActions && renderBulkActions(selectedRows, clearSelection)}
                    </div>
                </div>
            </div>
        </div>
    );
}