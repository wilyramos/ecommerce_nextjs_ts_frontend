"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import Hamburger from "hamburger-react";
import { useState } from "react";
import Link from "next/link";
import { categoriasEstaticas } from "@/src/data/categorias";
import { PiCaretRightBold } from "react-icons/pi";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ButtonShowCategorias() {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen} >
            <SheetTrigger asChild>
                <button className="text-gray-700 hover:text-blue-800 transition flex items-center cursor-pointer font-extrabold leading-relaxed">
                    <Hamburger toggled={open} toggle={setOpen} size={28} />
                    Categorias
                </button>
            </SheetTrigger>

            <SheetContent

                side="left"
                className="w-[320px] px-4 py-5 bg-white shadow-xl border-r border-gray-200"

            >
                {/* Encabezado */}
                <div className="pb-4 border-b border-gray-200 mb-2">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-bold text-gray-700 flex  flex-col items-center gap-2 ">
                            <p className="">
                                Explora por <span className="text-blue-800">categorías</span>
                            </p>
                        </SheetTitle>
                    </SheetHeader>
                </div>

                {/* Categorías con scroll */}
                <ScrollArea className="h-[calc(100vh-120px)] pr-2">
                    <div className="space-y-5">
                        {categoriasEstaticas.map((cat) => (
                            <div key={cat.slug}>
                                <details className="group">
                                    <summary className="cursor-pointer list-none flex items-center justify-between text-base font-semibold text-gray-900 hover:text-gray-100 transition-all px-1 py-2 hover:bg-blue-800 rounded-md">
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
