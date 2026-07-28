// File: components/admin/orders/OrderFiltersV2.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition, useCallback } from "react";
import { useDebounce } from "use-debounce";
import { DateRange, type Range, type RangeKeyDict } from "react-date-range";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader2, Search, Filter, RotateCcw, Calendar as CalendarIcon } from "lucide-react";
import { ORDER_STATUS_LABELS } from "@/src/schemas/order.schema";

// Estilos obligatorios de react-date-range
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface Props {
    filters: {
        status?: string;
        email?: string;
        from?: string;
        to?: string;
    };
}

// Helpers para manejo de fechas
function parseLocalDate(dateStr?: string): Date | undefined {
    if (!dateStr) return undefined;
    const [year, month, day] = dateStr.split("-").map(Number);
    if (!year || !month || !day) return undefined;
    return new Date(year, month - 1, day);
}

function formatDateToString(date?: Date): string {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function getDefaultStartDate(): Date {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d;
}

export default function OrderFiltersV2({ filters }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // 1. Estado local del email + Debounce de 400ms
    const [email, setEmail] = useState(filters.email ?? "");
    const [debouncedEmail] = useDebounce(email, 400);

    const [status, setStatus] = useState(filters.status ?? "ALL");

    // 2. Estado inicial de fechas (por defecto: últimos 7 días)
    const initialStartDate = parseLocalDate(filters.from) ?? getDefaultStartDate();
    const initialEndDate = parseLocalDate(filters.to) ?? new Date();

    const [dateRange, setDateRange] = useState<Range[]>([
        {
            startDate: initialStartDate,
            endDate: initialEndDate,
            key: "selection",
        },
    ]);

    // Helper para sincronizar la URL con los parámetros de búsqueda
    const updateQueryParams = useCallback(
        (targetEmail: string, targetStatus: string, targetStart?: Date, targetEnd?: Date) => {
            const fromStr = formatDateToString(targetStart);
            const toStr = formatDateToString(targetEnd);

            startTransition(() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("page", "1");

                if (targetEmail.trim()) params.set("email", targetEmail.trim()); else params.delete("email");
                if (targetStatus !== "ALL") params.set("status", targetStatus); else params.delete("status");
                if (fromStr) params.set("from", fromStr); else params.delete("from");
                if (toStr) params.set("to", toStr); else params.delete("to");

                router.push(`/admin/orders-v2?${params.toString()}`);
            });
        },
        [router, searchParams]
    );

    // 3. Reactividad al cambiar el valor del email ya debouncado
    useEffect(() => {
        if (debouncedEmail !== (filters.email ?? "")) {
            updateQueryParams(debouncedEmail, status, dateRange[0]?.startDate, dateRange[0]?.endDate);
        }
    }, [debouncedEmail, status, dateRange, filters.email, updateQueryParams]);

    // 4. Reactividad inmediata en el Select de Estado Logístico
    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        updateQueryParams(debouncedEmail, newStatus, dateRange[0]?.startDate, dateRange[0]?.endDate);
    };

    // 5. Reactividad inmediata en la selección de Rango de Fechas
    const handleDateRangeChange = (ranges: RangeKeyDict) => {
        if (ranges.selection) {
            const newRange = [ranges.selection];
            setDateRange(newRange);

            if (ranges.selection.startDate && ranges.selection.endDate) {
                updateQueryParams(
                    debouncedEmail,
                    status,
                    ranges.selection.startDate,
                    ranges.selection.endDate
                );
            }
        }
    };

    // 6. Resetear filtros al valor inicial de 7 días
    const handleClear = () => {
        const defaultStart = getDefaultStartDate();
        const defaultEnd = new Date();

        setEmail("");
        setStatus("ALL");
        setDateRange([
            {
                startDate: defaultStart,
                endDate: defaultEnd,
                key: "selection",
            },
        ]);

        const params = new URLSearchParams();
        params.set("from", formatDateToString(defaultStart));
        params.set("to", formatDateToString(defaultEnd));

        startTransition(() => {
            router.push(`/admin/orders-v2?${params.toString()}`);
        });
    };

    const startDate = dateRange[0]?.startDate;
    const endDate = dateRange[0]?.endDate;

    const hasActiveFilters = Boolean(
        email || 
        (status && status !== "ALL")
    );

    const getDateRangeLabel = () => {
        if (!startDate || !endDate) return "Seleccionar rango de fechas";
        
        const formatOptions: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
        const startStr = startDate.toLocaleDateString("es-PE", formatOptions);
        const endStr = endDate.toLocaleDateString("es-PE", { ...formatOptions, year: "numeric" });

        return `${startStr} - ${endStr}`;
    };

    return (
        <div className="bg-card border border-border p-3.5 rounded-lg shadow-sm space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
                
                {/* Búsqueda por Email (Con useDebounce) */}
                <div className="space-y-1.5 lg:col-span-5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <Search className="w-3 h-3" /> Cliente / Email
                    </label>
                    <div className="relative">
                        <Input 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            placeholder="Buscar por correo electrónico..." 
                            className="h-9 text-xs pl-8 pr-8 bg-background" 
                        />
                        <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                        {isPending && (
                            <Loader2 className="w-3.5 h-3.5 absolute right-2.5 top-2.5 animate-spin text-muted-foreground" />
                        )}
                    </div>
                </div>

                {/* Estado Logístico */}
                <div className="space-y-1.5 lg:col-span-3">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <Filter className="w-3 h-3" /> Estado Logístico
                    </label>
                    <Select value={status} onValueChange={handleStatusChange}>
                        <SelectTrigger className="h-9 text-xs bg-background">
                            <SelectValue placeholder="Todos los estados" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Todos los estados</SelectItem>
                            <SelectItem value="awaiting_payment">{ORDER_STATUS_LABELS.awaiting_payment}</SelectItem>
                            <SelectItem value="processing">{ORDER_STATUS_LABELS.processing}</SelectItem>
                            <SelectItem value="shipped">{ORDER_STATUS_LABELS.shipped}</SelectItem>
                            <SelectItem value="delivered">{ORDER_STATUS_LABELS.delivered}</SelectItem>
                            <SelectItem value="canceled">{ORDER_STATUS_LABELS.canceled}</SelectItem>
                            <SelectItem value="paid_but_out_of_stock">{ORDER_STATUS_LABELS.paid_but_out_of_stock}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Rango de Fechas (Popover) */}
                <div className="space-y-1.5 lg:col-span-4">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" /> Período
                    </label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full h-9 justify-start text-xs font-normal bg-background hover:bg-muted/50"
                            >
                                <CalendarIcon className="mr-2 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                <span className="text-foreground font-medium truncate">
                                    {getDateRangeLabel()}
                                </span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border border-border shadow-lg" align="end">
                            <DateRange
                                editableDateInputs={true}
                                onChange={handleDateRangeChange}
                                moveRangeOnFirstSelection={false}
                                ranges={dateRange}
                                months={1}
                                direction="horizontal"
                                rangeColors={["var(--primary, #0f172a)"]}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

            </div>

            {/* Barra Inferior */}
            <div className="flex items-center justify-between pt-2 border-t border-border/40">
                <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground">
                        Filtrando por rango: <strong className="text-foreground font-semibold">{getDateRangeLabel()}</strong>
                    </span>
                    {isPending && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground animate-pulse">
                            <Loader2 className="w-3 h-3 animate-spin" /> Actualizando...
                        </span>
                    )}
                </div>

                {hasActiveFilters && (
                    <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={handleClear} 
                        size="sm"
                        className="h-7 text-xs text-muted-foreground hover:text-foreground px-2"
                    >
                        <RotateCcw className="w-3 h-3 mr-1" /> Resetear filtros
                    </Button>
                )}
            </div>
        </div>
    );
}