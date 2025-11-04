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

const links: NavLink[] = [
    { href: "/admin/products", icon: Package, label: "Productos" },
    { href: "/admin/clients", icon: Users, label: "Clientes" },
    { href: "/admin/products/category", icon: Tag, label: "Categorías" },
    { href: "/admin/orders", icon: Receipt, label: "Órdenes" },
    { href: "/admin/reports", icon: BarChart3, label: "Reportes" },
    { href: "/admin/brands", icon: Tag, label: "Marcas" },
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

export default function AdminSidebar({ user }: Props) {
    const pathname = usePathname();
    const [expanded, setExpanded] = useState(true);
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    const toggleMenu = (label: string) =>
        setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));

    const linkClasses = (active: boolean) =>
        cn(
            "relative flex items-center gap-2 rounded-md px-3 py-2 text-base transition-colors",
            active
                ? "text-black bg-gray-200 font-semibold"
                : "text-gray-600 hover:text-black hover:bg-gray-200"
        );

    return (
        <aside
  className={cn(
    "fixed top-0 left-0 h-screen flex flex-col border-r border-gray-200 bg-white py-4 transition-all duration-300 overflow-y-auto",
    expanded ? "w-44" : "w-14"
  )}
>
            {/* HEADER */}
            <div className="flex items-center justify-between px-3 h-16 border-b border-gray-200">
                {expanded && <Logo />}
                <button
                    onClick={() => setExpanded((e) => !e)}
                    className="p-2 rounded-md hover:bg-gray-200"
                >
                    {expanded ? (
                        <TbLayoutSidebarLeftCollapse className="h-5 w-5 text-gray-600" />
                    ) : (
                        <TbLayoutSidebarLeftExpand className="h-5 w-5 text-gray-600" />
                    )}
                </button>
            </div>

            {/* NAV */}
            <nav className="flex-1 mt-2 px-2 space-y-4 overflow-auto">
                {links.map(({ href, icon: Icon, label, children }) => {
                    const active = href && pathname === href;

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
                                            <ChevronDown className="h-4 w-4 text-gray-600" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4 text-gray-600" />
                                        ))}
                                </button>

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

                    return (
                        <Tooltip key={label} delayDuration={300}>
                            <TooltipTrigger asChild>
                                <Link href={href!} className={linkClasses(!!active)}>
                                    {active && (
                                        <span className="absolute left-0 top-0 h-full w-[3px] bg-black rounded-r" />
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

            {/* FOOTER */}
            <div className="border-t border-gray-200 p-3 flex items-center gap-3 bg-gray-100">
                {expanded && (
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm truncate uppercase font-bold">{user?.nombre}</p>
                        <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                    </div>
                )}
                <AdminMenu user={user} />
            </div>
        </aside>
    );
}