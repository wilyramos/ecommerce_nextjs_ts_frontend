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
            if (value.trim()) params.set(key, value);
        });

        router.push(`/admin/orders?${params.toString()}`);
    }, 400);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
        handleFilterChange();
    };

    const handleClearFilters = () => {
        setFilters({ pedido: "", fecha: "", estadoPago: "", estadoEnvio: "" });
        router.push("/admin/orders");
    };

    return (
        <div className="w-full p-3 ">
            {/* Botón limpiar */}
            <div className="mb-3 flex justify-end">
                <button
                    onClick={handleClearFilters}
                    className="text-sm text-red-600 hover:underline"
                >
                    Limpiar Filtros
                </button>
            </div>

            {/* Filtros Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Pedido */}
                <div className="relative">
                    <FiSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        name="pedido"
                        placeholder="Pedido"
                        value={filters.pedido}
                        onChange={handleChange}
                        className="w-full pl-8 pr-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Fecha */}
                <div className="relative">
                    <FiCalendar className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="date"
                        name="fecha"
                        value={filters.fecha}
                        onChange={handleChange}
                        className="w-full pl-8 pr-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Estado de Pago */}
                <div className="relative">
                    <FiCreditCard className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                        name="estadoPago"
                        value={filters.estadoPago}
                        onChange={handleChange}
                        className="w-full pl-8 pr-2 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Estado de Pago</option>
                        <option value="pending">Pendiente</option>
                        <option value="approved">Aprobado</option>
                        <option value="rejected">Rechazado</option>
                        <option value="refunded">Reembolsado</option>
                    </select>
                </div>

                {/* Estado de Envío */}
                <div className="relative">
                    <FiTruck className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                        name="estadoEnvio"
                        value={filters.estadoEnvio}
                        onChange={handleChange}
                        className="w-full pl-8 pr-2 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Estado de Envío</option>
                        <option value="awaiting_payment">Pendiente</option>
                        <option value="processing">Procesando</option>
                        <option value="shipped">Enviado</option>
                        <option value="delivered">Entregado</option>
                        <option value="canceled">Cancelado</option>
                        <option value="paid_but_out_of_stock">Sin stock</option>
                    </select>
                </div>
            </div>
        </div>
    );
}