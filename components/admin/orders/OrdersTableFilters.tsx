"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { FiSearch, FiCalendar, FiCreditCard, FiTruck, FiDollarSign } from "react-icons/fi";
import { Input } from "@/components/ui/input";

export default function OrdersTableFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState({
        pedido: searchParams.get("pedido") || "",
        fecha: searchParams.get("fecha") || "",
        fechaFin: searchParams.get("fechaFin") || "",
        estadoPago: searchParams.get("estadoPago") || "",
        estadoEnvio: searchParams.get("estadoEnvio") || "",
        montoMin: searchParams.get("montoMin") || "",
        montoMax: searchParams.get("montoMax") || "",
    });

    const handleFilterChange = useDebouncedCallback(() => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value.trim() !== "") params.set(key, value);
        });

        router.push(`/admin/orders?${params.toString()}`);
    }, 400);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
        handleFilterChange();
    };

    const handleClearFilters = () => {
        setFilters({
            pedido: "",
            fecha: "",
            fechaFin: "",
            estadoPago: "",
            estadoEnvio: "",
            montoMin: "",
            montoMax: "",
        });
        router.push("/admin/orders");
    };

    const hasActiveFilters = Object.values(filters).some(val => val.trim() !== "");

    return (
        <div className="w-full p-3">
            {/* Botón limpiar */}
            {hasActiveFilters && (
                <div className="mb-3 flex justify-end">
                    <button
                        onClick={handleClearFilters}
                        className="text-sm text-red-600 hover:underline font-medium"
                    >
                        Limpiar Filtros
                    </button>
                </div>
            )}

            {/* Filtros Responsive */}
            <div className="space-y-3">
                {/* Primera fila: Búsqueda y Fechas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Pedido */}
                    <div className="relative">
                        <FiSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            type="text"
                            name="pedido"
                            placeholder="Nº Pedido"
                            value={filters.pedido}
                            onChange={handleChange}
                            className="w-full"
                        />
                        
                       
                    </div>

                    {/* Fecha inicio */}
                    <div className="relative">
                        <FiCalendar className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="date"
                            name="fecha"
                            value={filters.fecha}
                            onChange={handleChange}
                            className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>

                    {/* Fecha fin */}
                    <div className="relative">
                        <FiCalendar className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="date"
                            name="fechaFin"
                            placeholder="Fecha fin"
                            value={filters.fechaFin}
                            onChange={handleChange}
                            disabled={!filters.fecha}
                            className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-50 disabled:text-gray-400"
                        />
                    </div>

                    {/* Estado de Pago */}
                    <div className="relative">
                        <FiCreditCard className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <select
                            name="estadoPago"
                            value={filters.estadoPago}
                            onChange={handleChange}
                            className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Estado de Pago</option>
                            <option value="pending">Pendiente</option>
                            <option value="approved">Aprobado</option>
                            <option value="rejected">Rechazado</option>
                            <option value="refunded">Reembolsado</option>
                        </select>
                    </div>
                </div>

                {/* Segunda fila: Estados y Monto */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Estado de Envío */}
                    <div className="relative">
                        <FiTruck className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <select
                            name="estadoEnvio"
                            value={filters.estadoEnvio}
                            onChange={handleChange}
                            className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Estado de Envío</option>
                            <option value="awaiting_payment">Pendiente de pago</option>
                            <option value="processing">Procesando</option>
                            <option value="shipped">Enviado</option>
                            <option value="delivered">Entregado</option>
                            <option value="canceled">Cancelado</option>
                            <option value="paid_but_out_of_stock">Sin stock</option>
                        </select>
                    </div>

                    {/* Monto mínimo */}
                    <div className="relative">
                        <FiDollarSign className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="number"
                            name="montoMin"
                            placeholder="Monto mín."
                            value={filters.montoMin}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>

                    {/* Monto máximo */}
                    <div className="relative">
                        <FiDollarSign className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="number"
                            name="montoMax"
                            placeholder="Monto máx."
                            value={filters.montoMax}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            className="w-full pl-8 pr-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>

                    <div />
                </div>
            </div>
        </div>
    );
}