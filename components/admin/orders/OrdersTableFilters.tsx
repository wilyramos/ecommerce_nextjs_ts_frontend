"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { FiSearch, FiCalendar, FiCreditCard, FiTruck } from "react-icons/fi";

export default function OrdersTableFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState({
        pedido: searchParams.get("pedido") || "",
        fecha: searchParams.get("fecha") || "",
        estadoPago: searchParams.get("estadoPago") || "",
        estadoEnvio: searchParams.get("estadoEnvio") || "",
    });

    const handleFilterChange = useDebouncedCallback(() => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value.trim()) {
                params.set(key, value);
            }
        });

        router.push(`/admin/orders?${params.toString()}`);
    }, 400);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
        handleFilterChange();
    };

    const handleClearFilters = () => {
        setFilters({
            pedido: "",
            fecha: "",
            estadoPago: "",
            estadoEnvio: "",
        });
        router.push("/admin/orders");
    };

    return (
        <div className="overflow-x-auto">
            <div className=" mb-4">
                <button
                    onClick={handleClearFilters}
                    className="text-sm text-red-600 hover:underline"
                >
                    Limpiar Filtros
                </button>
            </div>
            <table className="min-w-full text-sm">
                <thead>
                    <tr className="text-gray-700">
                        {/* Pedido */}
                        <th className="px-6 py-2 text-left">
                            <div className="relative">
                                <FiSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="pedido"
                                    placeholder="Pedido"
                                    value={filters.pedido}
                                    onChange={handleChange}
                                    className="w-full pl-8 pr-2 py-1 border-b-2 bg-white focus:outline-none focus:border-gray-800"
                                />
                            </div>
                        </th>

                        {/* Fecha */}
                        <th className="px-6 py-2 text-left hidden md:table-cell">
                            <div className="relative">
                                <FiCalendar className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="date"
                                    name="fecha"
                                    value={filters.fecha}
                                    onChange={handleChange}
                                    className="w-full pl-8 pr-2 py-1 border-b-2 bg-white focus:outline-none focus:border-gray-800"
                                />
                            </div>
                        </th>

                        {/* Estado de Pago */}
                        <th className="px-6 py-2 text-left hidden md:table-cell">
                            <div className="relative">
                                <FiCreditCard className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                                <select
                                    name="estadoPago"
                                    value={filters.estadoPago}
                                    onChange={handleChange}
                                    className="w-full pl-8 pr-2 py-1 border-b-2 bg-white focus:outline-none focus:border-gray-800"
                                >
                                    <option value="">Estado de Pago</option>
                                    <option value="pending">Pendiente</option>
                                    <option value="approved">Aprobado</option>
                                    <option value="rejected">Rechazado</option>
                                    <option value="refunded">Reembolsado</option>
                                </select>
                            </div>
                        </th>

                        {/* Estado de Envío */}
                        <th className="px-6 py-2 text-left hidden lg:table-cell">
                            <div className="relative">
                                <FiTruck className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                                <select
                                    name="estadoEnvio"
                                    value={filters.estadoEnvio}
                                    onChange={handleChange}
                                    className="w-full pl-8 pr-2 py-1 border-b-2 bg-white focus:outline-none focus:border-gray-800"
                                >
                                    <option value="">Estado de Envío</option>
                                    
                                    <option value="PENDIENTE">Pendiente</option>
                                    <option value="PROCESANDO">
                                        Procesando
                                    </option>
                                    <option value="ENVIADO">Enviado</option>
                                    <option value="ENTREGADO">Entregado</option>
                                    <option value="CANCELADO">Cancelado</option>

                                </select>
                            </div>
                        </th>

                        {/* Columnas vacías para alinear */}
                        <th className="px-6 py-2" />
                        <th className="px-6 py-2" />
                    </tr>
                </thead>
            </table>
        </div>
    );
}
