// File: frontend/components/admin/orders/OrdersTableFilters.tsx

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import { FiSearch, FiCalendar, FiCreditCard, FiTruck, FiDollarSign } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { DateRange, Range, RangeKeyDict } from "react-date-range";
import { es } from "date-fns/locale";
import { format } from "date-fns";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function OrdersTableFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [filters, setFilters] = useState({
        pedido: searchParams.get("pedido") || "",
        fecha: searchParams.get("fecha") || "",
        fechaFin: searchParams.get("fechaFin") || "",
        estadoPago: searchParams.get("estadoPago") || "ALL",
        estadoEnvio: searchParams.get("estadoEnvio") || "ALL",
        montoMin: searchParams.get("montoMin") || "",
        montoMax: searchParams.get("montoMax") || "",
    });

    const [dateRange, setDateRange] = useState<Range[]>([
        {
            startDate: filters.fecha ? new Date(filters.fecha) : undefined,
            endDate: filters.fechaFin ? new Date(filters.fechaFin) : undefined,
            key: "selection",
        },
    ]);

    const triggerUrlUpdate = useDebouncedCallback((currentFilters) => {
        const params = new URLSearchParams();
        params.set("page", "1");

        Object.entries(currentFilters).forEach(([key, value]) => {
            const strValue = String(value).trim();
            if (strValue !== "" && strValue !== "ALL") {
                params.set(key, strValue);
            }
        });

        startTransition(() => {
            router.push(`/admin/orders?${params.toString()}`);
        });
    }, 400);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updated = { ...filters, [name]: value };
        setFilters(updated);
        triggerUrlUpdate(updated);
    };

    const handleDateRangeChange = (item: RangeKeyDict) => {
        const { startDate, endDate } = item.selection;
        setDateRange([item.selection]);

        const formattedStart = startDate ? format(startDate, "yyyy-MM-dd") : "";
        const formattedEnd = endDate ? format(endDate, "yyyy-MM-dd") : "";

        const updated = {
            ...filters,
            fecha: formattedStart,
            fechaFin: formattedEnd,
        };
        setFilters(updated);
        triggerUrlUpdate(updated);
    };

    const handleSelectValueChange = (name: "estadoPago" | "estadoEnvio", value: string) => {
        const updated = { ...filters, [name]: value };
        setFilters(updated);

        const params = new URLSearchParams();
        params.set("page", "1");

        Object.entries(updated).forEach(([key, val]) => {
            const strVal = String(val).trim();
            if (strVal !== "" && strVal !== "ALL") {
                params.set(key, strVal);
            }
        });

        startTransition(() => {
            router.push(`/admin/orders?${params.toString()}`);
        });
    };

    const handleClearFilters = () => {
        setFilters({
            pedido: "",
            fecha: "",
            fechaFin: "",
            estadoPago: "ALL",
            estadoEnvio: "ALL",
            montoMin: "",
            montoMax: "",
        });
        setDateRange([
            {
                startDate: undefined,
                endDate: undefined,
                key: "selection",
            },
        ]);
        startTransition(() => {
            router.push("/admin/orders");
        });
    };

    const hasActiveFilters = Object.entries(filters).some(([key, val]) => {
        const str = String(val).trim();
        if (key === "estadoPago" || key === "estadoEnvio") return str !== "ALL";
        return str !== "";
    });

    const getDateDisplayLabel = () => {
        if (filters.fecha && filters.fechaFin) {
            return `${filters.fecha} al ${filters.fechaFin}`;
        }
        return "Seleccionar rango...";
    };

    return (
        <div className="w-full p-4 bg-card space-y-4 text-card-foreground">
            {hasActiveFilters && (
                <div className="flex justify-end">
                    <button
                        onClick={handleClearFilters}
                        disabled={isPending}
                        className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:bg-background-secondary px-2 py-1 rounded-[var(--radius-sm)] transition-colors cursor-pointer disabled:opacity-50 select-none"
                    >
                        Limpiar Filtros
                    </button>
                </div>
            )}

            <div className="space-y-4">
                {/* Fila 1: ID, Rango de Fechas e Info de Pago */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1.5 relative">
                        <Label htmlFor="pedido">Nº Pedido</Label>
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <Input
                                id="pedido"
                                type="text"
                                name="pedido"
                                placeholder="Buscar número..."
                                value={filters.pedido}
                                onChange={handleInputChange}
                                disabled={isPending}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5 lg:col-span-2">
                        <Label>Rango de Fechas</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    disabled={isPending}
                                    className="w-full justify-start text-left h-10 px-3 pl-9 relative text-xs font-semibold text-foreground border border-input rounded-[var(--radius-sm)] bg-background"
                                >
                                    <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
                                    {getDateDisplayLabel()}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 border border-border bg-card rounded-[var(--radius-md)] shadow-lg overflow-hidden" align="start">
                                <DateRange
                                    locale={es}
                                    ranges={dateRange}
                                    onChange={handleDateRangeChange}
                                    moveRangeOnFirstSelection={false}
                                    rangeColors={["var(--ring)"]}
                                    className="text-xs font-semibold text-foreground bg-card"
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-1.5 relative">
                        <Label>Estado de Pago</Label>
                        <div className="relative">
                            <FiCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none" size={16} />
                            <Select
                                value={filters.estadoPago}
                                onValueChange={(v) => handleSelectValueChange("estadoPago", v)}
                                disabled={isPending}
                            >
                                <SelectTrigger className="pl-9">
                                    <SelectValue placeholder="Estado de Pago" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Todos los estados</SelectItem>
                                    <SelectItem value="pending">Pendiente</SelectItem>
                                    <SelectItem value="approved">Aprobado</SelectItem>
                                    <SelectItem value="rejected">Rechazado</SelectItem>
                                    <SelectItem value="refunded">Reembolsado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Fila 2: Logística y Montos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1.5 relative">
                        <Label>Estado de Envío</Label>
                        <div className="relative">
                            <FiTruck className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none" size={16} />
                            <Select
                                value={filters.estadoEnvio}
                                onValueChange={(v) => handleSelectValueChange("estadoEnvio", v)}
                                disabled={isPending}
                            >
                                <SelectTrigger className="pl-9">
                                    <SelectValue placeholder="Estado de Envío" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">Todos los envíos</SelectItem>
                                    <SelectItem value="awaiting_payment">Pendiente de pago</SelectItem>
                                    <SelectItem value="processing">Procesando</SelectItem>
                                    <SelectItem value="shipped">Enviado</SelectItem>
                                    <SelectItem value="delivered">Entregado</SelectItem>
                                    <SelectItem value="canceled">Cancelado</SelectItem>
                                    <SelectItem value="paid_but_out_of_stock">Sin stock</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-1.5 relative">
                        <Label htmlFor="montoMin">Monto Mínimo</Label>
                        <div className="relative">
                            <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none" size={16} />
                            <input
                                id="montoMin"
                                type="number"
                                name="montoMin"
                                placeholder="0.00"
                                value={filters.montoMin}
                                onChange={handleInputChange}
                                disabled={isPending}
                                min="0"
                                step="0.01"
                                className="w-full pl-9 pr-3 h-10 border border-input rounded-[var(--radius-sm)] bg-background text-foreground text-xs font-semibold focus-visible:outline-hidden focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5 relative">
                        <Label htmlFor="montoMax">Monto Máximo</Label>
                        <div className="relative">
                            <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none" size={16} />
                            <input
                                id="montoMax"
                                type="number"
                                name="montoMax"
                                placeholder="0.00"
                                value={filters.montoMax}
                                onChange={handleInputChange}
                                disabled={isPending}
                                min="0"
                                step="0.01"
                                className="w-full pl-9 pr-3 h-10 border border-input rounded-[var(--radius-sm)] bg-background text-foreground text-xs font-semibold focus-visible:outline-hidden focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring transition-colors"
                            />
                        </div>
                    </div>

                    <div className="hidden lg:block" />
                </div>
            </div>
        </div>
    );
}