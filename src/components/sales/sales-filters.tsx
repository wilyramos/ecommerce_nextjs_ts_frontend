"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { format, isValid, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, Search, X } from "lucide-react";
import { DateRange, Range, RangeKeyDict } from "react-date-range";

// Estilos de la librería
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExportButton } from "./export-button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

/**
 * Helper para obtener fechas seguras desde la URL
 */
const getInitialDate = (param: string | null, defaultDate: Date): Date => {
    if (!param) return defaultDate;
    const parsed = parseISO(param);
    return isValid(parsed) ? parsed : defaultDate;
};

export function SalesFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // 1. Sincronizar estado local con la URL
    const [dateRange, setDateRange] = React.useState<Range[]>([
        {
            startDate: getInitialDate(searchParams.get("startDate"), new Date()),
            endDate: getInitialDate(searchParams.get("endDate"), new Date()),
            key: "selection",
        },
    ]);

    // 2. Manejo de búsqueda de texto
    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", "1");
        if (term) {
            params.set("search", term);
        } else {
            params.delete("search");
        }
        router.replace(`${pathname}?${params.toString()}`);
    };

    // 3. Aplicar Filtro de Fechas a la URL
    const handleDateChange = (ranges: RangeKeyDict) => {
        const { selection } = ranges;
        if (!selection) return;

        setDateRange([selection]);

        const params = new URLSearchParams(searchParams.toString());
        params.set("page", "1");

        if (selection.startDate) {
            params.set("startDate", selection.startDate.toISOString());
        }
        if (selection.endDate) {
            params.set("endDate", selection.endDate.toISOString());
        }

        router.replace(`${pathname}?${params.toString()}`);
    };

    // 4. Limpiar Filtros
    const handleClear = () => {
        const initialRange: Range = {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        };
        setDateRange([initialRange]);
        router.replace(pathname);
    };

    const hasFilters = !!(searchParams.get("search") || searchParams.get("startDate"));

    return (
        <div className="flex flex-col gap-4 bg-bg-secondary p-4 rounded-xs border border-border-default sm:flex-row sm:items-center">

            {/* Grupo de Búsqueda */}
            <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-tertiary group-focus-within:text-accent-warm transition-colors" />
                <Input
                    placeholder="Buscar por ticket, cliente o DNI..."
                    className="pl-10 h-11 bg-bg-primary border-border-default focus-visible:ring-accent-warm text-text-primary placeholder:text-text-tertiary"
                    defaultValue={searchParams.get("search") ?? ""}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            {/* Grupo de Selectores */}
            <div className="flex flex-wrap items-center gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="h-11 justify-start text-left font-normal px-4 border-border-default bg-bg-primary hover:bg-bg-tertiary text-text-primary min-w-[240px]"
                        >
                            <CalendarIcon className="mr-2 size-4 text-accent-warm" />
                            {searchParams.get("startDate") ? (
                                <span className="text-sm">
                                    {format(dateRange[0].startDate!, "dd MMM", { locale: es })} -{" "}
                                    {format(dateRange[0].endDate!, "dd MMM, yyyy", { locale: es })}
                                </span>
                            ) : (
                                <span className="text-text-secondary">Rango de fechas</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-border-default shadow-2xl" align="end">
                        <DateRange
                            ranges={dateRange}
                            onChange={handleDateChange}
                            moveRangeOnFirstSelection={false}
                            months={1}
                            direction="vertical"
                            locale={es}
                            rangeColors={["#F97316"]} // --color-accent-warm
                            className="rounded-lg text-sm"
                            editableDateInputs={true}
                        />
                    </PopoverContent>
                </Popover>

                {hasFilters && (
                    <Button
                        variant="ghost"
                        onClick={handleClear}
                        className="h-11 px-3 text-accent-warm hover:bg-accent-warm-light"
                    >
                        <X className="size-4 mr-2" />
                        Limpiar
                    </Button>
                )}

                <div className="h-8 w-px bg-border-default mx-1 hidden sm:block" />

                <ExportButton />
            </div>
        </div>
    );
}