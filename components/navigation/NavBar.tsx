import Image from 'next/image';
import Link from 'next/link';
import { FaUser } from 'react-icons/fa';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import ButtonShowCart from '../ui/ButtonShowCart';
import MobileMenuToggle from '../ui/MobileMenuToggle';

export default function NavBar() {
    return (
        <header className="border-b ">
            <div className="container mx-auto flex justify-between items-center pl-10 pr-6 py-3">

                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Image
                        src="/logo.svg"
                        alt="Logo"
                        width={50}
                        height={50}
                        priority
                        className="h-15 w-auto"
                    />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="hover:text-blue-500">Productos</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="bg-white p-2 w-48">
                                        {[
                                            { name: 'Celulares', href: '/shop/telefonos' },
                                            { name: 'Accesorios', href: '/shop/accesorios' },
                                            { name: 'Laptops', href: '/shop/laptops' },
                                            { name: 'Novedades', href: '/shop/novedades' },
                                            { name: 'Ofertas Especiales', href: '/shop/ofertas' },
                                        ].map(({ name, href }) => (
                                            <li key={name}>
                                                <Link href={href} className="block px-3 py-2 hover:bg-gray-100 rounded">{name}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="hover:text-blue-500">Marcas</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="bg-white p-2 w-48">
                                        {[
                                            { name: 'Apple', href: '/shop/marcas/apple' },
                                            { name: 'Samsung', href: '/shop/marcas/samsung' },
                                            { name: 'Xiaomi', href: '/shop/marcas/xiaomi' },
                                        ].map(({ name, href }) => (
                                            <li key={name}>
                                                <Link href={href} className="block px-3 py-2 hover:bg-gray-100 rounded">{name}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>

                    <Link
                        href="/productos"
                        className="px-3 py-1 rounded hover:bg-gray-100 hover:text-black transition"
                    >
                        Tienda
                    </Link>
                </nav>

                {/* Right actions */}
                <div className="flex items-center gap-3">
                    <Link href="/auth/registro" className="hidden md:block text-gray-600 hover:text-blue-500">
                        <FaUser size={18} />
                    </Link>
                    <ButtonShowCart

                    />
                    <div className="md:hidden">
                        <MobileMenuToggle />
                    </div>
                </div>
            </div>
        </header>
    );
}
