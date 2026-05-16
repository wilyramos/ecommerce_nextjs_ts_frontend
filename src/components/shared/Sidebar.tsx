/* File: src/components/shared/Sidebar.tsx 
    @Author: whramos 
    @Description: Sidebar minimalista optimizado para Tailwind v4 con consumo semántico estricto.
*/

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    ShoppingCart,
    FileText,
    History,
    DollarSign,
    Users,
    Package,
    BarChart3,
    Settings,
    LogOut,
    LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCashStore } from "@/src/store/useCashStore";
import { logoutAction } from "@/src/actions/auth-actions";
import type { User } from "@/src/schemas";
import Logo from "@/components/ui/Logo";

interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
    roles?: string[];
}

const ROUTES: NavItem[] = [
    { label: "POS", href: "/pos", icon: ShoppingCart, roles: ["administrador", "vendedor"] },
    { label: "Caja", href: "/cash-shift", icon: DollarSign, roles: ["administrador", "vendedor"] },
    { label: "Ventas", href: "/sales", icon: History, roles: ["administrador", "vendedor"] },
    { label: "Proformas", href: "/quotes", icon: FileText, roles: ["administrador", "vendedor"] },
    { label: "Productos", href: "/inventory", icon: Package, roles: ["administrador", "vendedor"] },
    { label: "Clientes", href: "/customers", icon: Users, roles: ["administrador", "vendedor"] },
    { label: "Reportes", href: "/reports", icon: BarChart3, roles: ["administrador"] },
    { label: "Ajustes", href: "/settings", icon: Settings, roles: ["administrador"] },
];

export const Sidebar = ({ user }: { user: User }) => {
    const pathname = usePathname();
    const { isOpen } = useCashStore();

    const handleLogout = async () => {
        if (isOpen) {
            const confirm = window.confirm("La caja sigue abierta. ¿Desea cerrar sesión?");
            if (!confirm) return;
        }
        await logoutAction();
    };

    const filteredRoutes = ROUTES.filter(
        route => !route.roles || route.roles.includes(user.rol || "")
    );

    return (
        <aside className="hidden lg:flex h-screen w-20 flex-col items-center border-r py-6 bg-text-inverse border-accent-warm-light">

            {/* Brand Logo Container */}
            <div className="mb-6 flex h-10 w-10 items-center justify-center">
                <Logo size={20} />
            </div>

            <div className="mb-6 w-10 h-px bg-accent-warm-light" />

            {/* Navigation Flow */}
            <nav className="flex flex-1 flex-col gap-3">
                {filteredRoutes.map((route) => {
                    const isActive = pathname.startsWith(route.href);
                    return (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "group flex flex-col items-center justify-center gap-1 w-14 h-14 rounded-sm transition-all",
                                isActive
                                    ? "bg-accent-warm text-text-inverse"
                                    : "text-text-tertiary hover:bg-accent-warm-light hover:text-accent-warm"
                            )}
                            title={route.label}
                        >
                            <route.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[8px] font-black uppercase tracking-tighter leading-none">
                                {route.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto w-10 h-px bg-accent-warm-light mb-6" />

            {/* System Termination Action */}
            <button
                onClick={handleLogout}
                className="group flex flex-col items-center justify-center gap-1 w-14 h-14 rounded-sm text-text-tertiary hover:bg-accent-warm-light hover:text-accent-warm-hover transition-colors cursor-pointer"
                title="Cerrar sesión"
            >
                <LogOut size={20} />
                <span className="text-[8px] font-black uppercase">Salir</span>
            </button>
        </aside>
    );
};