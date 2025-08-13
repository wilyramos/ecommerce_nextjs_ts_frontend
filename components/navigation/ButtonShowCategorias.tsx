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
import { RiMenu2Line } from "react-icons/ri";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ButtonShowCategorias() {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="hover:text-indigo-00 transition flex items-center  gap-1 cursor-pointer text-gray-700 font-semibold ">
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
                            Explora por <span className=" text-black uppercase font-bold">categorías</span>
                        </SheetTitle>
                    </SheetHeader>
                </div>

                {/* Categorías con scroll */}
                <ScrollArea className="h-[calc(100vh-120px)] pr-2">
                    <div className="space-y-5">
                        {categoriasEstaticas.map((cat) => (
                            <div key={cat.slug}>
                                <details className="group">
                                    <summary className="cursor-pointer list-none flex items-center justify-between text-base font-semibold px-2 py-2 rounded-lg transition-colors duration-200 hover:text-indigo-600 hover:bg-indigo-50">
                                        <span className="flex items-center gap-2">
                                            <cat.icon size={18} className="" />
                                            <span className="text-gray-700 font-medium">{cat.name}</span>
                                        </span>
                                        <PiCaretRightBold
                                            size={16}
                                            className="text-gray-400 transition-transform group-open:rotate-90 group-hover:text-indigo-600"
                                        />
                                    </summary>

                                    <ul className="pl-4 mt-2 space-y-1">
                                        {cat.subcategorias.map((sub) => (
                                            <li key={sub.slug}>
                                                <Link
                                                    href={`/categoria/${sub.slug}`}
                                                    onClick={() => setOpen(false)}
                                                    className="flex items-center gap-2 text-sm text-gray-600 transition-colors duration-200 hover:text-indigo-600"
                                                >
                                                    <PiCaretRightBold className="text-gray-300 group-hover:text-indigo-500 transition-colors" size={14} />
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
