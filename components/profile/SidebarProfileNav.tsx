// File: frontend/components/store/SidebarProfileNav.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    HiUser, HiOutlineUser,
    HiArchiveBox, HiOutlineArchiveBox,
    HiLockClosed, HiOutlineLockClosed
} from "react-icons/hi2";
import { cn } from "@/lib/utils";

const links = [
    {
        href: '/profile',
        label: 'Datos personales',
        iconActive: HiUser,
        iconInactive: HiOutlineUser
    },
    {
        href: '/profile/orders',
        label: 'Mis pedidos',
        iconActive: HiArchiveBox,
        iconInactive: HiOutlineArchiveBox
    },
    {
        href: '/profile/password',
        label: 'Seguridad',
        iconActive: HiLockClosed,
        iconInactive: HiOutlineLockClosed
    },
];

export default function SidebarProfileNav() {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col gap-0.5 bg-sidebar text-sidebar-foreground select-none">
            {links.map(({ href, label, iconActive: IconActive, iconInactive: IconInactive }) => {
                const isActive = pathname === href;

                return (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            "flex items-center gap-4 px-3 py-3 text-sm font-medium transition-colors relative group rounded-[var(--radius-sm)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                            isActive
                                ? "bg-sidebar-accent text-sidebar-accent-foreground font-bold"
                                : "text-sidebar-foreground hover:bg-background-secondary hover:text-foreground"
                        )}
                    >
                        {/* Indicador Estructural en Estado Activo */}
                        {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-ring rounded-r-full animate-in fade-in slide-in-from-left-1 duration-300" />
                        )}

                        {/* Contenedor del Icono */}
                        <div className="flex items-center justify-center w-6 shrink-0">
                            {isActive ? (
                                <IconActive className="text-xl text-ring animate-in zoom-in-95 duration-200" />
                            ) : (
                                <IconInactive className="text-xl text-muted-foreground group-hover:text-foreground transition-colors" />
                            )}
                        </div>

                        <span className="tracking-tight">{label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}