"use client";

import { Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ButtonSearchFormStore from "../ui/ButtonSearchFormStore";

export default function ButtonSearchMobile() {
    const [openSearch, setOpenSearch] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Calcular altura del navbar para posicionar el buscador justo debajo
    useEffect(() => {
        const updateHeight = () => {
            const header = document.getElementById("global-header");
            if (header) {
                setHeaderHeight(header.offsetHeight);
            }
        };

        // Ejecutar al inicio y al cambiar tamaño de ventana
        updateHeight();
        window.addEventListener("resize", updateHeight);
        return () => window.removeEventListener("resize", updateHeight);
    }, []);

    // Cerrar si se hace click fuera del contenedor
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                // Opcional: cerrar solo si el click no fue en el botón de toggle (ya manejado por react)
                setOpenSearch(false);
            }
        };

        if (openSearch) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openSearch]);

    return (
        <>
            {/* Botón Toggle */}
            <button
                onClick={() => setOpenSearch(!openSearch)}
                className={`md:hidden transition-colors ${openSearch ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                aria-label="Buscar productos"
            >
                {openSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>

            {/* Contenedor del buscador: Fixed debajo del header */}
            {openSearch && (
                <div
                    ref={containerRef}
                    className="fixed left-0 w-full bg-white border-b border-gray-200 shadow-lg z-[40] px-4 py-3 md:hidden animate-in slide-in-from-top-2 fade-in duration-200"
                    style={{ top: headerHeight }}
                >
                    <ButtonSearchFormStore
                        isMobile={true}
                        onSearchComplete={() => setOpenSearch(false)}
                    />
                </div>
            )}

            {/* Overlay oscuro opcional para el resto de la pantalla */}
            {openSearch && (
                <div
                    className="fixed inset-0 bg-black/20 z-[30] md:hidden backdrop-blur-xs"
                    style={{ top: headerHeight }}
                    onClick={() => setOpenSearch(false)}
                />
            )}
        </>
    );
}