"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FiltersReportsSales() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Obtener fechas desde la URL (si existen)
    const searchStart = searchParams.get("startDate");
    const searchEnd = searchParams.get("endDate");

    // Calcular fechas por defecto (últimos 7 días)
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);

    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    const defaultStartDate = formatDate(sevenDaysAgo);
    const defaultEndDate = formatDate(today);

    const [filters, setFilters] = useState({
        startDate: searchStart || defaultStartDate,
        endDate: searchEnd || defaultEndDate,
    });

    // Si no hay fechas en la URL, las seteamos automáticamente
    useEffect(() => {
        if (!searchStart || !searchEnd) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("startDate", defaultStartDate);
            params.set("endDate", defaultEndDate);
            router.replace(`/admin/reports/sales?${params.toString()}`);
        }
    }, []);

    const handleFilterChange = () => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value.trim()) {
                params.set(key, value);
            }
        });
        router.push(`/admin/reports/sales?${params.toString()}`);
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 mb-4 text-xs">
            <div className="flex items-center gap-2">
                <label htmlFor="startDate" className="text-sm">
                    Fecha Inicio:
                </label>
                <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={filters.startDate}
                    onChange={(e) =>
                        setFilters({ ...filters, startDate: e.target.value })
                    }
                    onBlur={handleFilterChange}
                    className="border px-2 py-1"
                />
            </div>
            <div className="flex items-center gap-2">
                <label htmlFor="endDate" className="text-sm">
                    Fecha Fin:
                </label>
                <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={filters.endDate}
                    onChange={(e) =>
                        setFilters({ ...filters, endDate: e.target.value })
                    }
                    onBlur={handleFilterChange}
                    className="border px-2 py-1"
                />
            </div>
        </div>
    );
}
