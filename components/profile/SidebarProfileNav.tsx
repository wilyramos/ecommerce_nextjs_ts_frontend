"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUser, FaBoxOpen, FaLock } from "react-icons/fa";
import clsx from "clsx";


const links = [
    { href: '/profile', label: 'Datos personales', icon: FaUser },
    { href: '/profile/orders', label: 'Mis pedidos', icon: FaBoxOpen },
    { href: '/profile/password', label: 'Cambiar contraseña', icon: FaLock },
];

export default function SidebarProfileNav() {
    const pathname = usePathname();

    return (
        <nav className="space-y-2">
            {links.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;

                return (
                    <Link
                        key={href}
                        href={href}
                        className={clsx(
                            'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all',
                            isActive
                                ? 'bg-blue-50 text-blue-700 font-semibold'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-blue-700'
                        )}
                    >
                        <Icon className="text-lg" />
                        <span>{label}</span>
                    </Link>
                );
            })}
        </nav>
    );

}