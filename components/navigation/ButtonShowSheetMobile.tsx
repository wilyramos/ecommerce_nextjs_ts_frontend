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
import {
    Menu, User, ChevronRight,
    Zap, Tag, LayoutGrid
} from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import type { CategoryResponse } from "@/src/schemas";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/routes";
import Logo from "../ui/Logo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Props {
    categories: CategoryResponse[];
}

export default function ButtonShowSheetMobile({ categories }: Props) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => setOpen(false), [pathname]);

    // Enlaces principales con iconos unificados al estilo tech premium
    const mainLinks = [
        {
            href: "/novedades",
            label: "Novedades",
            icon: <Zap size={18} />,
            description: "Lo último en tecnología"
        },
        {
            href: "/ofertas",
            label: "Ofertas",
            icon: <Tag size={18} />,
            description: "Precios imbatibles"
        },
        {
            href: routes.catalog(),
            label: "Catálogo General",
            icon: <LayoutGrid size={18} />,
            description: "Explora todos los productos"
        },
    ];

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="p-2 text-[var(--color-text-primary)] active:scale-95 transition-transform outline-none">
                    <Menu size={26} strokeWidth={1.5} />
                </button>
            </SheetTrigger>

            <SheetContent
                side="left"
                className="flex flex-col h-full w-[85vw] sm:w-[380px] p-0 bg-[var(--color-bg-primary)] border-r border-[var(--color-border-subtle)] shadow-md outline-none"
            >
                <div className="px-8 pt-6 border-b border-[var(--color-border-subtle)]">
                    <SheetHeader className="text-left">
                        <SheetTitle>
                            <Logo />
                        </SheetTitle>
                    </SheetHeader>
                </div>

                <ScrollArea className="flex-1 px-4">
                    <div className="grid grid-cols-1 gap-1 mb-8">
                        {mainLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-4 px-4 py-2 transition-all duration-300 group border",
                                        isActive
                                            ? "bg-[var(--color-action-primary)] text-[var(--color-text-inverse)] border-transparent shadow-md"
                                            : "hover:bg-[var(--color-surface-hover)] border-transparent text-[var(--color-text-primary)]"
                                    )}
                                >
                                    <div className={cn(
                                        "p-2.5 transition-colors ",
                                        isActive 
                                            ? "bg-white/10 " 
                                            : "text-[var(--color-accent-warm)]"
                                    )}>
                                        {link.icon}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[14px] font-bold uppercase tracking-tight leading-none">
                                            {link.label}
                                        </span>
                                        <span className={cn(
                                            "text-[10px] font-medium mt-1.5",
                                            isActive ? "opacity-60" : "text-[var(--color-text-secondary)]"
                                        )}>
                                            {link.description}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="px-2 pb-10">
                        <h3 className="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-[0.2em] mb-4 ml-2">Explorar</h3>
                        <div className="space-y-1">
                            {categories.filter(c => !c.parent).map((parent) => (
                                <details key={parent._id} className="group overflow-hidden border border-transparent hover:border-[var(--color-border-subtle)] transition-all">
                                    <summary className="list-none flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--color-bg-secondary)] transition-colors">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[14px] font-semibold text-[var(--color-text-primary)]">{parent.nombre}</span>
                                        </div>
                                        <ChevronRight size={14} className="text-[var(--color-text-secondary)] group-open:rotate-90 transition-transform" />
                                    </summary>
                                    <div className="pl-11 pr-4 pb-4 space-y-3 animate-in slide-in-from-top-2 duration-300">
                                        {categories.filter(c => (typeof c.parent === 'object' ? c.parent?._id : c.parent) === parent._id).map((sub) => (
                                            <Link
                                                key={sub._id}
                                                href={routes.catalog({ category: sub.slug })}
                                                className="block text-[13px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-action-primary)] transition-colors"
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

                {/* Footer (Login / Cuenta) */}
                <div className="mt-auto border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] p-6">
                    <Button
                        asChild
                        variant="default"
                        size="default"
                        className="w-full"
                    >
                        <Link href="/auth/registro" className="flex items-center justify-center gap-2">
                            <User className="h-4 w-4" />
                            Iniciar sesión / Registrarse
                        </Link>
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}