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
import { FaBars, FaUser } from "react-icons/fa";
import ButtonSearchFormStore from "../ui/ButtonSearchFormStore";
import  Hamburger  from "hamburger-react";

export default function ButtonShowSheetMobile() {
    const [open, setOpen] = useState(false);

    const categorias = [
        {
            name: "Celulares",
            subcategorias: [
                { slug: "iphone", name: "iPhone" },
                { slug: "samsung", name: "Samsung" },
                { slug: "xiaomi", name: "Xiaomi" },
                { slug: "oppo", name: "Oppo" },
            ],
        },
        {
            name: "Accesorios",
            subcategorias: [
                { slug: "cargadores-y-cables", name: "Cargadores y Cables" },
                { slug: "fundas-y-carcasas", name: "Fundas y Carcasas" },
                { slug: "audifonos-y-auriculares", name: "Audífonos y Auriculares" },
            ],
        },
    ];

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="p-2 text-gray-700 hover:text-indigo-600 transition">
                    {/* <FaBars className="h-6 w-6" /> */}
                    <Hamburger toggled={open} toggle={setOpen} size={22}/>
                </button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[300px] px-4 py-5 bg-white">
                {/* Encabezado */}
                <div className="pb-4 border-b border-gray-200">
                    <SheetHeader>
                        <SheetTitle className="text-lg font-semibold text-gray-800">
                            Menú
                        </SheetTitle>
                    </SheetHeader>
                </div>

                {/* Buscador */}
                <div className="py-4 border-b border-gray-200">
                    <ButtonSearchFormStore />
                </div>

                {/* Login */}
                <div className="py-4 border-b border-gray-200">
                    <Link
                        href="/auth/registro"
                        className="flex items-center gap-2 text-sm text-gray-950 hover:text-gray-800s transition"
                        onClick={() => setOpen(false)}
                    >
                        <FaUser className="h-4 w-4" />
                        Iniciar sesión
                    </Link>
                </div>

                {/* Categorías */}
                <div className="pt-4 space-y-6">
                    {categorias.map((cat) => (
                        <div key={cat.name}>
                            <p className="font-medium text-gray-700 mb-1">{cat.name}</p>
                            <ul className="space-y-1 pl-2">
                                {cat.subcategorias.map((sub) => (
                                    <li key={sub.slug}>
                                        <Link
                                            href={`/productos/${sub.slug}`}
                                            className="text-sm text-gray-600 hover:text-indigo-600 transition"
                                            onClick={() => setOpen(false)}
                                        >
                                            {sub.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
}
