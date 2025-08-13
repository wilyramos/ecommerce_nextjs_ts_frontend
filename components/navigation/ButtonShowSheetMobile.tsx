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
import { categoriasEstaticas } from "@/src/data/categorias";
import ButtonSearchFormStore from "../ui/ButtonSearchFormStore";
import { ScrollArea } from "../ui/scroll-area";
import Logo from "../ui/Logo";

export default function ButtonShowSheetMobile() {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="p-2 text-gray-700 hover:text-indigo-600 transition">
                    {open ? <X size={22} /> : <Menu size={22} />}
                </button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[320px] px-4 py-5 bg-white shadow-xl border-r border-gray-200">
                {/* Encabezado con Logo y subtítulo */}
                <div className="pb-4 border-b border-gray-200 mb-2">
                    <SheetHeader>
                        <SheetTitle className="text-xl font-bold text-gray-900 flex flex-col gap-2">
                            <Logo />
                            <p className="text-start text-sm font-normal text-gray-500">
                                Explora por <span className="text-black uppercase font-bold">categorías</span>
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
                        {categoriasEstaticas.map((cat) => (
                            <div key={cat.slug}>
                                <details className="group">
                                    <summary className="cursor-pointer list-none flex items-center text-base font-semibold text-gray-900 hover:text-indigo-600 transition-all px-1 py-2 hover:bg-gray-50 rounded-md gap-2">
                                        <cat.icon size={18} className="" />

                                        <span className="text-black">{cat.name}</span>
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
                                                    className="flex items-center gap-2 text-sm text-gray-800 hover:text-indigo-600 transition-all py-1 px-2 hover:bg-indigo-50 rounded-md"
                                                >
                                                    <PiCaretRightBold className="text-gray-500" size={14} />
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
