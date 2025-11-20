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

        const key = parentId ?? "root";
        if (!acc[key]) acc[key] = [];
        acc[key].push(category);
        return acc;
    }, {} as Record<string, CategoryListResponse>);

    const rootCategories = grouped["root"] || [];

    const handleToggle = () => setOpen(!open);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="flex items-center gap-1 transition hover:bg-gray-100 rounded-md px-2 py-1 cursor-pointer font-semibold">
                    <RiMenu2Line size={22} />
                    Categorías
                </button>
            </SheetTrigger>

            <SheetContent
                side="left"
                className="w-[340px] px-5 py-6 bg-white shadow-xl border-r rounded-r-2xl"
            >
                <div className="pb-4 border-b mb-4">
                    <SheetHeader>
                        <SheetTitle className="text-lg font-semibold flex justify-between items-center">
                            <div className="text-center">
                                <Logo />
                            </div>
                            {/* <span className="uppercase font-bold">categorías</span> */}
                        </SheetTitle>
                    </SheetHeader>
                </div>

                <ScrollArea className="h-[calc(100vh-140px)] pr-2">
                    <div className="space-y-4">
                        {rootCategories.map((cat) => {
                            const subcategories = grouped[cat._id] || [];

                            return (
                                <div key={cat._id}>
                                    <details className="group">
                                        <summary className="cursor-pointer list-none flex items-center justify-between px-3 py-2 rounded-lg font-medium text-gray-800 transition hover:bg-gray-100">
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
                                                        className="block px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-black transition"
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
