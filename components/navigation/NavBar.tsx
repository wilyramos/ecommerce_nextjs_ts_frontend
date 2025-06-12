import Image from 'next/image';
import Link from 'next/link';
import { FaUser } from 'react-icons/fa';
import ButtonShowCart from '../ui/ButtonShowCart';
import MobileMenuToggle from '../ui/MobileMenuToggle';
import Logo from '../ui/Logo';

export default function NavBar() {
    return (
        <header className="sticky top-0 z-50 bg-white text-gray-800">
            <div className="max-w-6xl mx-auto flex justify-between items-center px-6  font-semibold text-sm md:text-base py-1 md:py-2">
                {/* Mobile Menu Toggle (Left) */}
                <div className="md:hidden">
                    <MobileMenuToggle />
                </div>

                {/* Mobile Logo (Centered) */}
                <div className="md:hidden absolute top-0 left-0 w-full h-full flex justify-center items-center">
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

                {/* Logo for Desktop (Left) */}
                <Link href="/" className="hidden md:flex items-center">
                    <Logo />
                </Link>
                {/* Desktop Navigation (Center) */}

                <nav className="hidden md:flex items-center justify-center flex-1 space-x-6">
                    <Link
                        href="/productos"
                        className="px-4 py-2 rounded-md hover:text-indigo-800 transition duration-300 font-sans"
                    >
                        Productos
                    </Link>
                </nav>
                

                {/* Right actions (Hidden on mobile) */}
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

                {/* Right actions for Mobile (Visible) */}
                <div className="md:hidden flex items-center gap-6 absolute top-0 right-0 h-full px-6">
                    <Link
                        href="/auth/registro"
                        className="block hover:text-indigo-800 transition duration-300"
                        aria-label="Registro / Usuario"
                    >
                        <FaUser size={20} />
                    </Link>
                    <ButtonShowCart />
                </div>
            </div>
        </header>
    );
}