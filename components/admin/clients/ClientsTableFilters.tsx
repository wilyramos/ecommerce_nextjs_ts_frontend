"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { FiSearch } from "react-icons/fi";

export default function ClientsTableFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [filters, setFilters] = useState({
        nombre: searchParams.get("nombre") || "",
        email: searchParams.get("email") || "",
        telefono: searchParams.get("telefono") || "",
        numeroDocumento: searchParams.get("numeroDocumento") || "",
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
        setFilters((prev) => ({ ...prev, [name]: value }));
        handleFilterChange();
    };        

    return (
        <tr className="bg-gray-50 py-4 font-bold ">
            <td className="px-2 py-1">
                <div className="relative">
                    <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre"
                        value={filters.nombre}
                        onChange={handleChange}
                        className="pl-8 py-2 w-full text-sm focus:outline-none focus:border-rose-600 focus:border-b-3 placeholder:text-gray-700"
                     />
                    <FiSearch className="absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </td>
            <td className="px-2 py-1">
                <div className="relative">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={filters.email}
                        onChange={handleChange}
                        className="pl-8 py-2 border-b w-full text-sm focus:outline-none focus:border-gray-800 focus:border-b-3 placeholder:text-gray-700"
                     />
                    <FiSearch className="absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </td>
            <td className="px-2 py-1">
                <div className="relative">
                    <input
                        type="tel"
                        name="telefono"
                        placeholder="Teléfono"
                        value={filters.telefono}
                        onChange={handleChange}
                        className="pl-8 py-2 border-b w-full text-sm focus:outline-none focus:border-gray-800 focus:border-b-3 placeholder:text-gray-700"
                     />
                    <FiSearch className="absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </td>
            <td className="px-2 py-1">
                <div className="relative">
                    <input
                        type="text"
                        name="numeroDocumento"
                        placeholder="Documento"
                        value={filters.numeroDocumento}
                        onChange={handleChange}
                        className="pl-8 py-2 border-b w-full text-sm focus:outline-none focus:border-gray-800 focus:border-b-3 placeholder:text-gray-700"
                     />
                    <FiSearch className="absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </td>
        </tr>
    );
}
