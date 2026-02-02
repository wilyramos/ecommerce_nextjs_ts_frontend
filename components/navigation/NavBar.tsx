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
            <header className="sticky top-0 z-50 h-12 flex flex-col justify-center text-[var(--store-text)] transition-colors duration-300">
                <div className="max-w-screen-2xl w-full mx-auto grid grid-cols-3 items-center px-4 md:px-6">

                    {/* Left column */}
                    <div className="flex items-center">
                        <div className="md:hidden">
                            <ServerSheetMobile />
                        </div>

                        <div className="hidden md:flex">
                            <ButtonSearchFormStore />
                        </div>
                    </div>

                    {/* Center column - LOGO SIEMPRE CENTRADO */}
                    <div className="flex justify-center">
                        <Link href="/" className="flex items-center max-w-[140px]">
                            <Logo color="black" />
                        </Link>
                    </div>

                    {/* Right column */}
                    <div className="flex items-center justify-end gap-2">
                        <div className="hidden md:flex items-center gap-1">
                            <Link
                                href="/auth/registro"
                                className="flex items-center gap-1 transition px-2 py-1 rounded-full"
                                aria-label="Cuenta"
                            >
                                <div className="hover:bg-[var(--store-surface-hover)] rounded-full p-2">
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

                </div>
            </header>


            <div className="hidden md:block sticky z-40 w-full border-b border-[var(--store-border)] bg-[var(--store-surface)] transition-colors duration-300">
                <div className="max-w-screen-2xl mx-auto px-4 md:px-6 flex items-center">
                    <ServerCategorias />
                </div>
            </div>

        </NavBarClient>
    );
}