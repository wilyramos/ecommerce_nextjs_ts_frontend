// File: frontend/components/POS/MobileSidebarPOS.tsx
"use client";

import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@/src/schemas";
import {
    HiOutlineShoppingCart,
    HiOutlineCube,
    HiOutlineUsers,
    HiOutlineHome,
} from "react-icons/hi2";
import Logo from "../ui/Logo";
import { logout } from "@/actions/logout-user-action";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function MobileSidebarPOS({ user }: { user: User }) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const links = [
        { href: "/pos", label: "Inicio", icon: HiOutlineHome },
        { href: "/pos/ventas", label: "Ventas", icon: HiOutlineShoppingCart },
        { href: "/pos/compras", label: "Compras", icon: HiOutlineShoppingCart }, // Podrías cambiar el icono luego
        { href: "/pos/productos", label: "Productos", icon: HiOutlineCube },
        { href: "/pos/clientes", label: "Clientes", icon: HiOutlineUsers },
    ];

    const handleClose = () => setOpen(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="md:hidden p-2 rounded-md text-[var(--admin-text)] hover:bg-[var(--store-surface-hover)] transition-colors">
                <Menu className="h-6 w-6" />
            </SheetTrigger>

            {/* Contenedor del menú con la paleta Dark del Admin */}
            <SheetContent side="left" className="p-0 w-[280px] bg-[var(--admin-sidebar-bg)] border-r border-[#1F2937] flex flex-col overflow-hidden text-[var(--admin-sidebar-text)] shadow-2xl">
                
                <SheetHeader>
                    <VisuallyHidden>
                        <SheetTitle>Menú de navegación del POS</SheetTitle>
                    </VisuallyHidden>
                </SheetHeader>

                {/* Header del Sidebar (Logo) */}
                <div className="h-16 flex items-center px-6 border-b border-[#1F2937] bg-[var(--admin-sidebar-bg)] shrink-0">
                    <div className="text-white"> {/* Forzamos el texto a blanco por si tu Logo hereda colores */}
                        <Logo color="white" />
                    </div>
                </div>

                {/* Navegación Scrolleable */}
                <nav className="flex-1 space-y-1 px-3 py-5 overflow-y-auto custom-scrollbar">
                    <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--admin-text-muted)] mb-3">
                        Punto de Venta
                    </p>
                    
                    {links.map(({ href, label, icon: Icon }) => {
                        const active = pathname === href;

                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={handleClose}
                                className={cn(
                                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                    active
                                        ? "bg-[var(--admin-sidebar-hover)] text-white shadow-sm"
                                        : "text-[var(--admin-sidebar-text)] opacity-70 hover:opacity-100 hover:bg-[var(--admin-sidebar-hover)]"
                                )}
                            >
                                <Icon className={cn(
                                    "h-5 w-5 transition-colors", 
                                    active ? "text-[var(--admin-info)]" : "text-[var(--admin-text-muted)] group-hover:text-white"
                                )} />
                                <span>{label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer del Sidebar (Usuario y Logout) */}
                <div className="border-t border-[#1F2937] p-4 bg-[var(--admin-sidebar-bg)] shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-[var(--admin-primary)] flex items-center justify-center text-xs font-bold text-[var(--admin-primary-text)] shadow-inner border border-white/10">
                                {user?.nombre?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col max-w-[120px]">
                                <span className="text-sm font-semibold text-white truncate">
                                    {user?.nombre}
                                </span>
                                <span className="text-[10px] text-[var(--admin-text-muted)] truncate">
                                    {user?.rol?.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={logout}
                            className="text-[var(--admin-sidebar-text)] opacity-60 hover:opacity-100 hover:text-[var(--admin-destructive)] hover:bg-[var(--admin-sidebar-hover)] p-2 rounded-lg text-sm transition-all"
                            title="Cerrar sesión"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}