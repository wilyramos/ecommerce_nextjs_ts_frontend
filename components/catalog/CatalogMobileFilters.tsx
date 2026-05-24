//File: frontend/components/catalog/CatalogMobileFilters.tsx

"use client";

import { useCatalogNav } from "./hooks/useCatalogNav";
import CatalogSidebar from "./CatalogSidebar";
import type { CatalogFilters } from "@/src/schemas/catalog";
import { LuListFilter, LuX } from "react-icons/lu";
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
            {/* Trigger */}
            <DrawerTrigger asChild>
                <button
                    className="
                        lg:hidden
                        flex items-center gap-2
                        px-3 py-2
                        text-[13px]
                        font-medium
                        rounded-md
                        border border-border
                        bg-background
                        text-foreground
                        transition-colors
                        hover:bg-background-secondary
                        active:scale-95
                        outline-none
                    "
                >
                    <LuListFilter className="w-4 h-4 text-muted-foreground" />
                    Filtros

                    {hasFilters && (
                        <span className="w-1.5 h-1.5 rounded-full bg-action-cta ml-1 animate-pulse" />
                    )}
                </button>
            </DrawerTrigger>

            {/* Drawer */}
            <DrawerContent
                className="
                    h-[88vh]
                    bg-background
                    flex flex-col
                    border-t border-border
                "
            >
                {/* Header */}
                <DrawerHeader
                    className="
                        px-4 py-3
                        flex items-center justify-between
                        border-b border-border
                        shrink-0
                    "
                >
                    <DrawerTitle className="text-sm font-semibold text-foreground">
                        Filtros
                    </DrawerTitle>

                    <div className="flex items-center gap-4">
                        {hasFilters && (
                            <button
                                onClick={clearFilters}
                                className="
                                    text-[12px]
                                    font-semibold
                                    text-muted-foreground
                                    hover:text-action-cta
                                    transition-colors
                                    outline-none
                                "
                            >
                                Limpiar todo
                            </button>
                        )}

                        <DrawerClose asChild>
                            <button
                                className="
                                    p-1.5
                                    rounded-md
                                    text-muted-foreground
                                    hover:bg-background-secondary
                                    hover:text-foreground
                                    transition-colors
                                    outline-none
                                "
                            >
                                <LuX className="w-4 h-4" />
                            </button>
                        </DrawerClose>
                    </div>
                </DrawerHeader>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-4 py-3 scrollbar-thin scrollbar-thumb-border">
                    <CatalogSidebar filters={filters} />
                </div>
            </DrawerContent>
        </Drawer>
    );
}