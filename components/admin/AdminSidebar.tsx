"use client";

import { User } from "@/src/schemas";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import AdminMenu from "./AdminMenu";
import Logo from "../ui/Logo";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    LayoutDashboard, // Dashboard
    ShoppingBag,     // Productos (Más retail que Package)
    Users,           // Clientes
    ClipboardList,   // Órdenes (Mejor que Receipt para gestión)
    Briefcase,       // Marcas (Ideal para tienda de cuero/negocios)
    Layers,          // Categorías (Estándar para jerarquías)
    LineChart,       // Reportes (Visualmente más limpio)
    UserCog,         // Usuarios Sistema (Diferente a clientes)
    Store,           // Punto de Venta (Tienda física)
    ChevronDown,
    ChevronRight,
} from "lucide-react";

type Props = { user: User };

type NavLink = {
    href?: string;
    icon: React.ElementType;
    label: string;
    children?: { href: string; label: string }[];
};

// Only neutral palette: gray-50, black, zinc-400, zinc-600

const links: NavLink[] = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/products", icon: ShoppingBag, label: "Productos" },
    { href: "/admin/clients", icon: Users, label: "Clientes" },
    { href: "/admin/orders", icon: ClipboardList, label: "Órdenes" },
    { href: "/admin/brands", icon: Briefcase, label: "Marcas" },
    { href: "/admin/products/category", icon: Layers, label: "Categorías" },
    { href: "/admin/reports", icon: LineChart, label: "Reportes" },
    {
        icon: UserCog,
        label: "Usuarios",
        children: [
            { href: "/admin/users", label: "Lista de usuarios" },
            { href: "/admin/users/roles", label: "Roles y permisos" },
        ],
    },
    { href: "/pos", icon: Store, label: "Punto de Venta" },
];

export default function AdminSidebar({ user }: Props) {
    const pathname = usePathname();
    const [expanded, setExpanded] = useState(true);
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    const toggleMenu = (label: string) => {
        if (!expanded) {
            setExpanded(true);
            setTimeout(() => setOpenMenus((p) => ({ ...p, [label]: true })), 150);
        } else setOpenMenus((p) => ({ ...p, [label]: !p[label] }));
    };

    return (
        <TooltipProvider>
            <aside
                className={cn(
                    "hidden md:flex relative h-screen flex-col  border-zinc-600 bg-gray-50 text-black transition-all duration-300 shadow-md",
                    expanded ? "w-54" : "w-[80px]"
                )}
            >
                <button
                    onClick={() => {
                        setExpanded((c) => !c);
                        setOpenMenus({});
                    }}
                    className="absolute -right-3 top-9 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-400 bg-gray-50 text-zinc-600 hover:bg-gray-50 hover:text-black"
                >
                    <ChevronRight className={cn("h-3 w-3 transition-transform", expanded && "rotate-180")} />
                </button>

                <div className={cn("flex h-20 items-center px-6", expanded ? "justify-start" : "justify-center")}>
                    <div className={cn(expanded ? "opacity-100" : "opacity-100 w-8")}> <Logo /> </div>
                </div>

                <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-zinc-400">
                    {links.map((item) => {
                        const { href, icon: Icon, label, children } = item;

                        if (children) {
                            const isOpen = openMenus[label];
                            const isChildActive = children.some((c) => c.href === pathname);

                            return (
                                <div key={label} className="space-y-1">
                                    <Tooltip delayDuration={0}>
                                        <TooltipTrigger asChild>
                                            <button
                                                onClick={() => toggleMenu(label)}
                                                className={cn(
                                                    "group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-gray-50",
                                                    isChildActive ? "text-black bg-gray-50" : "text-zinc-600"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Icon className={cn("h-5 w-5 text-zinc-600 group-hover:text-black", isChildActive && "text-black")} />
                                                    <span className={cn(expanded ? "opacity-100" : "opacity-0 hidden")}>{label}</span>
                                                </div>
                                                {expanded && (
                                                    <ChevronDown className={cn("h-4 w-4 text-zinc-600 transition-transform", isOpen && "rotate-180")} />
                                                )}
                                            </button>
                                        </TooltipTrigger>
                                        {!expanded && <TooltipContent side="right" className="bg-black text-gray-50">{label}</TooltipContent>}
                                    </Tooltip>

                                    <div
                                        className={cn(
                                            "grid overflow-hidden transition-all",
                                            isOpen && expanded ? "grid-rows-[1fr] mt-1" : "grid-rows-[0fr]"
                                        )}
                                    >
                                        <div className="min-h-0 space-y-1 pl-10 pr-2">
                                            <div className="relative border-l border-zinc-400 pl-3 space-y-1">
                                                {children.map((sub) => {
                                                    const isActive = pathname === sub.href;
                                                    return (
                                                        <Link
                                                            key={sub.href}
                                                            href={sub.href}
                                                            className={cn(
                                                                "block rounded-lg px-3 py-2 text-sm",
                                                                isActive ? "bg-gray-50 text-black font-semibold" : "text-zinc-600 hover:text-black hover:bg-gray-50"
                                                            )}
                                                        >
                                                            {sub.label}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        const isActive = href && pathname === href;

                        return (
                            <Tooltip key={label} delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={href!}
                                        className={cn(
                                            "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                                            isActive ? "bg-black text-gray-50" : "text-zinc-600 hover:text-black hover:bg-gray-50"
                                        )}
                                    >
                                        <Icon className={cn("h-5 w-5", isActive ? "text-gray-50" : "text-zinc-600 group-hover:text-black")} />
                                        <span className={cn(expanded ? "opacity-100" : "opacity-0 hidden")}>{label}</span>
                                    </Link>
                                </TooltipTrigger>
                                {!expanded && <TooltipContent side="right" className="bg-black text-gray-50">{label}</TooltipContent>}
                            </Tooltip>
                        );
                    })}
                </nav>

                <div className="border-zinc-400 p-4 bg-gray-50">
                    <div className={cn("flex items-center gap-3 rounded-xl bg-gray-50 p-2", expanded ? "justify-between" : "justify-center")}>
                        {expanded ? (
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="h-8 w-8 rounded-full bg-zinc-400 flex items-center justify-center text-xs font-bold text-black">
                                    {user?.nombre?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col truncate">
                                    <span className="text-xs font-bold text-black truncate">{user?.nombre}</span>
                                    <span className="text-[10px] text-zinc-600 truncate">{user?.email}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="h-8 w-8 rounded-full bg-zinc-400 flex items-center justify-center text-xs font-bold text-black">{user?.nombre?.charAt(0).toUpperCase()}</div>
                        )}

                        {expanded && <AdminMenu user={user} />}
                    </div>
                </div>
            </aside>
        </TooltipProvider>
    );
}