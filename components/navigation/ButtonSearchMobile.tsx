"use client";

import { Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ButtonSearchFormStore from "../ui/ButtonSearchFormStore";

export default function ButtonSearchMobile() {
    const [openSearch, setOpenSearch] = useState(false);
    const [headerHeight, setHeaderHeight] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Detectar altura del navbar actual
    useEffect(() => {
        const updateHeight = () => {
            const nav = document.getElementById("navbar-fixed");
            if (nav) {
                setHeaderHeight(nav.offsetHeight);
            }
        };

        updateHeight();
        window.addEventListener("resize", updateHeight);
        return () => window.removeEventListener("resize", updateHeight);
    }, []);

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

            {/* Caja del buscador */}
            {openSearch && (
                <div
                    ref={containerRef}
                    className="
                        fixed left-0 w-full bg-white border-b border-gray-200
                        z-[45] px-4 py-3 md:hidden
                        animate-in fade-in slide-in-from-top-2 duration-200
                    "
                    style={{ top: headerHeight }}
                >
                    <ButtonSearchFormStore
                        isMobile={true}
                        onSearchComplete={() => setOpenSearch(false)}
                    />
                </div>
            )}

            {/* Overlay solo debajo del navbar */}
            {openSearch && (
                <div
                    className="fixed inset-0 bg-black/40 z-[40] md:hidden"
                    style={{
                        top: headerHeight,
                        height: `calc(100vh - ${headerHeight}px)`
                    }}
                    onClick={() => setOpenSearch(false)}
                />
            )}
        </>
    );
}
