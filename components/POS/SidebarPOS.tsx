"use client";

import { User } from '@/src/schemas';
import Link from 'next/link';
import {
    HiOutlineShoppingCart,
    HiOutlineDocumentReport,
    HiOutlineCube,
    HiOutlineUsers,
    HiOutlineHome
} from 'react-icons/hi';
import AdminMenu from '@/components/admin/AdminMenu';
import Logo from '../ui/Logo';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function SidebarPOS({ user }: { user: User }) {
    const pathname = usePathname();

    const isActive = (path: string) =>
        cn(
            'flex items-center gap-3 px-4 py-2 rounded-xl transition-all',
            pathname === path
                ? 'bg-rose-100 text-rose-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-100 hover:text-rose-500'
        );

    return (
        <aside className="h-screen bg-white border-r w-56 flex flex-col ">
            {/* Logo */}
            <div className="flex items-center justify-center py-6">
                <Logo />
            </div>

            {/* Navegación */}
            <nav className="flex flex-col px-4 space-y-2 text-sm font-medium py-10">
                <Link href="/pos" className={isActive('/pos')}>
                    <HiOutlineHome className="h-5 w-5" />
                    Inicio
                </Link>
                <Link href="/pos/ventas" className={isActive('/pos/ventas')}>
                    <HiOutlineDocumentReport className="h-5 w-5" />
                    Ventas
                </Link>
                <Link href="/pos/compras" className={isActive('/pos/compras')}>
                    <HiOutlineShoppingCart className="h-5 w-5" />
                    Compras
                </Link>
                <Link href="/pos/productos" className={isActive('/pos/productos')}>
                    <HiOutlineCube className="h-5 w-5" />
                    Productos
                </Link>
                <Link href="/pos/clientes" className={isActive('/pos/clientes')}>
                    <HiOutlineUsers className="h-5 w-5" />
                    Clientes
                </Link>
            </nav>

            {/* Usuario */}
            <div className="px-4 py-4 border-t flex items-center justify-between text-xs text-gray-600">
                <span>
                    Hola <span className="font-semibold text-gray-800 uppercase">{user.nombre}</span>
                </span>
                <AdminMenu user={user} />
            </div>
        </aside>
    );
}
