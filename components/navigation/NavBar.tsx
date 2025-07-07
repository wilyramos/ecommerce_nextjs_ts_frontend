"use client";

import Link from "next/link";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import ButtonShowCart from "../ui/ButtonShowCart";
import Logo from "../ui/Logo";
import ButtonSearchFormStore from "../ui/ButtonSearchFormStore";
import ButtonShowCategorias from "./ButtonShowCategorias"; // Desktop
import ButtonShowSheetMobile from "./ButtonShowSheetMobile"; // Mobile

export default function NavBar() {

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6 py-2">

                {/* Mobile: Menú lateral + Logo centrado */}
                <div className="md:hidden flex items-center gap-2">
                    <ButtonShowSheetMobile />
                </div>

                <div className="md:hidden absolute left-1/2 -translate-x-1/2 z-10">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/logob.svg"
                            alt="Logo"
                            width={40}
                            height={40}
                            priority
                            className="h-10 w-auto"
                        />
                    </Link>
                </div>

                {/* Desktop: Logo */}
                <Link href="/" className="hidden md:flex items-center">
                    <Logo />
                </Link>

                {/* Desktop: Categorías */}
                <div className="hidden md:flex items-center font-semibold px-10">
                    <ButtonShowCategorias />
                </div>

                {/* Desktop: Buscador */}
                <nav className="hidden md:flex flex-1 items-center justify-center gap-6 text-sm text-gray-700">
                    <div className=" max-w-lg w-full">
                        <ButtonSearchFormStore />
                    </div>
                </nav>

                {/* Desktop: Acciones derecha */}
                <div className="hidden md:flex items-center gap-5">
                    <Link
                        href="/auth/registro"
                        className="text-gray-600 hover:text-indigo-600 transition"
                        aria-label="Cuenta"
                    >
                        <FaUser size={20} />
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
