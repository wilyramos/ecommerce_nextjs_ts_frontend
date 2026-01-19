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
import { Menu, X, User, ChevronRight } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
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

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

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

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="p-2 text-white hover:text-gray-300 transition focus:outline-none">
                    {open ? <X size={24} /> : <Menu size={24} />}
                </button>
            </SheetTrigger>

            <SheetContent
                side="left"
                className="flex flex-col h-full w-[85vw] sm:w-[350px] p-0 bg-white shadow-2xl border-r border-gray-200 outline-none gap-0"
            >
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100">
                    <SheetHeader className="text-left">
                        <SheetTitle className="flex flex-col gap-2">
                        
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Explora por categorías
                            </span>
                        </SheetTitle>
                    </SheetHeader>
                </div>

                {/* Scrollable Content */}
                <ScrollArea className="flex-1 px-6 py-4">
                    <div className="space-y-1 pb-4">
                        {rootCategories.map((parent) => {
                            const subcategories = grouped[parent._id] || [];
                            const hasSub = subcategories.length > 0;

                            return (
                                <div key={parent._id} className="border-b border-gray-50 last:border-0 py-1">
                                    <details className="group">
                                        <summary className="cursor-pointer list-none flex items-center justify-between text-[15px] font-medium text-gray-800 py-3 px-2 rounded-md hover:bg-gray-50 transition-colors select-none">
                                            <span>{parent.nombre}</span>
                                            {hasSub && (
                                                <ChevronRight className="h-4 w-4 text-gray-400 group-open:rotate-90 transition-transform duration-200" />
                                            )}
                                        </summary>

                                        {hasSub && (
                                            <div className="pl-4 pr-2 pb-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                                                {subcategories.map((subcategory) => (
                                                    <Link
                                                        key={subcategory._id}
                                                        href={`/productos?category=${subcategory.slug}`}
                                                        className="block text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md transition-colors"
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
                </ScrollArea>

                {/* Footer */}
                <div className="mt-auto border-t border-gray-100 bg-gray-50 p-6">
                    <Link
                        href="/auth/registro"
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition shadow-sm"
                    >
                        <User className="h-4 w-4" />
                        Iniciar sesión
                    </Link>
                </div>
            </SheetContent>
        </Sheet>
    );
}