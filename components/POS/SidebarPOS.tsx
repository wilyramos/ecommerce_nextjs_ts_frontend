"use client";

import { User } from "@/src/schemas";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { logout } from "@/actions/logout-user-action";
import {
    HiOutlineShoppingCart,
    HiOutlineCube,
    HiOutlineUsers,
    HiOutlineHome,
} from "react-icons/hi2";
import { ChevronRight } from "lucide-react";

export default function SidebarPOS({ user }: { user: User }) {
    const pathname = usePathname();
    const [expanded, setExpanded] = useState(true);

    const links = [
        { href: "/pos", label: "Inicio", icon: HiOutlineHome },
        { href: "/pos/ventas", label: "Ventas", icon: HiOutlineShoppingCart },
        { href: "/pos/compras", label: "Compras", icon: HiOutlineShoppingCart },
        { href: "/pos/productos", label: "Productos", icon: HiOutlineCube },
        { href: "/pos/clientes", label: "Clientes", icon: HiOutlineUsers },
    ];

    return (
        <aside
            className={cn(
                "hidden md:flex relative h-screen flex-col transition-all duration-300 z-30",
                "bg-[var(--admin-sidebar-bg)] border-r border-[#1F2937] shadow-2xl",
                expanded ? "w-64" : "w-[80px]"
            )}
        >
            {/* Botón para expandir/colapsar */}
            <button
                onClick={() => setExpanded((c) => !c)}
                className="absolute -right-3 top-8 flex h-6 w-6 items-center justify-center rounded-full border border-[#1F2937] bg-[var(--admin-sidebar-bg)] text-[var(--admin-text-muted)] hover:text-white hover:bg-[var(--admin-sidebar-hover)] shadow-md z-40 transition-colors"
                title={expanded ? "Colapsar menú" : "Expandir menú"}
            >
                <ChevronRight
                    className={cn("h-3 w-3 transition-transform duration-300", !expanded && "rotate-180")}
                />
            </button>

            {/* Header del Sidebar (Logo) */}
            <div className={cn(
                "flex h-16 items-center border-b border-[#1F2937] shrink-0 transition-all duration-300 overflow-hidden",
                expanded ? "px-6 justify-start" : "px-0 justify-center"
            )}>
                <div className="text-white min-w-max flex items-center justify-center">
                    {/* <Logo color="white" /> */}
                </div>
            </div>

            {/* Navegación Scrolleable */}
            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5 custom-scrollbar overflow-x-hidden">
                <p className={cn(
                    "text-[10px] font-bold uppercase tracking-wider text-[var(--admin-text-muted)] mb-3 transition-all duration-300",
                    expanded ? "px-3 opacity-100" : "text-center opacity-0 h-0 mb-0"
                )}>
                    Punto de Venta
                </p>

                {links.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href;

                    return (
                        <Link
                            key={href}
                            href={href}
                            title={!expanded ? label : undefined}
                            className={cn(
                                "group flex items-center rounded-lg py-2.5 transition-all duration-200",
                                expanded ? "px-3 gap-3" : "justify-center px-0",
                                active
                                    ? "bg-[var(--admin-sidebar-hover)] text-white shadow-sm"
                                    : "text-[var(--admin-sidebar-text)] opacity-70 hover:opacity-100 hover:bg-[var(--admin-sidebar-hover)]"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "h-5 w-5 shrink-0 transition-colors",
                                    active ? "text-[var(--admin-info)]" : "text-[var(--admin-text-muted)] group-hover:text-white"
                                )}
                            />
                            <span className={cn(
                                "whitespace-nowrap transition-all duration-300",
                                expanded ? "opacity-100 w-auto text-sm font-medium" : "opacity-0 w-0 hidden"
                            )}>
                                {label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer del Sidebar (Usuario y Logout) */}
            <div className="border-t border-[#1F2937] p-4 bg-[var(--admin-sidebar-bg)] shrink-0">
                <div
                    className={cn(
                        "flex items-center transition-all duration-300",
                        expanded ? "justify-between gap-3" : "justify-center flex-col gap-3"
                    )}
                >
                    {/* Info del Usuario */}
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="h-9 w-9 shrink-0 rounded-full bg-[var(--admin-primary)] flex items-center justify-center text-xs font-bold text-[var(--admin-primary-text)] shadow-inner border border-white/10">
                            {user?.nombre?.charAt(0).toUpperCase()}
                        </div>
                        
                        {expanded && (
                            <div className="flex flex-col truncate">
                                <span className="text-sm font-semibold text-white truncate">
                                    {user?.nombre}
                                </span>
                                <span className="text-[10px] text-[var(--admin-text-muted)] truncate">
                                    {user?.rol?.toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Botón Cerrar Sesión */}
                    {expanded ? (
                        <button
                            onClick={logout}
                            className="text-[var(--admin-sidebar-text)] opacity-60 hover:opacity-100 hover:text-[var(--admin-destructive)] hover:bg-[var(--admin-sidebar-hover)] p-2 rounded-lg transition-all"
                            title="Cerrar sesión"
                        >
                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    ) : (
                        <button
                            onClick={logout}
                            className="text-[var(--admin-sidebar-text)] opacity-60 hover:opacity-100 hover:text-[var(--admin-destructive)] p-1 transition-all"
                            title="Cerrar sesión"
                        >
                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
}