// File: frontend/components/collections/CollectionMobileFilters.tsx
"use client";

import { useCollectionNav } from "./hooks/useCollectionNav";
import CollectionSidebar from "@/components/catalog/CatalogSidebar";
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

export default function CollectionMobileFilters({ filters }: Props) {
    const { hasFilters, clearFilters } = useCollectionNav();

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
                        border border-border-primary
                        bg-surface-primary
                        text-text-primary
                        rounded-radius-md
                        transition-colors
                        hover:bg-surface-secondary
                        active:scale-95
                        outline-none rounded-md
                    "
                >
                    <LuListFilter className="w-4 h-4 text-text-secondary" />
                    Filtros

                    {hasFilters && (
                        <span className="w-1.5 h-1.5 rounded-radius-full bg-brand-accent ml-1 animate-pulse" />
                    )}
                </button>
            </DrawerTrigger>

            {/* Drawer */}
            <DrawerContent
                className="
                    h-[88vh]
                    bg-surface-primary
                    flex flex-col
                    border-t border-border-primary
                "
            >
                {/* Header */}
                <DrawerHeader
                    className="
                        px-4 py-3
                        flex items-center justify-between
                        border-b border-border-primary
                        shrink-0
                    "
                >
                    <DrawerTitle className="text-sm font-semibold text-text-primary">
                        Filtros
                    </DrawerTitle>

                    <div className="flex items-center gap-4">
                        {hasFilters && (
                            <button
                                onClick={clearFilters}
                                className="
                                    text-[12px]
                                    font-semibold
                                    text-text-secondary
                                    hover:text-brand-accent
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
                                    rounded-radius-md
                                    text-text-secondary
                                    hover:bg-surface-secondary
                                    hover:text-text-primary
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
                <div className="flex-1 overflow-y-auto px-4 py-3 scrollbar-thin scrollbar-thumb-border-primary">
                    <CollectionSidebar filters={filters} />
                </div>
            </DrawerContent>
        </Drawer>
    );
}