// File: frontend/components/ui/PaginationBanner.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import Pagination from "./Pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type PaginationBannerProps = {
    currentPage: number;
    totalPages: number;
    limit: number;
    totalItems: number;
    itemsShown: number;
    pathname: string;
    limitOptions?: number[];
};

export default function PaginationBanner({
    currentPage,
    totalPages,
    limit,
    totalItems,
    itemsShown,
    pathname,
    limitOptions = [10, 25, 50, 100],
}: PaginationBannerProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // Calcular rangos exactos de visualización de ítems utilizando itemsShown para asegurar precisión
    const fromItem = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1;
    const toItem = totalItems === 0 ? 0 : fromItem + itemsShown - 1;

    const handleLimitChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        
        params.set("limit", value);
        params.set("page", "1");

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    if (totalItems === 0) return null;

    return (
        <div 
            className={`flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-border w-full transition-opacity ${
                isPending ? "opacity-50 pointer-events-none" : "opacity-100"
            }`}
        >
            {/* Metadata y Selector Custom de Filas */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-600 w-full md:w-auto justify-between md:justify-start">
                <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-normal">Mostrar</span>
                    
                    <Select value={limit.toString()} onValueChange={handleLimitChange}>
                        <SelectTrigger size="sm" className="w-[70px]">
                            <SelectValue placeholder={limit.toString()} />
                        </SelectTrigger>
                        <SelectContent>
                            {limitOptions.map((option) => (
                                <SelectItem key={option} value={option.toString()}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <span className="text-gray-500 font-normal">por página</span>
                </div>
                
                {/* Divisor vertical */}
                <span className="hidden sm:block h-4 w-px bg-gray-300" />

                {/* Contador de elementos */}
                <p className="text-xs text-gray-500 font-normal tracking-wide">
                    <span className="font-semibold text-gray-900">{fromItem}</span> – <span className="font-semibold text-gray-900">{toItem}</span> de <span className="font-semibold text-gray-900">{totalItems}</span> resultados
                </p>
            </div>

            {/* Paginación con botones de números */}
            <div className="flex justify-center md:justify-end w-full md:w-auto">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    limit={limit}
                    pathname={pathname}
                />
            </div>
        </div>
    );
}