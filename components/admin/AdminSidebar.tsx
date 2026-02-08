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
    ShoppingBag,     // Productos
    Users,           // Clientes
    ClipboardList,   // Órdenes
    Briefcase,       // Marcas
    Tags,            // <--- ICONO PARA LÍNEAS
    Layers,          // Categorías
    LineChart,       // Reportes
    UserCog,         // Usuarios Sistema
    Store,           // Punto de Venta
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

const links: NavLink[] = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/products", icon: ShoppingBag, label: "Productos" },
    { href: "/admin/clients", icon: Users, label: "Clientes" },
    { href: "/admin/orders", icon: ClipboardList, label: "Órdenes" },
    
    // --- BLOQUE DE CATALOGO ---
    { href: "/admin/brands", icon: Briefcase, label: "Marcas" },
    { href: "/admin/lines", icon: Tags, label: "Líneas" }, // <--- NUEVA RUTA
    { href: "/admin/products/category", icon: Layers, label: "Categorías" },
    // --------------------------

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
                    "hidden md:flex relative h-screen flex-col border-r border-zinc-200 bg-gray-50 text-black transition-all duration-300 shadow-sm",
                    expanded ? "w-64" : "w-[80px]"
                )}
            >
                {/* Botón Colapsar */}
                <button
                    onClick={() => {
                        setExpanded((c) => !c);
                        setOpenMenus({});
                    }}
                    className="absolute -right-3 top-9 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 hover:text-black hover:border-zinc-400 shadow-sm transition-colors"
                >
                    <ChevronRight className={cn("h-3 w-3 transition-transform duration-300", expanded && "rotate-180")} />
                </button>

                {/* Logo Area */}
                <div className={cn("flex h-20 items-center px-6 transition-all", expanded ? "justify-start" : "justify-center")}>
                    <div className={cn("transition-opacity duration-300", expanded ? "opacity-100" : "opacity-100 scale-90")}> 
                        <Logo /> 
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-zinc-300">
                    {links.map((item) => {
                        const { href, icon: Icon, label, children } = item;

                        // Lógica para submenús
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
                                                    "group flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                                    // Estilo Apple: Hover sutil gris, Texto oscuro
                                                    isChildActive ? "bg-zinc-200 text-black font-semibold" : "text-zinc-500 hover:bg-zinc-200 hover:text-black"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Icon className={cn("h-5 w-5 transition-colors", isChildActive ? "text-black" : "text-zinc-400 group-hover:text-black")} />
                                                    <span className={cn("transition-opacity duration-200", expanded ? "opacity-100" : "opacity-0 hidden")}>{label}</span>
                                                </div>
                                                {expanded && (
                                                    <ChevronDown className={cn("h-4 w-4 text-zinc-400 transition-transform duration-200", isOpen && "rotate-180")} />
                                                )}
                                            </button>
                                        </TooltipTrigger>
                                        {!expanded && <TooltipContent side="right" className="bg-black text-white border-black">{label}</TooltipContent>}
                                    </Tooltip>

                                    {/* Submenú Animado */}
                                    <div
                                        className={cn(
                                            "grid overflow-hidden transition-all duration-300 ease-in-out",
                                            isOpen && expanded ? "grid-rows-[1fr] mt-1 opacity-100" : "grid-rows-[0fr] opacity-0"
                                        )}
                                    >
                                        <div className="min-h-0 space-y-0.5 pl-10 pr-2">
                                            <div className="relative border-l border-zinc-300 pl-3 space-y-1 py-1">
                                                {children.map((sub) => {
                                                    const isActive = pathname === sub.href;
                                                    return (
                                                        <Link
                                                            key={sub.href}
                                                            href={sub.href}
                                                            className={cn(
                                                                "block rounded-md px-3 py-1.5 text-sm transition-colors",
                                                                isActive 
                                                                    ? "bg-zinc-200 text-black font-semibold" 
                                                                    : "text-zinc-500 hover:text-black hover:bg-zinc-100"
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

                        // Lógica para enlaces simples
                        const isActive = href && pathname === href;

                        return (
                            <Tooltip key={label} delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={href!}
                                        className={cn(
                                            "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all",
                                            // Estilo Activo: Negro Sólido (Apple style focus)
                                            isActive 
                                                ? "bg-black text-white shadow-sm" 
                                                : "text-zinc-500 hover:text-black hover:bg-zinc-200"
                                        )}
                                    >
                                        <Icon className={cn("h-5 w-5", isActive ? "text-zinc-300" : "text-zinc-400 group-hover:text-black")} />
                                        <span className={cn("transition-opacity duration-200", expanded ? "opacity-100" : "opacity-0 hidden")}>{label}</span>
                                    </Link>
                                </TooltipTrigger>
                                {!expanded && <TooltipContent side="right" className="bg-black text-white border-black">{label}</TooltipContent>}
                            </Tooltip>
                        );
                    })}
                </nav>

                {/* Footer Usuario */}
                <div className="border-t border-zinc-200 p-4 bg-gray-50/50">
                    <div className={cn("flex items-center gap-3 rounded-xl p-2 transition-all hover:bg-zinc-200 cursor-pointer", expanded ? "justify-between" : "justify-center")}>
                        {expanded ? (
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="h-9 w-9 rounded-full bg-zinc-200 flex items-center justify-center text-sm font-bold text-zinc-700 border border-zinc-300">
                                    {user?.nombre?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col truncate">
                                    <span className="text-sm font-bold text-black truncate">{user?.nombre}</span>
                                    <span className="text-[11px] text-zinc-500 truncate">{user?.email}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="h-9 w-9 rounded-full bg-zinc-200 flex items-center justify-center text-sm font-bold text-zinc-700 border border-zinc-300">
                                {user?.nombre?.charAt(0).toUpperCase()}
                            </div>
                        )}

                        {expanded && <AdminMenu user={user} />}
                    </div>
                </div>
            </aside>
        </TooltipProvider>
    );
}