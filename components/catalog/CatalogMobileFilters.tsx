"use client";

import { useCatalogNav } from "./hooks/useCatalogNav";
import CatalogSidebar from "./CatalogSidebar";
import type { CatalogFilters } from "@/src/schemas/catalog";
import { LuListFilter, LuX, LuTrash2 } from "react-icons/lu";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerClose,
} from "@/components/ui/drawer";

interface Props {
    filters: CatalogFilters;
}

export default function CatalogMobileFilters({ filters }: Props) {
    const { hasFilters, clearFilters } = useCatalogNav();

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <button className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded text-sm font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
                    <LuListFilter className="w-4 h-4" />
                    Filtros
                    {hasFilters && (
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-action-primary)] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-action-primary)]"></span>
                        </span>
                    )}
                </button>
            </DrawerTrigger>

            <DrawerContent className="h-[85vh] bg-[var(--color-bg-primary)] flex flex-col focus:outline-none border-[var(--color-border-default)]">

                {/* 1. HEADER (Fijo) */}
                <DrawerHeader className="border-b border-[var(--color-border-default)] px-5 py-4 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                        <DrawerTitle className="uppercase tracking-widest text-sm font-bold text-[var(--color-text-primary)]">
                            Filtros
                        </DrawerTitle>

                        {/* Botón Reset */}
                        {hasFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-xs font-medium text-[var(--color-error)] flex items-center gap-1 hover:bg-[var(--color-error-light)] px-2 py-1 rounded transition-colors"
                            >
                                <LuTrash2 className="w-3 h-3" />
                                Limpiar
                            </button>
                        )}
                    </div>

                    <DrawerClose asChild>
                        <button className="p-2 -mr-2 text-[var(--color-text-tertiary)] hover:bg-[var(--color-bg-secondary)] rounded-full transition-colors">
                            <LuX className="w-5 h-5" />
                        </button>
                    </DrawerClose>
                </DrawerHeader>

                {/* 2. BODY (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-5">
                    <CatalogSidebar filters={filters} />
                </div>

            </DrawerContent>
        </Drawer>
    );
}