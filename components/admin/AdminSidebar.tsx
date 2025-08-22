"use client";

import { User } from "@/src/schemas";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import AdminMenu from "./AdminMenu";

import {
    Home,
    Package,
    Users,
    Tag,
    Receipt,
    BarChart3,
    ShoppingCart,
    ChevronDown,
    ChevronRight,
} from "lucide-react";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from "react-icons/tb";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import Logo from "../ui/Logo";

type Props = {
    user: User;
};

type NavLink = {
    href?: string;
    icon: React.ElementType;
    label: string;
    children?: { href: string; label: string }[];
};

const links: NavLink[] = [
    { href: "/admin", icon: Home, label: "Dashboard" },
    { href: "/admin/products", icon: Package, label: "Productos" },
    { href: "/admin/clients", icon: Users, label: "Clientes" },
    { href: "/admin/products/category", icon: Tag, label: "Categorías" },
    { href: "/admin/orders", icon: Receipt, label: "Órdenes" },
    { href: "/admin/reports", icon: BarChart3, label: "Reportes" },
    {
        icon: Users,
        label: "Usuarios",
        children: [
            { href: "/admin/users/create", label: "Crear usuario" },
            { href: "/admin/users", label: "Lista de usuarios" },
            { href: "/admin/users/roles", label: "Roles y permisos" },
        ],
    },
    { href: "/pos", icon: ShoppingCart, label: "POS" },
];

export default function AdminSidebar({ user }: Props) {
    const pathname = usePathname();
    const [expanded, setExpanded] = useState(true);
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    const toggleMenu = (label: string) => {
        setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
    };

    // 🎨 Estilo Shopify
    const activeLinkClass =
        "text-gray-900 bg-gray-200";
    const inactiveLinkClass =
        "text-black text-sm hover:bg-gray-100 hover:text-gray-900";

    return (
        <motion.aside
            animate={{ width: expanded ? 180 : 56 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={cn(
                "h-screen flex flex-col border-r border-gray-200 overflow-hidden bg-white text-gray-900 shadow-xs rounded-r-2xl py-4"
            )}
        >
            {/* Header Sidebar */}
            <div className="flex items-center justify-between px-3 h-16 border-b border-gray-200">
                {expanded && (
                    <Logo />
                )}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                    {expanded ? (
                        < TbLayoutSidebarLeftCollapse className="h-5 w-5 text-gray-500" />
                    ) : (
                        <TbLayoutSidebarLeftExpand className="h-5 w-5 text-gray-500" />
                    )}
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 mt-2 px-2 space-y-1">
                {links.map(({ href, icon: Icon, label, children }) => {
                    const active = href && pathname === href;

                    if (children) {
                        const isOpen = openMenus[label];
                        return (
                            <div key={label}>
                                <button
                                    onClick={() => toggleMenu(label)}
                                    className={cn(
                                        "relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                        isOpen ? activeLinkClass : inactiveLinkClass
                                    )}
                                >
                                    <Icon className="h-5 w-5 shrink-0" />
                                    {expanded && <span className="flex-1 text-left">{label}</span>}
                                    {expanded &&
                                        (isOpen ? (
                                            <ChevronDown className="h-4 w-4 text-gray-400" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4 text-gray-400" />
                                        ))}
                                </button>
                                {isOpen && expanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        transition={{ duration: 0.2 }}
                                        className="ml-8 mt-1 space-y-1"
                                    >
                                        {children.map((sub) => {
                                            const subActive = pathname === sub.href;
                                            return (
                                                <Link
                                                    key={sub.label}
                                                    href={sub.href}
                                                    className={cn(
                                                        "block rounded-md px-3 py-2 text-sm transition-colors",
                                                        subActive ? activeLinkClass : inactiveLinkClass
                                                    )}
                                                >
                                                    {sub.label}
                                                </Link>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <Tooltip key={label} delayDuration={300}>
                            <TooltipTrigger asChild>
                                <Link
                                    href={href!}
                                    className={cn(
                                        "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                        active ? activeLinkClass : inactiveLinkClass
                                    )}
                                >
                                    {active && (
                                        <motion.span
                                            layoutId="active-indicator"
                                            className="absolute left-0 top-0 h-full w-[3px] bg-orange-500 rounded-r"
                                        />
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

            {/* Footer user info */}
            <div className="border-t border-gray-200 p-3 flex items-center gap-3 bg-gray-50">
                {expanded && (
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm truncate uppercase font-black">{user?.nombre}</p>
                        <p className="text-xs text-gray-500 truncate">
                            {user?.email}
                        </p>
                    </div>
                )}
                <AdminMenu user={user} />
            </div>
        </motion.aside>
    );
}