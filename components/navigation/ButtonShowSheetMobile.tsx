"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, ChevronRight } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import type { CategoryResponse } from "@/src/schemas";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/routes";
import Logo from "../ui/Logo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Collection } from "@/src/schemas/collection.schema";

interface Props {
    categories: CategoryResponse[];
    collections: Collection[];
}

export default function ButtonShowSheetMobile({ categories, collections }: Props) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => setOpen(false), [pathname]);

    const mainLinks = [
        {
            href: "/novedades",
            label: "Novedades",
        },
        {
            href: "/ofertas",
            label: "Ofertas",
        },
        {
            href: routes.catalog(),
            label: "Catálogo General",
        },
    ];

    // Corregido para construir la ruta directa de colecciones
    const collectionsLinks = collections.map(col => ({
        href: `/colecciones/${col.slug}`,
        label: col.name,
        description: `Explora la colección ${col.name}`
    }));

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="p-2 text-foreground active:scale-95 transition-transform outline-none">
                    <Menu size={26} strokeWidth={1.5} />
                </button>
            </SheetTrigger>

            <SheetContent
                side="left"
                className="flex flex-col p-0 border-r border-border bg-background"
            >
                <div className="px-4 pt-3 border-b border-border">
                    <SheetHeader className="text-left">
                        <SheetTitle>
                            <Logo />
                        </SheetTitle>
                    </SheetHeader>
                </div>

                <ScrollArea className="flex-1">
                    <div className="grid grid-cols-1 gap-1 mb-8">
                        {mainLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "flex flex-col px-4 py-3 transition-all duration-300 border-b border-border/40",
                                        isActive
                                            ? "bg-secondary text-secondary-foreground font-bold"
                                            : "hover:bg-background-secondary text-foreground"
                                    )}
                                >
                                    <span className="text-[14px] font-bold uppercase tracking-tight leading-none">
                                        {link.label}
                                    </span>

                                </Link>
                            );
                        })}
                    </div>

                    {/* Sección opcional si deseas renderizar los enlaces generados de las colecciones */}
                    {collectionsLinks.length > 0 && (
                        <div className="grid grid-cols-1 gap-1 mb-8">
                            {collectionsLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            "flex flex-col px-4 py-3 transition-all duration-300 border-b border-border/40",
                                            isActive
                                                ? "bg-secondary text-secondary-foreground font-bold"
                                                : "hover:bg-background-secondary text-foreground"
                                        )}
                                    >
                                        <span className="text-[14px] font-bold uppercase  leading-none">
                                            {link.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    <div className="px-2 pb-10">
                        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4 ml-4">
                            Explorar
                        </h3>
                        <div className="space-y-1">
                            {categories.filter(c => !c.parent).map((parent) => (
                                <details key={parent._id} className="group overflow-hidden border border-transparent hover:border-border transition-all">
                                    <summary className="list-none flex items-center justify-between p-4 cursor-pointer hover:bg-background-secondary transition-colors">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[14px] font-semibold text-foreground">{parent.nombre}</span>
                                        </div>
                                        <ChevronRight size={14} className="text-muted-foreground group-open:rotate-90 transition-transform" />
                                    </summary>
                                    <div className="pl-6 pr-4 pb-4 space-y-3 animate-in slide-in-from-top-2 duration-300">
                                        {categories.filter(c => (typeof c.parent === 'object' ? c.parent?._id : c.parent) === parent._id).map((sub) => (
                                            <Link
                                                key={sub._id}
                                                href={routes.catalog({ category: sub.slug })}
                                                className="block text-[13px] font-medium text-muted-foreground hover:text-action-cta transition-colors"
                                            >
                                                {sub.nombre}
                                            </Link>
                                        ))}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </ScrollArea>

                <div className="mt-auto border-t border-border p-6 bg-background">
                    <Button
                        asChild
                        className="w-full bg-action-cta hover:bg-action-cta-hover text-action-cta-foreground font-semibold"
                    >
                        <Link href="/auth/registro" className="flex items-center justify-center">
                            Iniciar Sesión / Registrarse
                        </Link>
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}