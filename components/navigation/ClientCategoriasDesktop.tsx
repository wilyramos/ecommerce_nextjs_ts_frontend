"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import type { CategoryResponse, CategoryListResponse } from "@/src/schemas";

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from "@/components/ui/navigation-menu";

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
                            <NavigationMenuTrigger
                                className="border-none font-medium "
                            // className="h-10 px-4 text-[13px] font-medium text-[var(--store-text)] hover:bg-[var(--store-bg)]  border-none"
                            >
                                {cat.nombre}
                            </NavigationMenuTrigger>

                            {sub.length > 0 && (
                                <NavigationMenuContent className="border-[var(--store-border)] ">
                                    <div className="grid grid-cols-[300px_1fr] gap-0 w-[800px] bg-[var(--store-surface)] overflow-hidden">

                                        {/* Panel Izquierdo: Destacado/Imagen de la categoría padre */}
                                        <div className="bg-[var(--store-bg)] p-10 flex flex-col justify-between">
                                            <div>
                                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--store-text-muted)] mb-4 block">
                                                    Colección
                                                </span>
                                                <h3 className="text-3xl font-bold text-[var(--store-text)] tracking-tight leading-none mb-4">
                                                    {cat.nombre}
                                                </h3>
                                                <p className="text-sm text-[var(--store-text-muted)] leading-relaxed">
                                                    Explora lo último en {cat.nombre.toLowerCase()} con la calidad garantizada de GoPhone.
                                                </p>
                                            </div>

                                        </div>

                                        {/* Panel Derecho: Lista de subcategorías */}
                                        <div className="p-8">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--store-text-muted)] mb-6 block">
                                                Categorías
                                            </span>
                                            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                                                {sub.map((subcat) => (
                                                    <ListItem
                                                        key={subcat._id}
                                                        href={`/productos?category=${subcat.slug}`}
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
                    className="group flex items-center gap-4 transition-all duration-300 hover:bg-[var(--store-bg)]"
                >
                    {/* Miniatura Estilo Apple */}
                    <div className="relative w-12 h-12 flex-shrink-0 bg-[var(--store-bg)]  overflow-hidden border border-[var(--store-border)] group-hover:scale-105 transition-transform duration-500">
                        {image ? (
                            <Image
                                src={image}
                                alt={title}
                                fill
                                className="object-contain p-1"
                                sizes="48px"
                                quality={10}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[var(--store-text-muted)] opacity-20 text-[10px] font-bold">
                                GP
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <span className="text-[14px] font-semibold text-[var(--store-text)] leading-tight group-hover:text-[var(--store-primary)] transition-colors">
                            {title}
                        </span>
                        <span className="text-[11px] text-[var(--store-text-muted)] line-clamp-1 mt-0.5">
                            {children}
                        </span>
                    </div>
                </Link>
            </NavigationMenuLink>
        </li>
    );
}