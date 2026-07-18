"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { routes } from "@/lib/routes";
import type { Collection } from "@/src/schemas/collection.schema";
import { FiImage, FiArrowRight } from "react-icons/fi";
import { Lead } from "@/components/ui/Typography";
import { CategoryResponse } from "@/src/schemas/category.schema";

import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export default function ClientCategoriasDesktop({
    categories,
    collections = [],
}: {
    categories: CategoryResponse[];
    collections?: Collection[];
}) {
    const { rootNoSub, rootWithSub } = React.useMemo(() => {
        const grouped = categories.reduce((acc, category) => {
            const parentId =
                category.parent && typeof category.parent !== "string"
                    ? category.parent._id
                    : null;
            const key = parentId ?? "root";
            if (!acc[key]) acc[key] = [];
            acc[key].push(category);
            return acc;
        }, {} as Record<string, CategoryResponse[]>);

        const rootCategories = grouped["root"] || [];

        const rootNoSub: CategoryResponse[] = [];
        const rootWithSub: { cat: CategoryResponse; sub: CategoryResponse[] }[] = [];

        rootCategories.forEach((cat) => {
            const sub = grouped[cat._id] || [];
            if (sub.length === 0) {
                rootNoSub.push(cat);
            } else {
                rootWithSub.push({ cat, sub });
            }
        });

        return { rootNoSub, rootWithSub };
    }, [categories]);

    const renderDropdown = (
        title: string,
        linkHref: string,
        items: { _id: string; title: string; slug: string; image?: string | null; isCollection?: boolean }[]
    ) => (
        <NavigationMenuContent className="w-[640px]">
            <div className="grid grid-cols-[200px_1fr] bg-background">
                <div className="bg-background-secondary p-4 flex flex-col justify-between border-r border-border">
                    <div>
                        <Lead className="mb-1 text-foreground">{title}</Lead>
                      
                    </div>
                    <Link
                        href={linkHref}
                        prefetch={false}
                        className="text-[11px] text-muted-foreground hover:text-primary transition-colors mt-4 inline-flex items-center gap-1 uppercase font-bold tracking-wider focus-visible:outline-none"
                    >
                        Ver todo
                        <FiArrowRight className="w-3 h-3" />
                    </Link>
                </div>
                <div className="p-3">
                    <ul className="grid grid-cols-2 gap-1">
                        {items.map((item) => (
                            <NavItem
                                key={item._id}
                                href={item.isCollection ? `/colecciones/${item.slug}` : routes.catalog({ category: item.slug })}
                                title={item.title}
                                image={item.image}
                            />
                        ))}
                    </ul>
                </div>
            </div>
        </NavigationMenuContent>
    );

    return (
        <NavigationMenu className="w-full bg-black">
            <NavigationMenuList>
                {/* Categorías Root sin subcategorías */}
                {rootNoSub.map((cat) => (
                    <NavigationMenuItem key={cat._id}>
                        <Link href={routes.catalog({ category: cat.slug })} prefetch={false} className={navigationMenuTriggerStyle()}>
                            {cat.nombre}
                        </Link>
                    </NavigationMenuItem>
                ))}

                {/* Categorías con subcategorías */}
                {rootWithSub.map(({ cat, sub }) => (
                    <NavigationMenuItem key={cat._id}>
                        <NavigationMenuTrigger>{cat.nombre}</NavigationMenuTrigger>
                        {renderDropdown(
                            cat.nombre,
                            routes.catalog({ category: cat.slug }),
                            sub.map(s => ({ _id: s._id, title: s.nombre, slug: s.slug, image: s.image }))
                        )}
                    </NavigationMenuItem>
                ))}

                {/* Tendencias */}
                {collections.length > 0 && (
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Tendencias</NavigationMenuTrigger>
                        {renderDropdown(
                            "Tendencias",
                            "/colecciones",
                            collections.map(c => ({ _id: c._id, title: c.name, slug: c.slug, image: c.image, isCollection: true }))
                        )}
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
                    prefetch={false}
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
                            <FiImage className="w-2 h-2 text-muted-foreground/20" />
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