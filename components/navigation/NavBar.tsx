import Image from 'next/image';
import Link from 'next/link';
import { FaUser } from 'react-icons/fa';
import ButtonShowCart from '../ui/ButtonShowCart';
import MobileMenuToggle from '../ui/MobileMenuToggle';
import Logo from '../ui/Logo';
import ButtonSearchFormStore from '../ui/ButtonSearchFormStore';

export default function NavBar() {
    return (
        <header className="sticky top-0 z-50 bg-white text-gray-800">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-6 font-semibold text-sm md:text-base py-1">
                {/* Mobile: Menú y buscador */}
                <div className="md:hidden flex items-center gap-2">
                    <MobileMenuToggle />
                </div>

                {/* Mobile: Logo centrado (sin capturar eventos) */}
                <div className="md:hidden absolute top-0 left-0 w-full h-full flex justify-center items-center z-0 pointer-events-auto">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/logob.svg"
                            alt="Logo"
                            width={50}
                            height={50}
                            priority
                            className="w-auto h-10"
                        />
                    </Link>
                </div>

                {/* Desktop: Logo a la izquierda */}
                <Link href="/" className="hidden md:flex items-center">
                    <Logo />
                </Link>

                {/* Desktop: Navegación + Buscador */}
                <nav className="hidden md:flex items-center justify-center flex-1 space-x-6">
                    <Link
                        href="/productos"
                        className="relative group px-4 rounded-md font-sans transition-colors duration-300 text-gray-800 hover:text-indigo-800"
                    >
                        Productos
                        <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-indigo-600 transition-all duration-300 group-hover:w-full" />
                    </Link>

                    {/* Buscador visible solo en escritorio */}
                    <div className="w-full max-w-sm">
                        <ButtonSearchFormStore />
                    </div>
                </nav>

                {/* Desktop: Iconos a la derecha */}
                <div className="hidden md:flex items-center gap-6">
                    <Link
                        href="/auth/registro"
                        className="block hover:text-indigo-800 transition duration-300"
                        aria-label="Registro / Usuario"
                    >
                        <FaUser size={20} />
                    </Link>
                    <ButtonShowCart />
                </div>

                {/* Mobile: Iconos a la derecha */}
                <div className="md:hidden">
                    <div className="absolute top-0 right-0 h-full px-6 flex items-center gap-4 mt-1">
                        {/* <Link href="/auth/registro" className="hover:text-indigo-800 transition">
                            <FaUser size={20} />
                        </Link> */}
                        <ButtonShowCart />
                    </div>
                </div>
            </div>
        </header>
    );
}
