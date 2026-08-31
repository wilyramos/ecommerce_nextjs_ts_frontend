// File: frontend/components/admin/ui/table/AdminDataTableColumnHeader.tsx
"use client";

import { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminDataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>;
    title: string;
}

export function AdminDataTableColumnHeader<TData, TValue>({ column, title, className }: AdminDataTableColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
        return <div className={cn("text-[11px] font-semibold uppercase tracking-wider text-zinc-500", className)}>{title}</div>;
    }

    return (
        <div className={cn("flex items-center", className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-3 h-7 px-2 data-[state=open]:bg-zinc-100 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 transition-colors"
                    >
                        <span>{title}</span>
                        {column.getIsSorted() === "desc" ? <ArrowDown className="ml-1.5 h-3 w-3 text-zinc-900" /> : column.getIsSorted() === "asc" ? <ArrowUp className="ml-1.5 h-3 w-3 text-zinc-900" /> : <ChevronsUpDown className="ml-1.5 h-3 w-3 text-zinc-300 opacity-0 group-hover:opacity-100" />}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[150px] bg-white border-zinc-200">
                    <DropdownMenuItem onClick={() => column.toggleSorting(false)} className="text-[12px] cursor-pointer">
                        <ArrowUp className="mr-2 h-3.5 w-3.5 text-zinc-400" /> Ascendente
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => column.toggleSorting(true)} className="text-[12px] cursor-pointer">
                        <ArrowDown className="mr-2 h-3.5 w-3.5 text-zinc-400" /> Descendente
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-zinc-100" />
                    <DropdownMenuItem onClick={() => column.toggleVisibility(false)} className="text-[12px] cursor-pointer">
                        <EyeOff className="mr-2 h-3.5 w-3.5 text-zinc-400" /> Ocultar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}