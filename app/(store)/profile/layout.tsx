// File: frontend/app/(store)/profile/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { H2, P } from "@/components/ui/TypographyV3";

const sidebarNavItems = [
    {
        title: "Mi Perfil",
        href: "/profile",
    },
    {
        title: "Mis Compras",
        href: "/profile/orders",
    },
    {
        title: "Mis Favoritos",
        href: "/profile/favorites",
    },
    {
        title: "Configuración",
        href: "/profile/settings",
    },
];

interface ProfileLayoutProps {
    children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
    const pathname = usePathname();

    return (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="lg:w-1/4 flex-shrink-0">
                    <div className="mb-6">
                        <H2>Mi Cuenta</H2>
                        <P className="mt-1">
                            Administra tu información, pedidos y preferencias.
                        </P>
                    </div>
                    <nav className="flex flex-col space-y-1">
                        {sidebarNavItems.map((item) => {
                            const isActive =
                                item.href === "/profile"
                                    ? pathname === item.href
                                    : pathname?.startsWith(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center rounded-radius-md px-3.5 py-2.5 text-sm font-medium transition-colors duration-fast",
                                        isActive
                                            ? "bg-surface-secondary text-text-primary"
                                            : "text-text-secondary hover:bg-surface-secondary/50 hover:text-text-primary"
                                    )}
                                >
                                    {item.title}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>
                <main className="flex-1 lg:w-3/4">
                    <div className="rounded-radius-md border border-border-primary bg-surface-primary p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}