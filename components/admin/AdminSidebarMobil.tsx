"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import {
    FaHome,
    FaBoxOpen,
    FaTags,
    FaUsers,
    FaReceipt,
    FaCashRegister,
} from "react-icons/fa";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import type { User } from "@/src/schemas";
import AdminMenu from "@/components/admin/AdminMenu";

export default function AdminSidebarMobil({ user }: { user: User }) {
    const [open, setOpen] = useState(false);
    const isAdmin = user.rol === "administrador";

    const links = [
        { href: "/admin", label: "Dashboard", icon: <FaHome /> },
        { href: "/admin/products", label: "Productos", icon: <FaBoxOpen /> },
        { href: "/admin/products/category", label: "Categorías", icon: <FaTags /> },
        { href: "/admin/orders", label: "Órdenes", icon: <FaReceipt /> },
        { href: "/admin/users", label: "Usuarios", icon: <FaUsers /> },
        { href: "/pos", label: "Punto de Venta", icon: <FaCashRegister /> },
    ];

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="p-4 text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white">
                <Menu className="w-6 h-6" />
            </SheetTrigger>

            <SheetContent
                side="left"
                className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-lg flex flex-col"
            >
                {/* Logo */}
                <div className="flex justify-center py-6 border-b border-gray-100 dark:border-gray-800">
                    <Image
                        src="/logob.svg"
                        alt="Logo"
                        width={96}
                        height={40}
                        priority
                    />
                </div>

                {/* Header accesible (sr-only) */}
                <SheetHeader>
                    <SheetTitle className="sr-only">Menú de Administración</SheetTitle>
                </SheetHeader>

                {/* Navegación */}
                <nav className="flex flex-col flex-1 px-4 py-4 space-y-2 text-sm font-medium">
                    {isAdmin &&
                        links.map(({ href, label, icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                            >
                                {icon} {label}
                            </Link>
                        ))}
                </nav>

                {/* Menú inferior */}
                <div className="">
                    <AdminMenu user={user} />
                </div>
            </SheetContent>
        </Sheet>
    );
}
