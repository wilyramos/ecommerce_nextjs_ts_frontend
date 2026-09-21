import Link from "next/link";
import Logo from "../ui/Logo";
import ButtonShowCart from "../ui/ButtonShowCart";
import ButtonShowFavorites from "./ButtonShowFavorites";
import ButtonSearchFormStore from "../ui/ButtonSearchFormStore";
import ServerCategorias from "./ServerCategorias";
import NavBarClient from "./NavBarClient";
import ServerSheetMobile from "./ServerSheetMobile";
import { AiOutlineUser } from "react-icons/ai";
import ButtonSearchMobile from "./ButtonSearchMobile";
import TopBarAdServer from "@/components/home/TopBarAdServer";

export default function NavBar() {
  return (
    <NavBarClient>
      {/* 1. Anuncio superior */}
      <div className="hidden h-8 opacity-100 transition-all duration-normal ease-in-out group-data-[scrolled=true]:h-0 group-data-[scrolled=true]:opacity-0 md:block">
        <TopBarAdServer />
      </div>

      {/* 2. Barra de Navegación Principal */}
      <div className="relative z-20 flex h-14 flex-col justify-center text-text-primary transition-colors duration-normal group-data-[scrolled=true]:bg-transparent">
        <div className="mx-auto grid w-full max-w-screen-2xl grid-cols-3 items-center px-3 sm:px-4 md:px-6">

          {/* Lado Izquierdo: Menú móvil + Búsqueda móvil / Buscador desktop */}
          <div className="flex items-center">
            <div className="flex items-center gap-0.5 sm:gap-1 md:hidden">
              <ServerSheetMobile />
              <ButtonSearchMobile />
            </div>
            <div className="hidden md:flex md:w-full md:max-w-md lg:max-w-lg">
              <ButtonSearchFormStore />
            </div>
          </div>

          {/* Centro: Logo responsivo */}
          <div className="flex justify-center">
            <Link
              href="/"
              prefetch={false}
              className="flex items-center outline-none transition-opacity duration-fast hover:opacity-85"
              aria-label="Ir al inicio de GoPhone"
            >
              <Logo color="black" />
            </Link>
          </div>

          {/* Lado Derecho: Acciones de usuario, favoritos y carrito */}
          <div className="flex items-center justify-end gap-1 sm:gap-1.5">
            {/* Desktop Actions */}
            <div className="hidden items-center gap-1.5 md:flex">
              <Link
                href="/auth/registro"
                prefetch={false}
                className="flex size-9 items-center justify-center rounded-full text-text-secondary outline-none transition-colors duration-fast hover:bg-surface-secondary hover:text-text-primary active:scale-95"
                aria-label="Mi Cuenta"
              >
                <AiOutlineUser className="size-[21px]" />
              </Link>
              <ButtonShowFavorites />
              <ButtonShowCart />
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-0.5 sm:gap-1 md:hidden">
              <ButtonShowFavorites />
              <ButtonShowCart />
            </div>
          </div>

        </div>
      </div>

      {/* 3. Categorías en desktop */}
      <div className="relative z-10 hidden w-full border-t border-border-primary/50 transition-colors duration-normal group-data-[scrolled=true]:border-transparent md:block">
        <div className="mx-auto flex max-w-screen-2xl items-center px-4 md:px-6">
          <ServerCategorias />
        </div>
      </div>
    </NavBarClient>
  );
}