"use client";

import { User } from "@/src/schemas";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import AdminMenu from "./AdminMenu";
import Logo from "../ui/Logo";

// Íconos
import {
    Package,
    Users,
    Tag,
    Receipt,
    BarChart3,
    ShoppingCart,
    ChevronDown,
    ChevronRight,
} from "lucide-react";
import {
    TbLayoutSidebarLeftCollapse,
    TbLayoutSidebarLeftExpand,
} from "react-icons/tb";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Props = { user: User };

type NavLink = {
    href?: string;
    icon: React.ElementType;
    label: string;
    children?: { href: string; label: string }[];
};

// ---------------------
// LINKS DE NAVEGACIÓN
// ---------------------
const links: NavLink[] = [
    { href: "/admin/products", icon: Package, label: "Productos" },
    { href: "/admin/clients", icon: Users, label: "Clientes" },
    { href: "/admin/products/category", icon: Tag, label: "Categorías" },
    { href: "/admin/orders", icon: Receipt, label: "Órdenes" },
    { href: "/admin/reports", icon: BarChart3, label: "Reportes" },
    {
        icon: Users,
        label: "Usuarios",
        children: [
            { href: "/admin/clients", label: "Lista de usuarios" },
            { href: "/admin/users/roles", label: "Roles y permisos" },
        ],
    },
    { href: "/pos", icon: ShoppingCart, label: "POS" },
];

// ---------------------
// COMPONENTE PRINCIPAL
// ---------------------
export default function AdminSidebar({ user }: Props) {
    const pathname = usePathname();
    const [expanded, setExpanded] = useState(true);
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    // Cambia el estado de un menú con hijos
    const toggleMenu = (label: string) =>
        setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));

    // Clases base de los links
    const linkClasses = (active: boolean) =>
        cn(
            "relative flex items-center gap-2 rounded-md px-3 py-2 text-base font-semibold transition-colors",
            active
                ? "text-blue-600 bg-blue-50 font-semibold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        );

    return (
        <aside
            className={cn(
                "h-screen flex flex-col border-r border-slate-200 bg-white shadow-sm rounded-r-2xl py-4 transition-all duration-300",
                expanded ? "w-44" : "w-14"
            )}
        >
            {/* ---------------------
          HEADER (Logo + Botón)
      --------------------- */}
            <div className="flex items-center justify-between px-3 h-16 border-b">
                {expanded && <Logo />}
                <button
                    onClick={() => setExpanded((e) => !e)}
                    className="p-2 rounded-md hover:bg-slate-100"
                >
                    {expanded ? (
                        <TbLayoutSidebarLeftCollapse className="h-5 w-5 text-slate-500" />
                    ) : (
                        <TbLayoutSidebarLeftExpand className="h-5 w-5 text-slate-500" />
                    )}
                </button>
            </div>

            {/* ---------------------
          NAVEGACIÓN PRINCIPAL
      --------------------- */}
            <nav className="flex-1 mt-2 px-2 space-y-4 overflow-auto">
                {links.map(({ href, icon: Icon, label, children }) => {
                    const active = href && pathname === href;

                    // Caso: Menú con sublinks
                    if (children) {
                        const isOpen = openMenus[label];
                        return (
                            <div key={label}>
                                <button
                                    onClick={() => toggleMenu(label)}
                                    className={linkClasses(isOpen)}
                                >
                                    <Icon className="h-5 w-5 shrink-0" />
                                    {expanded && <span className="flex-1">{label}</span>}
                                    {expanded &&
                                        (isOpen ? (
                                            <ChevronDown className="h-4 w-4 text-slate-400" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4 text-slate-400" />
                                        ))}
                                </button>

                                {/* Sublinks */}
                                {isOpen && expanded && (
                                    <div className="ml-8 mt-1 space-y-1">
                                        {children.map((sub) => {
                                            const subActive = pathname === sub.href;
                                            return (
                                                <Link
                                                    key={sub.href}
                                                    href={sub.href}
                                                    className={linkClasses(subActive)}
                                                >
                                                    {sub.label}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    // Caso: Link simple
                    return (
                        <Tooltip key={label} delayDuration={300}>
                            <TooltipTrigger asChild>
                                <Link href={href!} className={linkClasses(!!active)}>
                                    {active && (
                                        <span className="absolute left-0 top-0 h-full w-[3px] bg-blue-600 rounded-r" />
                                    )}
                                    <Icon className="h-4 w-4 shrink-0" />
                                    {expanded && <span>{label}</span>}
                                </Link>
                            </TooltipTrigger>
                            {!expanded && <TooltipContent side="right">{label}</TooltipContent>}
                        </Tooltip>
                    );
                })}
            </nav>

            {/* ---------------------
          FOOTER (Usuario + Menú)
      --------------------- */}
            <div className="border-t border-slate-200 p-3 flex items-center gap-3 bg-slate-50">
                {expanded && (
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm truncate uppercase font-black">{user?.nombre}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                )}
                <AdminMenu user={user} />
            </div>
        </aside>
    );
}
