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
            <header className="sticky top-0 z-50 bg-white">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 ">

                    <div className="md:hidden flex items-center hover:bg-gray-100 ">
                        <ServerSheetMobile />
                    </div>

                    <div className="md:hidden absolute left-1/2 -translate-x-1/2 z-10">
                        <Link href="/" className="flex items-center  p-1">
                            <Logo />
                        </Link>
                    </div>

                    <Link
                        href="/"
                        className="hidden md:flex items-center"
                    >
                        <Logo />
                    </Link>

                    <div className="hidden md:flex px- lg:px-10">
                        <ServerCategorias />
                    </div>

                    <nav className="hidden md:flex flex-1 justify-center px-4">
                        <div className="max-w-xl w-full">
                            <ButtonSearchFormStore />
                        </div>
                    </nav>

                    <div className="hidden md:flex items-center justify-center gap-4 lg:gap-6">
                        <Link
                            href="/auth/registro"
                            className="flex items-center gap-1 transition hover:bg-gray-100 px-2 py-1"
                            aria-label="Cuenta"
                        >
                            <AiOutlineUser className="h-6 w-6" />
                            <span className="hidden lg:inline text-sm font-semibold">Cuenta</span>
                        </Link>

                        <div className="hover:bg-gray-100 px-2 my-2 py-1">
                            <ButtonShowCart />
                        </div>
                    </div>

                    <div className="md:hidden hover:bg-gray-100 m-1">
                        <ButtonShowCart />
                    </div>
                </div>
            </header>
        </NavBarClient>
    );
}
