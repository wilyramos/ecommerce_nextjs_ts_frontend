import Image from 'next/image';
import Link from 'next/link';
import { FaUser } from 'react-icons/fa';
import ButtonShowCart from '../ui/ButtonShowCart';
import MobileMenuToggle from '../ui/MobileMenuToggle';

const productos = [
    { name: 'Celulares', href: '/shop/telefonos' },
    { name: 'Accesorios', href: '/shop/accesorios' },
    { name: 'Laptops', href: '/shop/laptops' },
    { name: 'Novedades', href: '/shop/novedades' },
    { name: 'Ofertas Especiales', href: '/shop/ofertas' },
];

const marcas = [
    { name: 'Apple', href: '/shop/marcas/apple' },
    { name: 'Samsung', href: '/shop/marcas/samsung' },
    { name: 'Xiaomi', href: '/shop/marcas/xiaomi' },
];

export default function NavBar() {
    return (
        <header className="sticky top-0 z-50 bg-black text-white shadow-lg">
            <div className=" max-w-7xl mx-auto flex justify-between items-center px-6 py-1">

                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Image
                        src="/logow.svg"
                        alt="Logo"
                        width={50}
                        height={50}
                        priority
                        className="w-auto h-10"
                    />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8 font-semibold tracking-wide">
                    <div className="group relative">
                        <span className="cursor-pointer hover:text-indigo-600 transition-colors duration-300">
                            Productos
                        </span>
                        <ul className="absolute hidden group-hover:block bg-gray-800 text-white shadow-xl rounded-lg mt-3 p-4 w-56 z-50 ring-1 ring-indigo-600 ring-opacity-50">
                            {productos.map(({ name, href }) => (
                                <li key={name}>
                                    <Link
                                        href={href}
                                        className="block px-4 py-2 rounded-md hover:bg-indigo-600 hover:text-white transition duration-300"
                                    >
                                        {name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="group relative">
                        <span className="cursor-pointer hover:text-indigo-600 transition-colors duration-300">
                            Marcas
                        </span>
                        <ul className="absolute hidden group-hover:block bg-gray-800 text-white shadow-xl rounded-lg mt-3 p-4 w-52 z-50 ring-1 ring-indigo-600 ring-opacity-50">
                            {marcas.map(({ name, href }) => (
                                <li key={name}>
                                    <Link
                                        href={href}
                                        className="block px-4 py-2 rounded-md hover:bg-indigo-600 hover:text-white transition duration-300"
                                    >
                                        {name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Link
                        href="/productos"
                        className="px-4 py-2 rounded-md hover:text-indigo-600 transition duration-300"
                    >
                        Tienda
                    </Link>
                </nav>

                {/* Right actions */}
                <div className="flex items-center gap-6">
                    <Link
                        href="/auth/registro"
                        className="hidden md:block hover:text-indigo-600 transition duration-300"
                        aria-label="Registro / Usuario"
                    >
                        <FaUser size={20} />
                    </Link>
                    <ButtonShowCart />
                    <div className="md:hidden">
                        <MobileMenuToggle />
                    </div>
                </div>
            </div>
        </header>
    );
}
