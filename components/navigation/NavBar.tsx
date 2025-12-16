// frontend/components/navigation/NavBar.tsx

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
            {/* HEADER FIJO */}
            <header className="sticky top-0 z-50 bg-black text-white">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 h-12 md:h-16">

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <ServerSheetMobile />
                    </div>

                    {/* Mobile logo centered */}
                    <div className="md:hidden absolute left-1/2 -translate-x-1/2 z-10 max-w-[140px]">
                        <Link href="/" className="flex items-center">
                            <Logo color="white" />
                        </Link>
                    </div>

                    {/* Desktop logo */}
                    <Link
                        href="/"
                        className="hidden md:flex items-center max-w-[140px] lg:max-w-[120px]"
                    >
                        <Logo color="white" />
                    </Link>


                    {/* Desktop search */}
                    <nav className="hidden md:flex flex-1 justify-center px-4">
                        <div className="max-w-xl w-full">
                            <ButtonSearchFormStore />
                        </div>
                    </nav>

                    {/* Desktop actions */}
                    <div className="hidden md:flex items-center gap-1">
                        <Link
                            href="/auth/registro"
                            className="flex items-center gap-1 transition px-2 py-1"
                            aria-label="Cuenta"
                        >
                            <div className="hover:bg-white hover:text-black rounded-full p-2">
                                <AiOutlineUser className="h-6 w-6" />
                            </div>
                        </Link>

                        <ButtonShowCart />
                    </div>

                    <div className="md:hidden flex items-center gap-2">
                        <ButtonSearchMobile />
                        <ButtonShowCart />
                    </div>
                </div>
            </header>

            {/* CATEGORÍAS FIJAS EN DESKTOP */}
            <div className="hidden md:block sticky top-16 z-40 bg-white w-full border-b">
                <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center">
                    <ServerCategorias />
                </div>
            </div>

        </NavBarClient>
    );
}
