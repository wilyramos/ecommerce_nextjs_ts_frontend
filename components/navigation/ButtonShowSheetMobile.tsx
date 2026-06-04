// File: frontend/components/store/ButtonShowSheetMobile.tsx

"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, ChevronRight } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Logo from "../ui/Logo";
import { Muted } from "@/components/ui/Typography";

// Importaciones de tus tipos y rutas
import { routes } from "@/lib/routes";
import type { CategoryResponse } from "@/src/schemas/category.schema";
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
        { href: routes.catalog(), label: "Catálogo General" },
    ];

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="p-2 text-foreground active:scale-95 transition-transform outline-none cursor-pointer">
                    <Menu size={24} strokeWidth={2} />
                </button>
            </SheetTrigger>

            <SheetContent
                side="left"
                className="flex flex-col p-0 border-r border-border bg-card w-[300px] sm:w-[380px] text-card-foreground select-none"
            >
                {/* Header fijo */}
                <div className="px-6 pt-6 pb-4 border-b border-border bg-card">
                    <SheetHeader className="text-left">
                        <SheetTitle>
                            <Logo />
                        </SheetTitle>
                    </SheetHeader>
                </div>

                {/* Contenido con Scroll */}
                <ScrollArea className="flex-1 overflow-y-auto py-4 bg-card">
                    <nav className="flex flex-col gap-6">
                        {/* Enlaces principales */}
                        <div className="flex flex-col">
                            {mainLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors outline-none focus-visible:bg-background-secondary",
                                        pathname === link.href
                                            ? "bg-background-secondary text-action-cta font-black"
                                            : "text-foreground hover:bg-background-secondary/60"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Colecciones */}
                        {collections.length > 0 && (
                            <details className="group border-y border-border/60">
                                <summary className="list-none flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-background-secondary font-black text-xs uppercase tracking-wider text-foreground outline-none">
                                    Colecciones
                                    <ChevronRight size={14} className="text-muted-foreground group-open:rotate-90 transition-transform" />
                                </summary>
                                <div className="flex flex-col pb-4 bg-background-secondary/30 divide-y divide-border/20">
                                    {collections.map((col) => (
                                        <Link
                                            key={col._id}
                                            href={`/colecciones/${col.slug}`}
                                            className="px-10 py-3 text-xs font-semibold text-muted-foreground hover:text-foreground outline-none"
                                        >
                                            {col.name}
                                        </Link>
                                    ))}
                                </div>
                            </details>
                        )}

                        {/* Categorías */}
                        <div className="px-6 space-y-3">
                            <Muted className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">
                                Explorar Categorías
                            </Muted>
                            <div className="space-y-1.5">
                                {categories.filter(c => !c.parent).map((parent) => (
                                    <details key={parent._id} className="group overflow-hidden border border-border/40 rounded-[var(--radius-sm)] bg-background/30">
                                        <summary className="list-none flex items-center justify-between p-3 cursor-pointer hover:bg-background-secondary transition-colors outline-none">
                                            <span className="text-xs font-bold text-foreground">{parent.nombre}</span>
                                            <ChevronRight size={14} className="text-muted-foreground group-open:rotate-90 transition-transform" />
                                        </summary>
                                        <div className="pl-4 pr-2 pb-2 pt-1 space-y-1 border-t border-border/30 bg-background-secondary/20">
                                            {categories.filter(c => (typeof c.parent === 'object' ? c.parent?._id : c.parent) === parent._id).map((sub) => (
                                                <Link
                                                    key={sub._id}
                                                    href={routes.catalog({ category: sub.slug })}
                                                    className="block px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-action-cta hover:bg-background-secondary rounded-[var(--radius-xs)] transition-colors outline-none"
                                                >
                                                    {sub.nombre}
                                                </Link>
                                            ))}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </nav>
                </ScrollArea>

                {/* Footer fijo */}
                <div className="border-t border-border p-6 bg-card">
                    <Button asChild className="w-full bg-action-cta hover:bg-action-cta-hover text-action-cta-foreground font-bold tracking-wide uppercase text-xs h-11">
                        <Link href="/auth/registro">Iniciar Sesión / Registro</Link>
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}