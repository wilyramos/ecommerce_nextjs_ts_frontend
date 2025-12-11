"use client";

import Link from "next/link";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu, ChevronDown, ChevronRight } from "lucide-react";
import {
    Package,
    Users,
    Tag,
    Receipt,
    BarChart3,
    ShoppingCart,
} from "lucide-react";
import { User } from "@/src/schemas";

export default function MobileSidebar({ user }: { user: User }) {
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    const toggleMenu = (label: string) =>
        setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));

    const links = [
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

    return (
        <Sheet>
            <SheetTrigger className="p-2 rounded-md hover:bg-gray-200">
                <Menu className="h-6 w-6" />
            </SheetTrigger>

            <SheetContent side="left" className="p-0 w-64 bg-white">
                <VisuallyHidden>
                    <SheetTitle>Menú de navegación</SheetTitle>
                </VisuallyHidden>

                <div className="p-4 border-b">
                    <p className="font-bold text-sm truncate uppercase">{user?.nombre}</p>
                    <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                </div>

                <nav className="p-3 space-y-2">
                    {links.map(({ href, icon: Icon, label, children }) => {
                        if (children) {
                            const isOpen = openMenus[label];
                            return (
                                <div key={label}>
                                    <button
                                        onClick={() => toggleMenu(label)}
                                        className="w-full flex items-center gap-2 py-2 px-3 rounded-md text-gray-700 hover:bg-gray-100"
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span className="flex-1">{label}</span>
                                        {isOpen ? (
                                            <ChevronDown className="h-4 w-4" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4" />
                                        )}
                                    </button>

                                    {isOpen && (
                                        <div className="ml-7 mt-1 space-y-1">
                                            {children.map((sub) => (
                                                <Link
                                                    key={sub.href}
                                                    href={sub.href}
                                                    className="block py-1 px-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                                                >
                                                    {sub.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={label}
                                href={href!}
                                className="flex items-center gap-2 py-2 px-3 rounded-md text-gray-700 hover:bg-gray-100"
                            >
                                <Icon className="h-5 w-5" />
                                <span>{label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </SheetContent>
        </Sheet>
    );
}
