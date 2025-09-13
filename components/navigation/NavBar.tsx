"use client";

import Link from "next/link";
import { AiOutlineUser } from "react-icons/ai";
import ButtonShowCart from "../ui/ButtonShowCart";
import Logo from "../ui/Logo";
import ButtonSearchFormStore from "../ui/ButtonSearchFormStore";
import ButtonShowCategorias from "./ButtonShowCategorias"; // Desktop
import ButtonShowSheetMobile from "./ButtonShowSheetMobile"; // Mobile
import { useState, useEffect } from "react";

export default function NavBar() {
    const [show, setShow] = useState(true); // si mostrar el navbar
    const [lastScrollY, setLastScrollY] = useState(0); // guardamos la última posición de scroll

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                // Scroll hacia abajo → ocultar
                setShow(false);
            } else {
                // Scroll hacia arriba → mostrar
                setShow(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <header
            className={`sticky top-0 z-50 border-b border-gray-200 bg-white transition-transform duration-300 ${show ? "translate-y-0" : "-translate-y-full"
                }`}
        >
            <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6 py-2">
                {/* Mobile: Menú lateral + Logo centrado */}
                <div className="md:hidden flex items-center gap-2">
                    <ButtonShowSheetMobile />
                </div>

                <div className="md:hidden absolute left-1/2 -translate-x-1/2 z-10 ">
                    <Link href="/" className="flex items-center">
                        <Logo />
                    </Link>
                </div>

                {/* Desktop: Logo */}
                <Link href="/" className="hidden md:flex items-center relative button-reset">
                    <Logo />
                </Link>

                {/* Desktop: Categorías */}
                <div className="hidden md:flex px-6 lg:px-10">
                    <ButtonShowCategorias />
                </div>

                {/* Desktop: Buscador */}
                <nav className="hidden md:flex flex-1 items-center justify-center">
                    <div className="max-w-xl w-full">
                        <ButtonSearchFormStore />
                    </div>
                </nav>

                {/* Desktop: Acciones derecha */}
                <div className="hidden md:flex items-center gap-6">
                    <Link
                        href="/auth/registro"
                        className="flex items-center gap-1 text-gray-600 hover:text-indigo-600 transition"
                        aria-label="Cuenta"
                    >
                        <AiOutlineUser className="h-6 w-6" />
                        <span className="hidden lg:inline text-sm font-medium">
                            Cuenta
                        </span>
                    </Link>
                    <ButtonShowCart />
                </div>

                {/* Mobile: Carrito */}
                <div className="md:hidden">
                    <ButtonShowCart />
                </div>
            </div>
        </header>
    );
}
