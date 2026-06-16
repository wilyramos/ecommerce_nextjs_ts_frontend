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
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
    const router = useRouter();

    useEffect(() => setOpen(false), [pathname]);

    const mainLinks = [
        { href: routes.catalog(), label: "Catálogo General" },
    ];

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="p-2 text-foreground active:scale-95 transition-all outline-none cursor-pointer hover:bg-secondary/50 ">
                    <Menu size={22} strokeWidth={2} />
                </button>
            </SheetTrigger>

            <SheetContent
                side="left"
                className="flex flex-col p-0 border-r border-border bg-background w-[300px] sm:w-[350px] text-foreground select-none"
            >
                {/* Header Fijo y Minimalista */}
                <div className="px-6 py-5 border-b border-border/60 bg-background/90 backdrop-blur-md sticky top-0 z-10">
                    <SheetHeader className="text-left">
                        <SheetTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                            Menú de Navegación
                        </SheetTitle>
                    </SheetHeader>
                </div>

                {/* Contenido Scrolleable */}
                <ScrollArea className="flex-1 overflow-y-auto py-3 bg-background">
                    <nav className="flex flex-col gap-5">
                        {/* Enlaces principales */}
                        <div className="flex flex-col px-3">
                            {mainLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            "relative px-4 py-3 text-xs font-bold uppercase tracking-wider  transition-all duration-200 outline-none",
                                            isActive
                                                ? "bg-secondary text-primary font-black"
                                                : "text-foreground/80 hover:text-foreground hover:bg-secondary/40"
                                        )}
                                    >
                                        {isActive && (
                                            <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary " />
                                        )}
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Colecciones */}
                        {collections.length > 0 && (
                            <div className="px-3">
                                <details className="group  bg-secondary/10  overflow-hidden transition-all duration-200">
                                    <summary className="list-none flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-secondary/40 font-bold text-xs uppercase tracking-wider text-foreground/90 outline-none">
                                        Colecciones
                                        <ChevronRight size={14} className="text-muted-foreground group-open:rotate-90 transition-transform duration-200" />
                                    </summary>
                                    <div className="flex flex-col pb-3 pt-1 px-2 gap-0.5 bg-background/50 border-t border-border/30">
                                        {collections.map((col) => (
                                            <Link
                                                key={col._id}
                                                href={`/colecciones/${col.slug}`}
                                                className="px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/30  transition-colors outline-none"
                                            >
                                                {col.name}
                                            </Link>
                                        ))}
                                    </div>
                                </details>
                            </div>
                        )}

                        {/* Categorías */}
                        <div className="px-3 space-y-2.5">
                            <div className="px-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">
                                    Categorías
                                </span>
                            </div>

                            <div className="space-y-1.5">
                                {categories.filter(c => !c.parent).map((parent) => {
                                    const subcategories = categories.filter(
                                        c => (typeof c.parent === 'object' ? c.parent?._id : c.parent) === parent._id
                                    );
                                    const hasSubcategories = subcategories.length > 0;

                                    if (!hasSubcategories) {
                                        return (
                                            <Link
                                                key={parent._id}
                                                href={routes.catalog({ category: parent.slug })}
                                                className="block px-4 py-3.5   bg-secondary/10 text-xs font-bold text-foreground/90 hover:bg-secondary/40 transition-all duration-200 outline-none"
                                            >
                                                {parent.nombre}
                                            </Link>
                                        );
                                    }

                                    return (
                                        <details key={parent._id} className="group  bg-secondary/10  overflow-hidden transition-all duration-200">
                                            <summary
                                                className="list-none flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-secondary/40 transition-all duration-200 outline-none"
                                                onClick={(e) => {
                                                    const target = e.target as HTMLElement;
                                                    if (!target.closest('.chevron-container')) {
                                                        e.preventDefault();
                                                        router.push(routes.catalog({ category: parent.slug }));
                                                    }
                                                }}
                                            >
                                                <span className="text-xs font-bold text-foreground/90">{parent.nombre}</span>
                                                <div className="chevron-container p-1 hover:bg-foreground/5  transition-colors duration-200">
                                                    <ChevronRight size={14} className="text-muted-foreground group-open:rotate-90 transition-transform duration-200" />
                                                </div>
                                            </summary>
                                            <div className="flex flex-col pb-3 pt-1 px-2 gap-0.5 bg-background/50 border-t border-border/30">
                                                {subcategories.map((sub) => (
                                                    <Link
                                                        key={sub._id}
                                                        href={routes.catalog({ category: sub.slug })}
                                                        className="block px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-primary hover:bg-secondary/40  transition-colors outline-none"
                                                    >
                                                        {sub.nombre}
                                                    </Link>
                                                ))}
                                            </div>
                                        </details>
                                    );
                                })}
                            </div>
                        </div>
                    </nav>
                </ScrollArea>

                {/* Footer Fijo y Limpio */}
                <div className="border-t border-border/60 p-4 bg-background/90 backdrop-blur-md">
                    <Button asChild className="w-full">
                        <Link href="/auth/registro">Iniciar Sesión / Registro</Link>
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}