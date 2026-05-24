"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { routes } from "@/lib/routes";
import type { CategoryResponse, CategoryListResponse } from "@/src/schemas";
import type { Collection } from "@/src/schemas/collection.schema";

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
        }, {} as Record<string, CategoryListResponse>);
    }, [categories]);

    const rootCategories = grouped["root"] || [];

    return (
        <NavigationMenu className="w-full max-w-none ">
            <NavigationMenuList>
                {rootCategories.map((cat) => {
                    const sub = grouped[cat._id] || [];
                    return (
                        <NavigationMenuItem key={cat._id}>
                            <NavigationMenuTrigger>{cat.nombre}</NavigationMenuTrigger>
                            {sub.length > 0 && (
                                <NavigationMenuContent className="w-[740px]">
                                    <div className="grid grid-cols-[240px_1fr] bg-background">
                                        <div className="bg-muted-neutral/30 p-6 flex flex-col justify-between relative">
                                            <div className="relative z-10">
                                                <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">
                                                    {cat.nombre}
                                                </h3>
                                                <p className="text-xs text-muted-foreground line-clamp-3">
                                                    {cat.descripcion || `Explora lo último en ${cat.nombre.toLowerCase()}.`}
                                                </p>
                                            </div>
                                            <Link
                                                href={routes.catalog({ category: cat.slug })}
                                                className="text-xs font-medium text-action-cta underline-offset-4 hover:underline"
                                            >
                                                Ver todo
                                            </Link>
                                        </div>
                                        <div className="p-6">
                                            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                                                {sub.map((subcat) => (
                                                    <SubcategoryItem key={subcat._id} subcat={subcat} />
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

            {collections.length > 0 && (
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Tendencias</NavigationMenuTrigger>
                        <NavigationMenuContent className="w-64 p-2">
                            <ul className="space-y-2">
                                {collections.map((col) => (
                                    <CollectionItem key={col._id} col={col} />
                                ))}
                            </ul>
                            <div className="border-t border-border mt-2 pt-2 px-2">
                                <Link
                                    href="/colecciones"
                                    className="text-[11px] font-medium text-muted-foreground hover:text-action-cta transition-colors"
                                >
                                    Ver todas
                                </Link>
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            )}
        </NavigationMenu>
    );
}

function SubcategoryItem({ subcat }: { subcat: CategoryResponse }) {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    href={routes.catalog({ category: subcat.slug })}
                    className="flex items-center gap-3 p-2transition-colors hover:bg-muted-neutral"
                >
                    {subcat.image && (
                        <div className="relative size-8 overflow-hidden">
                            <Image src={subcat.image} alt={subcat.nombre} fill className="object-cover" sizes="32px" />
                        </div>
                    )}
                    <span className="text-sm font-medium truncate">{subcat.nombre}</span>
                </Link>
            </NavigationMenuLink>
        </li>
    );
}

function CollectionItem({ col }: { col: Collection }) {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    href={`/colecciones/${col.slug}`}
                    className="group relative flex h-16 w-full items-center overflow-hidden  transition-all hover:ring-2 hover:ring-action-cta/20"
                >
                    {col.image && (
                        <>
                            <Image
                                src={col.image}
                                alt={col.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="256px"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                        </>
                    )}
                    <span className="relative z-10 px-4 text-sm font-bold text-white truncate drop-shadow-md">
                        {col.name}
                    </span>
                </Link>
            </NavigationMenuLink>
        </li>
    );
}