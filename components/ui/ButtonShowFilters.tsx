"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { RiFilter3Line } from "react-icons/ri";

interface Props {
    categorySlug: string;
}

export default function ButtonShowFilters({ categorySlug }: Props) {

    console.log("ButtonShowFilters categorySlug:", categorySlug);

    const [isOpen, setIsOpen] = useState(false);

    return (

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="cursor-pointer hover:text-blue-800 transition">
                <RiFilter3Line className="h-6 w-6" />
            </SheetTrigger>

            <SheetContent className="sm:max-w-[450px] px-6 py-5 bg-gray-50 border-l border-gray-200 shadow-2xl rounded-lg">
                <SheetHeader>
                    <SheetTitle className="text-xl font-semibold text-gray-900">
                        Filtros de Productos
                    </SheetTitle>

                    <SheetDescription className="text-xs text-gray-500">
                        Ajusta los filtros para encontrar los productos que buscas.
                    </SheetDescription>

                </SheetHeader>

            </SheetContent>
        </Sheet>
    );
}
