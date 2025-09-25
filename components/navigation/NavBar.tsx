// File: components/store/NavBar.tsx
import Link from "next/link";
import Logo from "../ui/Logo";
import ButtonShowCart from "../ui/ButtonShowCart";
import ButtonSearchFormStore from "../ui/ButtonSearchFormStore";
import ServerCategorias from "./ServerCategorias";
import NavBarClient from "./NavBarClient";
import ServerSheetMobile from "./ServerSheetMobile";
import { AiOutlineUser } from "react-icons/ai";

export default function NavBar() {
    return (
        <NavBarClient>
            <header className="sticky top-0 z-50 border-b border-gray-200 bg-white transition-transform duration-300">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6 py-2">
                    {/* Mobile: Menú lateral */}
                    <div className="md:hidden flex items-center gap-2">
                        <ServerSheetMobile />
                    </div>

                    {/* Mobile: Logo centrado */}
                    <div className="md:hidden absolute left-1/2 -translate-x-1/2 z-10">
                        <Link href="/" className="flex items-center">
                            <Logo />
                        </Link>
                    </div>

                    {/* Desktop: Logo */}
                    <Link
                        href="/"
                        className="hidden md:flex items-center relative button-reset"
                    >
                        <Logo />
                    </Link>

                    {/* Desktop: Categorías dinámicas */}
                    <div className="hidden md:flex px-6 lg:px-10">
                        <ServerCategorias />
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
                            <span className="hidden lg:inline text-sm font-medium">Cuenta</span>
                        </Link>
                        <ButtonShowCart />
                    </div>

                    {/* Mobile: Carrito */}
                    <div className="md:hidden">
                        <ButtonShowCart />
                    </div>
                </div>
            </header>
        </NavBarClient>
    );
}
