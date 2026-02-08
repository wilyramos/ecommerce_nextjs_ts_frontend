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
                <button className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-[var(--store-border)] rounded-lg text-sm font-bold uppercase tracking-wider text-[var(--store-text)] ">
                    <LuListFilter className="w-4 h-4" />
                    Filtros
                    {hasFilters && (
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--store-primary)] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--store-primary)]"></span>
                        </span>
                    )}
                </button>
            </DrawerTrigger>

            {/* Ajustamos la altura para que se sienta como una app nativa (85% de la pantalla) */}
            <DrawerContent className="h-[85vh] bg-[var(--store-surface)] rounded-t-[20px] flex flex-col focus:outline-none">

                {/* 1. HEADER (Fijo) */}
                <DrawerHeader className="border-b border-[var(--store-border)] px-5 py-4 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                        <DrawerTitle className="uppercase tracking-widest text-sm font-bold text-[var(--store-text)]">
                            Filtros
                        </DrawerTitle>

                        {/* Botón Reset: Solo aparece si hay filtros activos */}
                        {hasFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-xs font-medium text-red-500 flex items-center gap-1 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
                            >
                                <LuTrash2 className="w-3 h-3" />
                                Limpiar
                            </button>
                        )}
                    </div>

                    <DrawerClose asChild>
                        <button className="p-2 -mr-2 text-[var(--store-text-muted)] hover:bg-gray-100 rounded-full transition-colors">
                            <LuX className="w-5 h-5" />
                        </button>
                    </DrawerClose>
                </DrawerHeader>

                {/* 2. BODY (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-5">
                    {/* Reutilizamos el componente robusto que ya creamos */}
                    <CatalogSidebar filters={filters} />
                </div>

                {/* 3. FOOTER (Fijo abajo) */}
                <div className="p-4 border-t border-[var(--store-border)] bg-[var(--store-surface)] pb-safe shrink-0">
                    <DrawerClose asChild>
                        <button className="w-full bg-[var(--store-text)] text-[var(--store-surface)] font-bold py-3.5 rounded-xl shadow-lg active:scale-[0.98] transition-transform flex justify-center items-center gap-2">
                            Ver Resultados
                        </button>
                    </DrawerClose>
                </div>

            </DrawerContent>
        </Drawer>
    );
}