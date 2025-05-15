import Image from 'next/image';
import Link from 'next/link';
import { FaUser, FaShoppingCart } from 'react-icons/fa';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export default function NavBar() {
    return (
        <header>
            <div className="container mx-auto flex justify-between items-center px-6 py-4">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/logo.svg" alt="Logo" width={60} height={60}
                        className="w-12 h-12"
                        priority
                    />


                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="text-gray-600 hover:text-blue-500">
                                    Productos
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="bg-white p-3 w-56">
                                        <li>
                                            <Link href="/shop/telefonos" className="block px-3 py-2 hover:bg-gray-100 rounded">
                                                Celulares
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/shop/accesorios" className="block px-3 py-2 hover:bg-gray-100 rounded">
                                                Accesorios
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/shop/laptops" className="block px-3 py-2 hover:bg-gray-100 rounded">
                                                Laptops
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/shop/novedades" className="block px-3 py-2 hover:bg-gray-100 rounded">
                                                Novedades
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/shop/ofertas" className="block px-3 py-2 hover:bg-gray-100 rounded">
                                                Ofertas Especiales
                                            </Link>
                                        </li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="text-gray-600 hover:text-blue-600">
                                    Marcas
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="p-3 w-56">
                                        <li>
                                            <Link href="/shop/marcas/apple" className="block px-3 py-2 hover:bg-gray-100 rounded">
                                                Apple
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/shop/marcas/samsung" className="block px-3 py-2 hover:bg-gray-100 rounded">
                                                Samsung
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/shop/marcas/xiaomi" className="block px-3 py-2 hover:bg-gray-100 rounded">
                                                Xiaomi
                                            </Link>
                                        </li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>

                    <Link href="/productos" className="text-gray-600 hover:text-blue-600 font-medium">
                        Tienda
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="/auth/registro" className="text-gray-600 hover:text-blue-600">
                        <FaUser size={20} />
                    </Link>

                    <Link href="/cart" className="relative">
                        <FaShoppingCart size={20} className="text-gray-600 hover:text-blue-600" />
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            3
                        </span>
                    </Link>
                </div>
            </div>
        </header>
    );
}
