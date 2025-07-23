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
import { categoriasEstaticas } from "@/src/data/categorias";
import { PiCaretRightBold } from "react-icons/pi";
import { HiMiniSquares2X2 } from "react-icons/hi2";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ButtonShowCategorias() {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="hover:text-indigo-00 transition flex items-center  gap-1 cursor-pointer text-gray-700 font-semibold ">
                    <HiMiniSquares2X2 size={20} />
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
                        <SheetTitle className="text-lg font-bold text-center">
                            Explora por <span className=" text-indigo-600 uppercase">categorías</span>
                        </SheetTitle>
                    </SheetHeader>
                </div>

                {/* Categorías con scroll */}
                <ScrollArea className="h-[calc(100vh-120px)] pr-2">
                    <div className="space-y-5">
                        {categoriasEstaticas.map((cat) => (
                            <div key={cat.slug}>
                                <details className="group">
                                    <summary className="cursor-pointer list-none flex items-center justify-between text-base font-semibold hover:text-gray-100 transition-all px-2 py-2 hover:bg-blue-800 rounded-xl">
                                        <span>{cat.name}</span>
                                        <PiCaretRightBold
                                            size={16}
                                            className="text-gray-400 transition-transform group-open:rotate-90"
                                        />
                                    </summary>
                                    <ul className="pl-4 mt-2 space-y-1">
                                        {cat.subcategorias.map((sub) => (
                                            <li key={sub.slug}>
                                                <Link
                                                    href={`/categoria/${sub.slug}`}
                                                    onClick={() => setOpen(false)}
                                                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-100 transition-all py-1 px-2 hover:bg-blue-800 rounded-md"
                                                >
                                                    <PiCaretRightBold className="text-gray-300" size={14} />
                                                    {sub.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </details>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
