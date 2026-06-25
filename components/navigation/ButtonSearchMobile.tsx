"use client";

import { Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ButtonSearchFormStore from "../ui/ButtonSearchFormStore";

export default function ButtonSearchMobile() {
    const [openSearch, setOpenSearch] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Cerrar al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpenSearch(false);
            }
        };

        if (openSearch) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openSearch]);

    return (
        <>
            {/* Toggle button */}
            <button
                onClick={() => setOpenSearch(!openSearch)}
                className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Buscar productos"
            >
                {openSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>

            {/* Caja del buscador - Posicionado relativo al navbar */}
            {openSearch && (
                <div
                    ref={containerRef}
                    className="
                        absolute top-full left-0 w-full bg-white border-b border-gray-200
                        z-[45] px-4 py-3 md:hidden
                        animate-in fade-in slide-in-from-top-2 duration-200
                    "
                >
                    <ButtonSearchFormStore
                        isMobile={true}
                        onSearchComplete={() => setOpenSearch(false)}
                    />
                </div>
            )}

            {/* Overlay - Se posiciona fijo cubriendo la pantalla bajo el viewport restante */}
            {openSearch && (
                <div
                    className="fixed inset-x-0 bottom-0 z-[40] md:hidden top-12"
                    onClick={() => setOpenSearch(false)}
                />
            )}
        </>
    );
}