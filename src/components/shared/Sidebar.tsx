/* File: src/components/shared/Sidebar.tsx 
    @Author: whramos 
    @Description: Persistent navigation for the POS shell. 
    Synchronized with CashStore and AuthActions.
*/

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    ShoppingCart, Package, BarChart3, Settings,
    History, Monitor, LogOut, LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCashStore } from "@/src/store/useCashStore";
import { logoutAction } from "@/src/actions/auth-actions";
import type { User } from "@/src/schemas";

interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
}

const NAVIGATION_ROUTES: NavItem[] = [
    { label: "Venta", href: "/terminal", icon: ShoppingCart },
    { label: "Historial", href: "/sales", icon: History },
    { label: "Inventario", href: "/inventory", icon: Package },
    { label: "Reportes", href: "/reports", icon: BarChart3 },
    { label: "Ajustes", href: "/settings", icon: Settings },
];

export const Sidebar = ({ user }: { user: User }) => {
    const pathname = usePathname();
    const { isOpen } = useCashStore();

    const handleLogout = async () => {
        if (isOpen) {
            const confirm = window.confirm("La caja sigue abierta. ¿Desea cerrar sesión de todos modos?");
            if (!confirm) return;
        }
        await logoutAction();
    };

    return (
        <aside className="hidden lg:flex w-24 flex-col items-center border-r border-slate-200 bg-white py-8 z-50 shrink-0">
            {/* Branding */}
            <div className="mb-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white shadow-xl shadow-black/20">
                <Monitor size={28} strokeWidth={2.5} />
            </div>

            {/* Nav Links */}
            <nav className="flex flex-1 flex-col gap-4">
                {NAVIGATION_ROUTES.map((route) => (
                    <SidebarItem 
                        key={route.href}
                        {...route}
                        active={pathname.startsWith(route.href)}
                    />
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="flex flex-col items-center gap-6 border-t border-slate-100 pt-8">
                <div className="flex flex-col items-center text-center px-2">
                    <p className="text-[10px] font-black uppercase text-slate-800 leading-none truncate w-16">
                        {user.nombre || "Usuario"}
                    </p>
                    <p className="text-[8px] font-bold uppercase text-slate-400 mt-1 tracking-tighter">
                        {user.rol}
                    </p>
                </div>

                <button 
                    onClick={handleLogout}
                    className="flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 group"
                >
                    <LogOut size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                    <span className="text-[9px] font-black uppercase tracking-tighter">Salir</span>
                </button>
            </div>
        </aside>
    );
};

const SidebarItem = ({ label, href, icon: Icon, active }: NavItem & { active: boolean }) => (
    <Link 
        href={href} 
        className={cn(
            "flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-2xl transition-all duration-300",
            active 
                ? "bg-black text-white scale-105 shadow-lg shadow-black/10" 
                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
        )}
    >
        <Icon size={22} strokeWidth={active ? 2.5 : 2} />
        <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
    </Link>
);