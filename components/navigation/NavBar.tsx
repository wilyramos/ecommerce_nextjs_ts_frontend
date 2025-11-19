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

    const categories = [
        { name: "Android", slug: "android" },
        { name: "Power banks", slug: "power-banks" },
        { name: "Protectores de pantalla", slug: "protectores-de-pantalla" },
        { name: "Auriculares y audífonos", slug: "auriculares-y-audifonos" },
        { name: "Cargadores y cables", slug: "cargadores-y-cables" },
        { name: "Iphone", slug: "iphone" },
        { name: "Fundas y carcasas", slug: "fundas-y-carcasas" },
    ];


    return (
        <NavBarClient>
            <header className="sticky top-0 z-50 border-b bg-white">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-1">

                    <div className="md:hidden flex items-center hover:bg-gray-100 rounded-md p-1">
                        <ServerSheetMobile />
                    </div>

                    <div className="md:hidden absolute left-1/2 -translate-x-1/2 z-10">
                        <Link href="/" className="flex items-center hover:bg-gray-100 rounded-md p-1">
                            <Logo />
                        </Link>
                    </div>

                    <Link
                        href="/"
                        className="hidden md:flex items-center hover:bg-gray-100 rounded-md p-1"
                    >
                        <Logo />
                    </Link>

                    <div className="hidden md:flex px-6 lg:px-10">
                        <ServerCategorias />
                    </div>

                    <nav className="hidden md:flex flex-1 justify-center px-4">
                        <div className="max-w-xl w-full">
                            <ButtonSearchFormStore />
                        </div>
                    </nav>

                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            href="/auth/registro"
                            className="flex items-center gap-1 transition hover:bg-gray-100 rounded-md px-2 py-1"
                            aria-label="Cuenta"
                        >
                            <AiOutlineUser className="h-6 w-6" />
                            <span className="hidden lg:inline text-sm font-medium">Cuenta</span>
                        </Link>

                        <div className="hover:bg-gray-100 rounded-md px-2 py-1">
                            <ButtonShowCart />
                        </div>
                    </div>

                    <div className="md:hidden hover:bg-gray-100 rounded-md p-1">
                        <ButtonShowCart />
                    </div>
                </div>
            </header>

            <div className="hidden md:flex max-w-7xl mx-auto bg-black">
                <ul className="flex flex-wrap gap-2 md:gap-3 px-4 md:px-6 py-2 border-b">
                    {categories.map((category) => (
                        <li key={category.slug}>
                            <Link
                                href={`/productos?category=${category.slug}`}
                                className="
                        px-4 py-2
                        rounded
                        text-sm
                        font-medium
                        transition-all
                        hover:bg-gray-800
                        active:scale-[0.97]
                        text-white
                    "
                            >
                                {category.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

        </NavBarClient>
    );
}
