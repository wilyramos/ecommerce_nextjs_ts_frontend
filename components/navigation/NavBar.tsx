import Link from "next/link";
import Logo from "../ui/Logo";
import ButtonShowCart from "../ui/ButtonShowCart";
import ButtonSearchFormStore from "../ui/ButtonSearchFormStore";
import ServerCategorias from "./ServerCategorias";
import NavBarClient from "./NavBarClient";
import ServerSheetMobile from "./ServerSheetMobile";
import { AiOutlineUser } from "react-icons/ai";
import ButtonSearchMobile from "./ButtonSearchMobile";

export default function NavBar() {
    return (
        <NavBarClient>
            {/* Agregamos ID para referencia de altura */}
            <header id="global-header" className="sticky top-0 z-50 bg-white transition-all duration-200 border-b">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6">

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <ServerSheetMobile />
                    </div>

                    {/* Mobile logo centered */}
                    <div className="md:hidden absolute left-1/2 -translate-x-1/2 z-10">
                        <Link href="/" className="flex items-center p-1">
                            <Logo />
                        </Link>
                    </div>

                    {/* Desktop logo */}
                    <Link href="/" className="hidden md:flex items-center">
                        <Logo />
                    </Link>

                    {/* Desktop categories */}
                    <div className="hidden md:flex lg:px-10">
                        <ServerCategorias />
                    </div>

                    {/* Desktop search */}
                    <nav className="hidden md:flex flex-1 justify-center px-4">
                        <div className="max-w-xl w-full">
                            <ButtonSearchFormStore />
                        </div>
                    </nav>

                    {/* Desktop actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="/auth/registro"
                            className="flex items-center gap-1 transition px-2 py-1"
                            aria-label="Cuenta"
                        >
                            <div className="hover:bg-gray-100 rounded-full p-2">
                                <AiOutlineUser className="h-6 w-6" />
                            </div>
                        </Link>

                        <ButtonShowCart />
                    </div>

                    {/* Mobile cart */}
                    <div className="md:hidden flex items-center gap-2">
                        <ButtonSearchMobile />
                        <ButtonShowCart />
                    </div>
                </div>
            </header>
        </NavBarClient>
    );
}