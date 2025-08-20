"use client";

import { User } from "@/src/schemas";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { cn } from "@/lib/utils";
import AdminMenu from "./AdminMenu";

import {
    Home,
    Package,
    Users,
    Tag,
    Receipt,
    BarChart3,
    ChevronLeft,
    ChevronRight,
    ShoppingCart
} from "lucide-react";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import Logo from "../ui/Logo";

type Props = {
    user: User;
};

const links = [
    { href: "/admin", icon: Home, label: "Dashboard" },
    { href: "/admin/products", icon: Package, label: "Productos" },
    { href: "/admin/clients", icon: Users, label: "Clientes" },
    { href: "/admin/products/category", icon: Tag, label: "Categorías" },
    { href: "/admin/orders", icon: Receipt, label: "Órdenes" },
    { href: "/admin/reports", icon: BarChart3, label: "Reportes" },
    { href: "/admin/users", icon: Users, label: "Usuarios" },
    { href: "/pos", icon: ShoppingCart, label: "Punto de Venta" }
];

export default function AdminSidebar({ user }: Props) {
    const pathname = usePathname();
    const [expanded, setExpanded] = useState(true);

    return (
        <motion.aside
            animate={{ width: expanded ? 240 : 72 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={cn(
                "h-screen flex flex-col bg-white dark:bg-gray-950 shadow-md border-r overflow-hidden"
            )}
        >
            {/* Header con toggle */}
            <div className="flex items-center justify-between px-4 h-14 border-b bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
                {expanded && (
                    <span className="font-semibold text-gray-900 dark:text-white">
                        <Logo />
                    </span>
                )}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    {expanded ? <ChevronLeft /> : <ChevronRight />}
                </button>
            </div>

            {/* Menú */}
            <nav className="flex-1 mt-2 px-2 space-y-1">
                {links.map(({ href, icon: Icon, label }) => {
                    const active = pathname === href;
                    return (
                        <Tooltip key={label} delayDuration={200}>
                            <TooltipTrigger asChild>
                                <Link
                                    href={href}
                                    className={clsx(
                                        "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all group",
                                        active
                                            ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                                            : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                    )}
                                >
                                    {active && (
                                        <motion.span
                                            layoutId="active-indicator"
                                            className="absolute left-0 top-0 h-full w-[3px] bg-blue-500 rounded-r"
                                        />
                                    )}
                                    <Icon className="h-5 w-5 shrink-0" />
                                    {expanded && <span>{label}</span>}
                                </Link>
                            </TooltipTrigger>
                            {!expanded && (
                                <TooltipContent side="right">
                                    {label}
                                </TooltipContent>
                            )}
                        </Tooltip>
                    );
                })}
            </nav>

            {/* Footer con user + menú */}
            <div className="border-t p-3 flex items-center gap-3">
                <div className="flex items-center gap-2 flex-1 overflow-hidden">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
                        {user?.nombre?.[0] ?? "U"}
                    </div>
                    {expanded && (
                        <div className="truncate">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {user?.nombre}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {user?.email}
                            </p>
                        </div>
                    )}
                </div>
                <AdminMenu user={user} />
            </div>
        </motion.aside>
    );
}
