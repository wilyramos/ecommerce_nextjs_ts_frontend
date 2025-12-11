"use client";

import { User } from "@/src/schemas";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Logo from "../ui/Logo";
import { logout } from "@/actions/logout-user-action";
import {
    HiOutlineShoppingCart,
    HiOutlineCube,
    HiOutlineUsers,
    HiOutlineHome,
} from "react-icons/hi2";
import { ChevronRight } from "lucide-react";

export default function SidebarPOS({ user }: { user: User }) {
    const pathname = usePathname();
    const [expanded, setExpanded] = useState(true);

    const links = [
        { href: "/pos", label: "Inicio", icon: HiOutlineHome },
        { href: "/pos/ventas", label: "Ventas", icon: HiOutlineShoppingCart },
        { href: "/pos/compras", label: "Compras", icon: HiOutlineShoppingCart },
        { href: "/pos/productos", label: "Productos", icon: HiOutlineCube },
        { href: "/pos/clientes", label: "Clientes", icon: HiOutlineUsers },
    ];

    return (
        <aside
            className={cn(
                "hidden md:flex relative h-screen flex-col bg-white text-slate-900 transition-all duration-300 shadow-lg border-r border-slate-200",
                expanded ? "w-56" : "w-[80px]"
            )}
        >
            <button
                onClick={() => setExpanded((c) => !c)}
                className="absolute -right-3 top-9 flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900 shadow"
            >
                <ChevronRight
                    className={cn("h-3 w-3 transition-transform", expanded && "rotate-180")}
                />
            </button>

            <div className={cn("flex h-20 items-center px-6", expanded ? "justify-start" : "justify-center")}>
                <div className={cn(expanded ? "opacity-100" : "opacity-100 w-8")}>
                    <Logo />
                </div>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-slate-300">
                {links.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href;

                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                                active
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "h-5 w-5",
                                    active ? "text-white" : "text-slate-500 group-hover:text-blue-600"
                                )}
                            />
                            <span className={cn(expanded ? "opacity-100" : "opacity-0 hidden")}>
                                {label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-slate-200 p-4 bg-slate-50">
                <div
                    className={cn(
                        "flex items-center gap-3 rounded-xl bg-slate-50 p-2",
                        expanded ? "justify-between" : "justify-center"
                    )}
                >
                    {expanded ? (
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                                {user?.nombre?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col truncate">
                                <span className="text-xs font-bold text-slate-900 truncate">
                                    {user?.nombre}
                                </span>
                                <span className="text-[10px] text-slate-600 truncate">
                                    {user?.email}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                            {user?.nombre?.charAt(0).toUpperCase()}
                        </div>
                    )}

                    <button
                        onClick={logout}
                        className="text-slate-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors text-sm"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </aside>
    );
}
