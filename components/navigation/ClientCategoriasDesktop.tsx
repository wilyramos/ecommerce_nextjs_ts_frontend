"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import type { CategoryResponse, CategoryListResponse } from "@/src/schemas";
import { routes } from "@/lib/routes";

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import { ArrowRight } from "lucide-react";

export default function ClientCategoriasDesktop({
    categories,
}: {
    categories: CategoryResponse[];
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
        }, {} as Record<string, CategoryListResponse>);
    }, [categories]);

    const rootCategories = grouped["root"] || [];

    return (
        <NavigationMenu className="z-50">
            <NavigationMenuList>
                {rootCategories.map((cat) => {
                    const sub = grouped[cat._id] || [];

                    return (
                        <NavigationMenuItem key={cat._id}>
                            <NavigationMenuTrigger className="border-none font-medium">
                                {cat.nombre}
                            </NavigationMenuTrigger>

                            {sub.length > 0 && (
                                <NavigationMenuContent className="border-[var(--store-border)]">
                                    <div className="grid grid-cols-[280px_1fr] gap-0 w-[800px] bg-[var(--store-surface)] overflow-hidden">

                                        {/* Panel Izquierdo: Destacado de categoría Padre */}
                                        <div className="bg-[var(--store-bg)] p-8 flex flex-col justify-between relative group">
                                            {/* Enlace para ver toda la categoría padre */}
                                            <Link
                                                href={routes.catalog({ category: cat.slug })}
                                                className="absolute inset-0 z-10"
                                                aria-label={`Ver todo ${cat.nombre}`}
                                            />

                                            <div>
                                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--store-text-muted)] mb-3 block">
                                                    Colección
                                                </span>
                                                <h3 className="text-2xl font-bold text-[var(--store-text)] tracking-tight leading-none mb-3 group-hover:text-[var(--store-primary)] transition-colors">
                                                    {cat.nombre}
                                                </h3>
                                                <p className="text-xs text-[var(--store-text-muted)] leading-relaxed line-clamp-3">
                                                    Explora lo último en {cat.nombre.toLowerCase()} con la calidad garantizada de GoPhone.
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2 text-xs font-medium text-[var(--store-text)] group-hover:underline decoration-1 underline-offset-4 mt-4">
                                                Ver todo
                                                <ArrowRight className="w-3 h-3" />
                                            </div>
                                        </div>

                                        {/* Panel Derecho: Lista de subcategorías */}
                                        <div className="p-6">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--store-text-muted)] mb-4 block">
                                                Categorías
                                            </span>
                                            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                                                {sub.map((subcat) => (
                                                    <ListItem
                                                        key={subcat._id}
                                                        // ✅ CORRECCIÓN DE RUTA: Usamos el helper centralizado
                                                        href={routes.catalog({ category: subcat.slug })}
                                                        title={subcat.nombre}
                                                        image={subcat.image}
                                                    >
                                                        {subcat.descripcion || `Explorar ${subcat.nombre}`}
                                                    </ListItem>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </NavigationMenuContent>
                            )}
                        </NavigationMenuItem>
                    );
                })}
            </NavigationMenuList>
        </NavigationMenu>
    );
}

function ListItem({
    title,
    children,
    href,
    image,
}: {
    title: string;
    children?: React.ReactNode;
    href: string;
    image?: string;
}) {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    href={href}
                    className="group flex items-center gap-3 p-2 rounded-lg transition-all duration-200 hover:bg-[var(--store-bg)]"
                >
                    {/* Miniatura Estilo Apple */}
                    <div className="relative w-10 h-10 flex-shrink-0 bg-white overflow-hidden border border-[var(--store-border)] rounded-md group-hover:border-[var(--store-primary)] transition-colors duration-300">
                        {image ? (
                            <Image
                                src={image}
                                alt={title}
                                fill
                                className="object-contain p-1 group-hover:scale-110 transition-transform duration-500"
                                sizes="40px"
                                quality={50}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[var(--store-text-muted)] opacity-20 text-[8px] font-bold">
                                GP
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <span className="text-[13px] font-medium text-[var(--store-text)] leading-tight group-hover:text-[var(--store-primary)] transition-colors">
                            {title}
                        </span>
                        <span className="text-[10px] text-[var(--store-text-muted)] line-clamp-1 mt-0.5 opacity-80 group-hover:opacity-100">
                            {children}
                        </span>
                    </div>
                </Link>
            </NavigationMenuLink>
        </li>
    );
}