// components/store/ButtonShowSheetMobile.tsx
"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { FaUser } from "react-icons/fa";
import { PiCaretRightBold } from "react-icons/pi";
import ButtonSearchFormStore from "../ui/ButtonSearchFormStore";
import { ScrollArea } from "../ui/scroll-area";
import Logo from "../ui/Logo";
import type { CategoryListResponse, CategoryResponse } from "@/src/schemas";


interface ButtonShowSheetMobileProps {
    categories: CategoryResponse[];
}

export default function ButtonShowSheetMobile({
    categories,
}: ButtonShowSheetMobileProps) {
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

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="p-2 text-gray-700 hover:text-indigo-600 transition">
                    {open ? <X size={22} /> : <Menu size={22} />}
                </button>
            </SheetTrigger>

            <SheetContent
                side="left"
                className="w-[320px] px-4 py-5 bg-white shadow-xl border-r border-gray-200"
            >
                {/* Encabezado con Logo y subtítulo */}
                <div className="pb-4 border-b border-gray-200 mb-2">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-bold text-gray-900 flex flex-col gap-2">
                            <Logo />
                            <p className="text-start text-sm font-normal text-gray-500">
                                Explora por{" "}
                                <span className="text-black uppercase font-bold">categorías</span>
                            </p>
                        </SheetTitle>
                    </SheetHeader>
                </div>

                {/* Scrollable Area */}
                <ScrollArea className="h-[calc(100vh-120px)] pr-2">
                    {/* Buscador */}
                    <div className="py-4 border-b border-gray-200">
                        <ButtonSearchFormStore />
                    </div>

                    {/* Login */}
                    <div className="py-4 border-b border-gray-200">
                        <Link
                            href="/auth/registro"
                            className="flex items-center gap-2 text-sm text-gray-950 hover:text-indigo-600 transition"
                            onClick={() => setOpen(false)}
                        >
                            <FaUser className="h-4 w-4" />
                            Iniciar sesión
                        </Link>
                    </div>

                    {/* Categorías con acordeón */}
                    <div className="pt-4 space-y-5">
                        {rootCategories.map((parent) => {
                            const subcategories = grouped[parent._id] || [];
                            return (
                                <div key={parent._id}>
                                    <details className="group">
                                        <summary className="cursor-pointer list-none flex items-center justify-between text-base font-semibold px-2 py-2 rounded-lg transition-colors duration-200 hover:text-indigo-600 hover:bg-indigo-50">
                                            <span className="flex items-center gap-2">
                                                <span className="text-gray-700 font-medium">
                                                    {parent.nombre}
                                                </span>
                                            </span>
                                            <PiCaretRightBold className="h-4 w-4 text-gray-400 group-open:rotate-90 transition-transform" />
                                        </summary>
                                        <div className="pl-6 space-y-2">
                                            {subcategories.map((subcategory) => (
                                                <Link
                                                    key={subcategory._id}
                                                    href={`/categoria/${subcategory.slug}`}
                                                    className="block text-sm text-gray-600 hover:text-indigo-600 transition"
                                                    onClick={() => setOpen(false)}
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
            </SheetContent>
        </Sheet>
    );
}
