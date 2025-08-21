"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { DateRangePicker, Range, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { es } from "date-fns/locale";
import { format } from "date-fns";

export default function DateRangeDropdown() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const start = searchParams.get("startDate");
    const end = searchParams.get("endDate");

    const [range, setRange] = useState<Range[]>([
        {
            startDate: start ? new Date(start) : new Date(),
            endDate: end ? new Date(end) : new Date(),
            key: "selection",
        },
    ]);

    const [isMobile, setIsMobile] = useState(false);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Detectar screen size
    useEffect(() => {
        const checkScreen = () => setIsMobile(window.innerWidth < 768);
        checkScreen();
        window.addEventListener("resize", checkScreen);
        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    // Cerrar al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleRangeChange = (ranges: RangeKeyDict) => {
        const { startDate, endDate } = ranges.selection;
        if (!startDate || !endDate) return;

        setRange([{ startDate, endDate, key: "selection" }]);

        const params = new URLSearchParams();
        params.set("startDate", startDate.toISOString().split("T")[0]);
        params.set("endDate", endDate.toISOString().split("T")[0]);
        router.push(`${pathname}?${params.toString()}`);
    };

    // Fechas formateadas para mostrar en el botón
    const startDate = range[0].startDate ? format(range[0].startDate, "dd MMM yyyy", { locale: es }) : "";
    const endDate = range[0].endDate ? format(range[0].endDate, "dd MMM yyyy", { locale: es }) : "";

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            {/* Botón con fechas */}
            <span className="text-xs font-semibold">Filtros:</span>
            <button
                onClick={() => setOpen(!open)}
                className="px-4 py-1 text-xs font-bold rounded-2xl hover:bg-gray-200 border cursor-pointer mx-2"
            >
                {startDate} - {endDate}
            </button>

            {/* Calendario flotante adaptable */}
            {open && (
                <div
                    className="absolute mt-2 bg-white shadow-lg rounded-lg p-2 border"
                    style={{
                        right: 0, // 👈 se alinea a la derecha del botón
                        minWidth: isMobile ? "320px" : "600px",
                        maxWidth: "90vw" // evita overflow
                    }}
                >
                    <DateRangePicker
                        ranges={range}
                        onChange={handleRangeChange}
                        moveRangeOnFirstSelection={false}
                        months={isMobile ? 1 : 2}
                        direction={isMobile ? "vertical" : "horizontal"}
                        locale={es}
                    />
                </div>
            )}
        </div>
    );
}
