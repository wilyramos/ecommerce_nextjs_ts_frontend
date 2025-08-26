"use client";

import { User } from "@/src/schemas";
import Link from "next/link";
import {
    HiOutlineShoppingCart,
    HiOutlineDocumentReport,
    HiOutlineCube,
    HiOutlineUsers,
    HiOutlineHome,
} from "react-icons/hi";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Logo from "../ui/Logo";
import { logout } from '@/actions/logout-user-action';
import { FiLogOut } from "react-icons/fi";


export default function SidebarPOS({ user }: { user: User }) {
    const pathname = usePathname();
    const [expanded, setExpanded] = useState(true);

    const links = [
        { href: "/pos", label: "Inicio", icon: HiOutlineHome },
        { href: "/pos/ventas", label: "Ventas", icon: HiOutlineDocumentReport },
        { href: "/pos/compras", label: "Compras", icon: HiOutlineShoppingCart },
        { href: "/pos/productos", label: "Productos", icon: HiOutlineCube },
        { href: "/pos/clientes", label: "Clientes", icon: HiOutlineUsers },
    ];

    const linkClasses = (active: boolean) =>
        cn(
            "flex items-center gap-3 px-4 py-2 rounded-xl transition-all",
            active
                ? "bg-rose-100 text-rose-600 font-semibold"
                : "text-gray-700 hover:bg-gray-100 hover:text-rose-500"
        );

    return (
        <motion.aside
            animate={{ width: expanded ? 200 : 64 }}
            transition={{ duration: 0.25 }}
            className="h-screen bg-white border-r flex flex-col shadow-sm"
        >
            {/* Logo + toggle */}
            <div className="flex items-center justify-between px-3 h-16 border-b">
                {expanded && <Logo />}
                <button
                    onClick={() => setExpanded((e) => !e)}
                    className="p-2 rounded-md hover:bg-gray-100"
                >
                    {expanded ? (
                        <TbLayoutSidebarLeftCollapse className="h-5 w-5 text-gray-500" />
                    ) : (
                        <TbLayoutSidebarLeftExpand className="h-5 w-5 text-gray-500" />
                    )}
                </button>
            </div>

            {/* Navegación */}
            <nav className="flex flex-col px-2 py-6 space-y-1 text-sm font-medium flex-1">
                {links.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href;
                    return (
                        <Link key={href} href={href} className={linkClasses(active)}>
                            <Icon className="h-5 w-5 shrink-0" />
                            {expanded && <span>{label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Usuario */}
            <div className="px-4 py-4 border-t flex items-center justify-between text-xs text-gray-600 bg-gray-50">
                {expanded && (
                    <span className="truncate text-xs font-medium">
                        Hola{" "}
                        <span className="font-semibold text-gray-800 uppercase">
                            {user.nombre}
                        </span>
                    </span>
                )}
                <div>
                    <button onClick={logout}
                        className="p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                    >
                        <FiLogOut className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </motion.aside>
    );
}