"use client";

import { User } from '@/src/schemas';
import Image from 'next/image';
import Link from 'next/link';
import AdminMenu from '@/components/admin/AdminMenu';
import {
    FaHome,
    FaBoxOpen,
    FaTags, FaReceipt,
    FaCashRegister
} from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { BiSolidUserRectangle } from "react-icons/bi";
import clsx from 'clsx';

export default function AdminSidebar({ user }: { user: User }) {


    const pathname = usePathname();

    const isAdmin = user.rol === 'administrador';

    const links = [
        { href: '/admin', icon: <FaHome />, label: 'Dashboard' },
        { href: '/admin/products', icon: <FaBoxOpen />, label: 'Productos' },
        { href: '/admin/clients', icon: <BiSolidUserRectangle />, label: 'Clientes' },
        { href: '/admin/products/category', icon: <FaTags />, label: 'Categorías' },
        { href: '/admin/orders', icon: <FaReceipt />, label: 'Órdenes' },
        { href: '/pos', icon: <FaCashRegister />, label: 'Punto de Venta' },
    ];

    return (
        <aside className="h-full w-auto bg-white border-r border-gray-200 flex flex-col">
            {/* Logo */}
            <div className="py-6 flex justify-center border-b border-gray-100">
                <Image src="/logob.svg" alt="Logo" width={90} height={90} />
            </div>

            {/* Navegación */}
            <nav className="flex flex-col p-3 text-sm space-y-2">
                {links.map(
                    (link) =>
                        (isAdmin || link.href === '/pos') && (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={clsx(
                                    'flex items-center gap-2 px-3 py-2 rounded-md hover:bg-indigo-500 hover:text-white transition-colors',
                                    pathname === link.href ? 'bg-indigo-500 text-white font-medium' : 'text-gray-700'
                                )}
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        )
                )}
            </nav>

            {/* Espaciador */}
            <div className="flex-grow" />

            {/* Usuario */}
            <div className=" flex flex-col px-4 py-4 border-t border-gray-100 text-xs">
                <p className="mb-1 text-gray-500">Hola, <span className="font-medium text-blue-500">{user.nombre}</span></p>
                <AdminMenu user={user} />
            </div>
        </aside>
    );
}
