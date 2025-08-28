// ✅ ComprasFilters.tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useDebouncedCallback } from "use-debounce";

export default function ComprasFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [filters, setFilters] = useState({
        numeroCompra: searchParams.get("numeroCompra") || "",
        proveedor: searchParams.get("proveedor") || "",
        fecha: searchParams.get("fecha") || "",
        total: searchParams.get("total") || "",
    });

    const handleFilterChange = useDebouncedCallback(() => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value.trim()) {
                params.set(key, value);
            }
        });

        router.push(`${pathname}?${params.toString()}`);
    }, 400);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if ((name === "numeroCompra" || name === "total") && !/^\d*$/.test(value)) {
            return;
        };

        setFilters((prev) => ({ ...prev, [name]: value }));
        handleFilterChange();
    };

    const handleClearFilters = () => {
        setFilters({
            numeroCompra: "",
            proveedor: "",
            fecha: "",
            total: "",
        });
        router.push(pathname); // 🔥 Resetea la URL sin query params
    };

    return (
        <tr className="bg-white border-b">
            {/* Campo N° de compra */}
            <td className="p-2">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        name="numeroCompra"
                        value={filters.numeroCompra}
                        onChange={handleChange}
                        placeholder="N° de compra"
                        className="w-full pl-8 pr-3 py-2 text-md font-semibold placeholder-gray-800 focus:outline-none border-b-4 focus:border-rose-600"
                    />
                    <FiSearch className="absolute left-2 text-gray-400" />
                </div>
            </td>
            {/* Campo Proveedor */}
            <td className="p-2">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        name="proveedor"
                        value={filters.proveedor}
                        onChange={handleChange}
                        placeholder="Buscar proveedor"
                        className="w-full pl-8 pr-3 py-2 text-md font-semibold placeholder-gray-800 focus:outline-none border-b-4 focus:border-rose-600"
                    />
                    <FiSearch className="absolute left-2 text-gray-400" />
                </div>
            </td>
            {/* Campo Fecha */}
            <td className="p-2">
                <input
                    type="date"
                    name="fecha"
                    value={filters.fecha}
                    onChange={handleChange}
                    className="w-full pl-8 pr-3 py-2 text-md font-semibold placeholder-gray-800 focus:outline-none border-b-4 focus:border-rose-600"
                />
            </td>
            {/* Campo Total */}
            <td className="p-2">
                <div className="relative flex items-center">
                    <div className="w-full pl-8 text-md font-bold border-b-4 py-2">
                        Total
                    </div>
                    {/* <FiSearch className="absolute left-2 text-gray-400" /> */}
                </div>
            </td>
            {/* Botón limpiar */}
            <td className="p-2 text-center">
                <button
                    onClick={handleClearFilters}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded flex items-center gap-1"
                >
                    <FiX /> Limpiar
                </button>
            </td>
        </tr>
    );
}
