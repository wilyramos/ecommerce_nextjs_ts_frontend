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
    type LucideIcon
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
        <aside className="hidden lg:flex h-screen w-[72px] flex-col items-center border-r border-border bg-background py-4 select-none">

            {/* Brand Logo Container */}
            <div className="mb-4 flex h-10 w-10 items-center justify-center transition-transform duration-200 hover:scale-95">
                <Logo />
            </div>

            <div className="mb-4 w-8 h-px bg-border/60" />

            {/* Navigation Flow */}
            <nav className="flex flex-1 flex-col gap-1 w-full px-2">
                {filteredRoutes.map((route) => {
                    const isActive = pathname.startsWith(route.href);
                    return (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "group flex flex-col items-center justify-center gap-1 w-full aspect-square rounded-sm transition-colors outline-none",
                                isActive
                                    ? "bg-foreground text-background font-bold shadow-2xs"
                                    : "text-muted-foreground hover:bg-background-secondary/60 hover:text-foreground"
                            )}
                            title={route.label}
                        >
                            <route.icon size={18} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                            <span className="text-[9px] font-bold uppercase tracking-tight leading-none">
                                {route.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto w-8 h-px bg-border/60 mb-4" />

            {/* System Termination Action */}
            <div className="w-full px-2">
                <button
                    onClick={handleLogout}
                    className="group flex flex-col items-center justify-center gap-1 w-full aspect-square rounded-sm text-muted-foreground hover:bg-background-secondary/60 hover:text-foreground transition-colors cursor-pointer outline-none"
                    title="Cerrar sesión"
                >
                    <LogOut size={18} className="shrink-0" />
                    <span className="text-[9px] font-bold uppercase tracking-tight leading-none">Salir</span>
                </button>
            </div>
        </aside>
    );
};