"use client";

import { User } from '@/src/schemas';
import Link from 'next/link';
import {
    FaUserCircle,
    FaCashRegister,
    FaReceipt,
    FaBoxOpen,
    FaUsers,
} from 'react-icons/fa';
import AdminMenu from '@/components/admin/AdminMenu';
import Logo from '../ui/Logo';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function SidebarPOS({ user }: { user: User }) {

    const pathname = usePathname();

    const isActive = (path: string) => {
        return cn(
            'flex items-center gap-3 px-3 py-2 rounded-2xl',
            pathname === path ? 'text-rose-600 font-extrabold' : 'hover:bg-rose-200 hover:text-rose-800'
        );
    };

    return (
        <aside className=" h-screen bg-white border-r flex flex-col">
            {/* Usuario */}
            <div className="flex items-center p-4 text-center justify-center">
                <Logo />
            </div>

            {/* Navegación */}
            <nav className="flex flex-col p-4 space-y-2 font-medium flex-1">
                <Link href="/pos" className={isActive('/pos')}>
                    <FaCashRegister /> Inicio
                </Link>
                <Link href="/pos/ventas" className={isActive('/pos/ventas')}>
                    <FaReceipt /> Ventas
                </Link>
                <Link href="/pos/compras" className={isActive('/pos/compras')}>
                    <FaReceipt /> Compras
                </Link>
                <Link href="/pos/productos" className={isActive('/pos/productos')}>
                    <FaBoxOpen /> Productos
                </Link>
                <Link href="/pos/clientes" className={isActive('/pos/clientes')}>
                    <FaUsers /> Clientes
                </Link>
            </nav>

            {/* Salir */}
            <div className="flex items-center justify-between px-4 py-3">
                <p className="text-sm text-gray-600">
                    Hola <span className="font-bold text-gray-800 uppercase">{user.nombre}</span>
                </p>
                <AdminMenu user={user} />
            </div>
        </aside>
    );
}
