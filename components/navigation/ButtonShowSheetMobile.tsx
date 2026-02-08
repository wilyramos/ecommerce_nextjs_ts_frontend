"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, User, ChevronRight, Sparkles, Percent, Grid } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import type { CategoryListResponse, CategoryResponse } from "@/src/schemas";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/routes"; // Importamos el helper de rutas

interface ButtonShowSheetMobileProps {
    categories: CategoryResponse[];
}

export default function ButtonShowSheetMobile({
    categories,
}: ButtonShowSheetMobileProps) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    // Cerrar el menú al cambiar de ruta
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    // Agrupación de categorías
    const grouped = categories.reduce((acc, category) => {
        const parentId =
            category.parent && typeof category.parent !== "string"
                ? category.parent._id
                : null;
        if (!acc[parentId ?? "root"]) acc[parentId ?? "root"] = [];
        acc[parentId ?? "root"].push(category);
        return acc;
    }, {} as Record<string, CategoryListResponse>);

    const rootCategories = grouped["root"] || [];

    // Enlaces estáticos principales
    const mainLinks = [
        { href: "/novedades", label: "Novedades", icon: <Sparkles size={18} /> },
        { href: "/ofertas", label: "Ofertas", icon: <Percent size={18} /> },
        { href: routes.catalog(), label: "Todo el Catálogo", icon: <Grid size={18} /> },
    ];

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="p-2 text-[var(--store-text)] hover:text-[var(--store-text-muted)] transition focus:outline-none">
                    {open ? <X size={24} /> : <Menu size={24} />}
                </button>
            </SheetTrigger>

            <SheetContent
                side="left"
                className="flex flex-col h-full w-[85vw] sm:w-[350px] p-0 bg-[var(--store-surface)] shadow-2xl border-r border-[var(--store-border)] outline-none gap-0"
            >
                {/* Header */}
                <div className="px-6 py-5 border-b border-[var(--store-border)] bg-[var(--store-bg)]">
                    <SheetHeader className="text-left">
                        <SheetTitle className="flex items-center gap-2">
                            <span className="text-sm font-bold uppercase tracking-widest text-[var(--store-text)]">
                                Menú
                            </span>
                        </SheetTitle>
                    </SheetHeader>
                </div>

                {/* Scrollable Content */}
                <ScrollArea className="flex-1 px-4 py-2">

                    {/* 1. SECCIÓN PRINCIPAL (Novedades, Ofertas, etc.) */}
                    <div className="py-2 mb-4 border-b border-[var(--store-border)]">
                        {mainLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-3 px-3 py-3 rounded-lg text-[15px] font-medium text-[var(--store-text)] hover:bg-[var(--store-bg)] transition-colors"
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* 2. SECCIÓN CATEGORÍAS */}
                    <div className="px-2 pb-2">
                        <span className="text-xs font-bold text-[var(--store-text-muted)] uppercase tracking-wider mb-2 block px-2">
                            Categorías
                        </span>

                        <div className="space-y-1">
                            {rootCategories.map((parent) => {
                                const subcategories = grouped[parent._id] || [];
                                const hasSub = subcategories.length > 0;

                                return (
                                    <div key={parent._id} className="border-b border-[var(--store-border)] last:border-0 py-1">
                                        <details className="group">
                                            <summary className="cursor-pointer list-none flex items-center justify-between text-[15px] font-medium text-[var(--store-text)] py-3 px-2 rounded-md hover:bg-[var(--store-bg)] transition-colors select-none">
                                                <span>{parent.nombre}</span>
                                                {hasSub && (
                                                    <ChevronRight className="h-4 w-4 text-[var(--store-text-muted)] group-open:rotate-90 transition-transform duration-200" />
                                                )}
                                            </summary>

                                            {hasSub && (
                                                <div className="pl-4 pr-2 pb-2 space-y-1 animate-in slide-in-from-top-1 duration-200">



                                                    {/* Subcategorías */}
                                                    {subcategories.map((subcategory) => (
                                                        <Link
                                                            key={subcategory._id}
                                                            href={routes.catalog({ category: subcategory.slug })}
                                                            className="
                                                                block text-sm 
                                                                text-[var(--store-text-muted)] 
                                                                hover:text-[var(--store-text)] 
                                                                hover:bg-[var(--store-bg)] 
                                                                px-3 py-2 rounded-md transition-colors
                                                            "
                                                        >
                                                            {subcategory.nombre}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </details>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </ScrollArea>

                {/* Footer (Login / Cuenta) */}
                <div className="mt-auto border-t border-[var(--store-border)] bg-[var(--store-bg)] p-6">
                    <Link
                        href="/auth/registro"
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-[var(--store-radius)] bg-[var(--store-primary)] text-[var(--store-primary-text)] text-sm font-medium hover:bg-[var(--store-primary-hover)] transition shadow-sm"
                    >
                        <User className="h-4 w-4" />
                        Iniciar sesión / Registrarse
                    </Link>
                </div>
            </SheetContent>
        </Sheet>
    );
}