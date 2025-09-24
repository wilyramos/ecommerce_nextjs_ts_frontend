// File: components/store/ClientCategorias.tsx
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


export default function ClientCategorias({ categories }: { categories: CategoryResponse[] }) {
    const [open, setOpen] = useState(false);


    console.log(categories);
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
                <button className="hover:text-indigo-600 transition flex items-center gap-1 cursor-pointer text-black font-semibold">
                    <RiMenu2Line size={20} />
                    Categorías
                </button>
            </SheetTrigger>

            <SheetContent
                side="left"
                className="w-[320px] px-4 py-5 bg-white shadow-xl border-r border-gray-200"
            >
                {/* Encabezado */}
                <div className="pb-4 border-b border-gray-200 mb-2">
                    <SheetHeader>
                        <SheetTitle className="text-lg font-medium text-gray-600">
                            Explora por{" "}
                            <span className="text-black uppercase font-bold">categorías</span>
                        </SheetTitle>
                    </SheetHeader>
                </div>

                {/* Lista de categorías */}
                <ScrollArea className="h-[calc(100vh-120px)] pr-2">
                    <div className="space-y-5">
                        {rootCategories.map((cat) => {
                            const subcategories = grouped[cat._id] || [];
                            return (
                                <div key={cat._id}>
                                    <details className="group">
                                        <summary className="cursor-pointer list-none flex items-center justify-between text-base font-semibold px-2 py-2 rounded-lg transition-colors duration-200 hover:text-indigo-600 hover:bg-indigo-50">
                                            <span className="flex items-center gap-2">
                                                <span className="text-gray-700 font-medium">{cat.nombre}</span>
                                            </span>
                                            <PiCaretRightBold
                                                size={16}
                                                className="text-gray-400 transition-transform group-open:rotate-90 group-hover:text-indigo-600"
                                            />
                                        </summary>

                                        <ul className="pl-4 mt-2 space-y-1">
                                            {subcategories.map((sub) => (
                                                <li key={sub._id}>
                                                    <Link
                                                        href={`/categoria/${sub._id}`}
                                                        className="block text-sm text-gray-600 hover:text-indigo-600"
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