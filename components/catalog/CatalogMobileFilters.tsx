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
                        rounded-md
                        border border-[var(--color-border-subtle)]
                        bg-[var(--color-bg-primary)]
                        text-[var(--color-text-primary)]
                        transition-colors
                        hover:bg-[var(--color-bg-secondary)]
                    "
                >
                    <LuListFilter className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    Filtros

                    {hasFilters && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-warm)] ml-1" />
                    )}
                </button>
            </DrawerTrigger>

            {/* Drawer */}
            <DrawerContent
                className="
                    h-[88vh]
                    bg-[var(--color-bg-primary)]
                    flex flex-col
                    border-t border-[var(--color-border-subtle)]
                "
            >
                {/* Header */}
                <DrawerHeader
                    className="
                        px-4 py-3
                        flex items-center justify-between
                        border-b border-[var(--color-border-subtle)]
                        shrink-0
                    "
                >
                    <DrawerTitle className="text-sm font-medium text-[var(--color-text-primary)]">
                        Filtros
                    </DrawerTitle>

                    <div className="flex items-center gap-2">
                        {hasFilters && (
                            <button
                                onClick={clearFilters}
                                className="
                                    text-[12px]
                                    text-[var(--color-text-tertiary)]
                                    hover:text-[var(--color-text-primary)]
                                    transition-colors
                                "
                            >
                                Limpiar
                            </button>
                        )}

                        <DrawerClose asChild>
                            <button
                                className="
                                    p-1.5
                                    rounded-md
                                    text-[var(--color-text-tertiary)]
                                    hover:bg-[var(--color-bg-secondary)]
                                    transition-colors
                                "
                            >
                                <LuX className="w-4 h-4" />
                            </button>
                        </DrawerClose>
                    </div>
                </DrawerHeader>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-4 py-3">
                    <CatalogSidebar filters={filters} />
                </div>
            </DrawerContent>
        </Drawer>
    );
}