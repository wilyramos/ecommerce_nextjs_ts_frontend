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
import { Menu, X, User, ChevronRight } from "lucide-react"; // Usamos Lucide
import ButtonSearchFormStore from "../ui/ButtonSearchFormStore";
import { ScrollArea } from "../ui/scroll-area";
import Logo from "../ui/Logo";
import type { CategoryListResponse, CategoryResponse } from "@/src/schemas";
import { usePathname } from "next/navigation";

interface ButtonShowSheetMobileProps {
    categories: CategoryResponse[];
}

export default function ButtonShowSheetMobile({
    categories,
}: ButtonShowSheetMobileProps) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    // Cierra el menú al cambiar de ruta
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    // ... (la lógica de grouped se mantiene igual)
    const grouped = categories.reduce((acc, category) => {
        const parentId =
            category.parent && typeof category.parent !== "string"
                ? category.parent._id
                : null;
        if (!acc[parentId ?? "root"]) {
            acc[parentId ?? "root"] = [];
        }
        acc[parentId ?? "root"].push(category);
        return acc;
    }, {} as Record<string, CategoryListResponse>);
    const rootCategories = grouped["root"] || [];

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="p-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                    {open ? <X size={22} /> : <Menu size={22} />}
                </button>
            </SheetTrigger>

            {/* Layout de Flexbox para el contenido */}
            <SheetContent
                side="left"
                className="p-0 bg-white dark:bg-neutral-900 shadow-xl border-r border-gray-200 dark:border-neutral-800 flex flex-col h-full"
            >
                {/* 1. Cabecera Fija (Logo + Buscador) */}
                <div className="p-4 border-b border-gray-200 dark:border-neutral-800 space-y-4">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-bold text-gray-900 dark:text-white">
                            <Logo />
                        </SheetTitle>
                    </SheetHeader>
                    <ButtonSearchFormStore />
                </div>

                {/* 2. Área de Scroll (Categorías) */}
                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-4">
                        <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 px-2">
                            Explora por categorías
                        </h3>
                        {rootCategories.map((parent) => {
                            const subcategories = grouped[parent._id] || [];
                            return (
                                <div key={parent._id}>
                                    <details className="group">
                                        <summary className="cursor-pointer list-none flex items-center justify-between text-base font-semibold px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-neutral-800">
                                            <span className="flex items-center gap-2">
                                                <span className="text-gray-800 dark:text-gray-200 font-medium">
                                                    {parent.nombre}
                                                </span>
                                            </span>
                                            <ChevronRight className="h-4 w-4 text-gray-400 group-open:rotate-90 transition-transform" />
                                        </summary>
                                        <div className="pl-8 pt-2 space-y-2">
                                            {subcategories.map((subcategory) => (
                                                <Link
                                                    key={subcategory._id}
                                                    href={`/productos?category=${subcategory.slug}`}
                                                    className="block text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                                                >
                                                    {subcategory.nombre}
                                                </Link>
                                            ))}
                                        </div>
                                    </details>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>

                {/* 3. Pie de Página Fijo (Login) */}
                <div className="p-4 border-t border-gray-200 dark:border-neutral-800">
                    <Link
                        href="/auth/registro"
                        className="flex items-center gap-3 p-2 -m-2 rounded-lg text-base font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                        <User className="h-5 w-5" />
                        Iniciar sesión
                    </Link>
                </div>
            </SheetContent>
        </Sheet>
    );
}