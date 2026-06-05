// File: components/store/ClientCategoriasDesktop.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { routes } from "@/lib/routes";
import type { Collection } from "@/src/schemas/collection.schema";
import { FiImage, FiArrowRight } from "react-icons/fi";
import { Lead, Muted } from "@/components/ui/Typography";
import { CategoryResponse } from "@/src/schemas/category.schema";

import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
} from "@/components/ui/navigation-menu";

export default function ClientCategoriasDesktop({
    categories,
    collections = [],
}: {
    categories: CategoryResponse[];
    collections?: Collection[];
}) {
    const grouped = React.useMemo(() => {
        return categories.reduce((acc, category) => {
            const parentId =
                category.parent && typeof category.parent !== "string"
                    ? category.parent._id
                    : null;
            const key = parentId ?? "root";
            if (!acc[key]) acc[key] = [];
            acc[key].push(category);
            return acc;
        }, {} as Record<string, CategoryResponse[]>);
    }, [categories]);

    const rootCategories = grouped["root"] || [];

    return (
        <NavigationMenu className="w-full">
            <NavigationMenuList>
                {rootCategories.map((cat) => {
                    const sub = grouped[cat._id] || [];
                    return (
                        <NavigationMenuItem key={cat._id}>
                            {sub.length === 0 ? (
                                <NavigationMenuLink asChild>
                                    <Link
                                        href={routes.catalog({ category: cat.slug })}
                                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none rounded-[var(--radius-sm)] h-9"
                                    >
                                        {cat.nombre}
                                    </Link>
                                </NavigationMenuLink>
                            ) : (
                                <>
                                    <NavigationMenuTrigger>
                                        {cat.nombre}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent className="w-[640px]">
                                        <div className="grid grid-cols-[200px_1fr] bg-background">
                                            <div className="bg-background-secondary p-4 flex flex-col justify-between border-r border-border">
                                                <div>
                                                    <Lead className="mb-1 text-foreground">
                                                        {cat.nombre}
                                                    </Lead>
                                                    <Muted className="line-clamp-3 leading-relaxed font-medium">
                                                        {cat.descripcion || `Explora lo mejor en ${cat.nombre.toLowerCase()}.`}
                                                    </Muted>
                                                </div>
                                                <Link
                                                    href={routes.catalog({ category: cat.slug })}
                                                    className="text-[11px] text-muted-foreground hover:text-primary transition-colors mt-4 inline-flex items-center gap-1 uppercase font-bold tracking-wider focus-visible:outline-none"
                                                >
                                                    Ver todo
                                                    <FiArrowRight className="w-3 h-3" />
                                                </Link>
                                            </div>
                                            <div className="p-3">
                                                <ul className="grid grid-cols-2 gap-1">
                                                    {sub.map((subcat) => (
                                                        <NavItem
                                                            key={subcat._id}
                                                            href={routes.catalog({ category: subcat.slug })}
                                                            title={subcat.nombre}
                                                            image={subcat.image}
                                                        />
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </NavigationMenuContent>
                                </>
                            )}
                        </NavigationMenuItem>
                    );
                })}

                {collections.length > 0 && (
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>
                            Tendencias
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="w-[640px]">
                            <div className="grid grid-cols-[200px_1fr] bg-background">
                                <div className="bg-background-secondary p-4 flex flex-col justify-between border-r border-border">
                                    <div>
                                        <Lead className="mb-1 text-foreground">
                                            Tendencias
                                        </Lead>
                                        <Muted className="line-clamp-3 leading-relaxed font-medium">
                                            Descubre las colecciones más populares y exclusivas del momento.
                                        </Muted>
                                    </div>
                                    <Link
                                        href="/colecciones"
                                        className="text-[11px] text-muted-foreground hover:text-primary transition-colors mt-4 inline-flex items-center gap-1 uppercase font-bold tracking-wider focus-visible:outline-none"
                                    >
                                        Ver todo
                                        <FiArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>
                                <div className="p-3">
                                    <ul className="grid grid-cols-2 gap-1">
                                        {collections.map((col) => (
                                            <NavItem
                                                key={col._id}
                                                href={`/colecciones/${col.slug}`}
                                                title={col.name}
                                                image={col.image}
                                            />
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                )}
            </NavigationMenuList>
        </NavigationMenu>
    );
}

interface NavItemProps {
    href: string;
    title: string;
    image?: string | null;
}

function NavItem({ href, title, image }: NavItemProps) {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    href={href}
                    className="flex items-center gap-3 px-2 py-1.5 rounded-[var(--radius-sm)] hover:bg-accent transition-colors group w-full min-h-[44px]"
                >
                    <div className="relative size-7 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-background-secondary flex items-center justify-center border border-border">
                        {image ? (
                            <Image
                                src={image}
                                alt={title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-200"
                                sizes="28px"
                                unoptimized
                                quality={20}
                            />
                        ) : (
                            <FiImage className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                    </div>
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors truncate block capitalize">
                        {title}
                    </span>
                </Link>
            </NavigationMenuLink>
        </li>
    );
}