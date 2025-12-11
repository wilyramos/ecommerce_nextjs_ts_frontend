// components/POS/MobileSidebar.tsx
"use client";

import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@/src/schemas";
import {
    HiOutlineShoppingCart,
    HiOutlineCube,
    HiOutlineUsers,
    HiOutlineHome,
} from "react-icons/hi2";
import Logo from "../ui/Logo";
import { logout } from "@/actions/logout-user-action";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function MobileSidebarPOS({ user }: { user: User }) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const links = [
        { href: "/pos", label: "Inicio", icon: HiOutlineHome },
        { href: "/pos/ventas", label: "Ventas", icon: HiOutlineShoppingCart },
        { href: "/pos/compras", label: "Compras", icon: HiOutlineShoppingCart },
        { href: "/pos/productos", label: "Productos", icon: HiOutlineCube },
        { href: "/pos/clientes", label: "Clientes", icon: HiOutlineUsers },
    ];

    const handleClose = () => setOpen(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="md:hidden p-2">
                <Menu className="h-6 w-6 text-slate-700" />
            </SheetTrigger>

            <SheetContent side="left" className="p-0 w-64 bg-white flex flex-col overflow-y-auto">
                <SheetHeader>
                    <VisuallyHidden>
                        <SheetTitle>Menú de navegación</SheetTitle>
                    </VisuallyHidden>
                </SheetHeader>
                <div className="h-20 flex items-center px-6 border-b border-slate-200">
                    <Logo />
                </div>

                <nav className="flex-1 space-y-2 px-4 py-4 overflow-y-auto">
                    {links.map(({ href, label, icon: Icon }) => {
                        const active = pathname === href;

                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={handleClose}
                                className={cn(
                                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                                    active
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-slate-200 p-4 bg-slate-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                                {user?.nombre?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-900">
                                    {user?.nombre}
                                </span>
                                <span className="text-[10px] text-slate-600">
                                    {user?.email}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={logout}
                            className="text-slate-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1 rounded-lg text-sm"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
