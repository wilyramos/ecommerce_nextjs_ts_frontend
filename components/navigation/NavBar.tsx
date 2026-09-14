// File: frontend/components/navigation/NavBar.tsx
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
      {/* 1. Anuncios (Colapsan al hacer scroll hacia abajo) */}
      <div className="hidden h-8 opacity-100 transition-all duration-300 ease-in-out group-data-[scrolled=true]:h-0 group-data-[scrolled=true]:opacity-0 md:block">
        <TopBarAdServer />
      </div>

      {/* 2. Barra Principal (Logo, Buscador, Acciones) */}
      <div className="relative z-20 flex h-14 flex-col justify-center text-text-primary transition-colors duration-300 group-data-[scrolled=true]:bg-transparent">
        <div className="mx-auto grid w-full max-w-screen-2xl grid-cols-3 items-center px-4 md:px-6">
          <div className="flex items-center">
            <div className="md:hidden">
              <ServerSheetMobile />
            </div>
            <div className="hidden md:flex md:w-full md:max-w-xs">
              <ButtonSearchFormStore />
            </div>
          </div>

          <div className="flex justify-center">
            <Link
              href="/"
              prefetch={false}
              className="flex max-w-[130px] items-center transition-opacity duration-fast hover:opacity-85"
            >
              <Logo color="black" />
            </Link>
          </div>

          <div className="flex items-center justify-end gap-1.5">
            {/* Desktop Actions */}
            <div className="hidden items-center gap-1.5 md:flex">
              <Link
                href="/auth/registro"
                prefetch={false}
                className="flex size-9 items-center justify-center rounded-radius-full text-text-secondary outline-none transition-colors duration-fast hover:bg-surface-secondary hover:text-text-primary active:scale-95"
                aria-label="Mi Cuenta"
              >
                <AiOutlineUser className="size-[22px]" />
              </Link>
              <ButtonShowFavorites />
              <ButtonShowCart />
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-1 md:hidden">
              <ButtonSearchMobile />
              <ButtonShowFavorites />
              <ButtonShowCart />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Franja de Categorías */}
      <div className="relative z-10 hidden w-full border-t border-border-primary/40 transition-colors duration-300 group-data-[scrolled=true]:border-transparent md:block">
        <div className="mx-auto flex max-w-screen-2xl items-center px-4 py-1.5 md:px-6">
          <ServerCategorias />
        </div>
      </div>
    </NavBarClient>
  );
}