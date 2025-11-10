"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PiCaretRightBold } from "react-icons/pi";
import { RiMenu2Line } from "react-icons/ri";
import Link from "next/link";
import { useState } from "react";
import type { CategoryListResponse, CategoryResponse } from "@/src/schemas";
import Logo from "../ui/Logo";

export default function ClientCategorias({ categories }: { categories: CategoryResponse[] }) {
    const [open, setOpen] = useState(false);

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

    const handleToggle = () => {
        setOpen(!open);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors font-medium">
                    <RiMenu2Line size={22} />
                    Categorías
                </button>
            </SheetTrigger>

            <SheetContent
                side="left"
                className="w-[340px] px-5 py-6 bg-white shadow-xl border-r border-gray-200 rounded-r-2xl"
            >
                {/* Encabezado */}
                <div className="pb-4 border-b border-gray-200 mb-4">
                    <SheetHeader>
                        <SheetTitle className="text-lg font-semibold flex justify-between items-center">
                            <div className="items-center text-center">
                                <Logo />
                            </div>
                            <span className="uppercase font-bold text-end justify-end">categorías</span>
                        </SheetTitle>
                    </SheetHeader>
                </div>

                {/* Lista de categorías */}
                <ScrollArea className="h-[calc(100vh-140px)] pr-2">
                    <div className="space-y-4">
                        {rootCategories.map((cat) => {
                            const subcategories = grouped[cat._id] || [];
                            return (
                                <div key={cat._id}>
                                    <details className="group">
                                        <summary className="cursor-pointer list-none flex items-center justify-between px-3 py-2 rounded-lg font-medium text-gray-800 transition-all duration-200 hover:bg-gray-100 hover:text-black">
                                            <span>{cat.nombre}</span>
                                            <PiCaretRightBold
                                                size={18}
                                                className="text-gray-400 transition-transform group-open:rotate-90 group-hover:text-gray-600"
                                            />
                                        </summary>

                                        <ul className="pl-5 mt-2 space-y-1">
                                            {subcategories.map((sub) => (
                                                <li key={sub._id}>
                                                    <Link
                                                        href={`/productos?category=${sub.slug}`}
                                                        className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition-all duration-200"
                                                        onClick={handleToggle}
                                                    >
                                                        {sub.nombre}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </details>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
