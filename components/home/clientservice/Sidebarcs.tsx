// File: frontend/components/home/clientservice/Sidebarcs.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    RiHeadphoneLine, RiHeadphoneFill,
    RiShoppingBag3Line, RiShoppingBag3Fill,
    RiShieldCheckLine, RiShieldCheckFill,
    RiChat1Line, RiChat1Fill,
    RiFileShieldLine, RiFileShieldFill,
    RiServiceLine, RiServiceFill,
    RiExternalLinkLine
} from "react-icons/ri";
import { cn } from "@/lib/utils";
import { Muted } from "@/components/ui/Typography";

export default function Sidebarcs() {
    const pathname = usePathname();

    const navItems = [
        { name: "Centro de ayuda", href: "/hc", icon: RiServiceLine, iconFill: RiServiceFill },
        { name: "Contacto y soporte", href: "/hc/contacto-y-soporte", icon: RiHeadphoneLine, iconFill: RiHeadphoneFill },
        { name: "Proceso de compra", href: "/hc/proceso-de-compra", icon: RiShoppingBag3Line, iconFill: RiShoppingBag3Fill },
        { name: "Garantías y devoluciones", href: "/hc/garantias-y-devoluciones", icon: RiShieldCheckLine, iconFill: RiShieldCheckFill },
        { name: "Preguntas frecuentes", href: "/hc/preguntas-frecuentes", icon: RiChat1Line, iconFill: RiChat1Fill },
        { name: "Políticas de privacidad", href: "/hc/politicas-de-privacidad", icon: RiFileShieldLine, iconFill: RiFileShieldFill },
        { name: "Libro de reclamaciones", href: "/hc/libro-de-reclamaciones", icon: RiFileShieldLine, iconFill: RiFileShieldFill },
    ];

    return (
        <>
            {/* 📌 Desktop Sidebar */}
            <aside className="sticky top-24 hidden md:flex md:flex-col w-64 h-fit bg-background select-none shrink-0">
                <nav className="flex-1 pr-6 border-r border-border space-y-6">

                    {/* Sección Principal */}
                    <div>
                        <Muted className="px-3 mb-3 text-[10px] font-black uppercase tracking-[0.15em]">
                            Soporte
                        </Muted>
                        <div className="space-y-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = isActive ? item.iconFill : item.icon;

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 rounded-[var(--radius-sm)] text-xs font-bold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                            isActive
                                                ? "text-action-cta bg-background-secondary"
                                                : "text-muted-foreground hover:bg-background-secondary hover:text-foreground"
                                        )}
                                    >
                                        <Icon className={cn("w-4 h-4 shrink-0 transition-transform duration-200", isActive ? "text-action-cta scale-105" : "text-muted-foreground")} />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sección de Enlace a Legal */}
                    <div className="pt-2 border-t border-border/60">
                        <Muted className="px-3 mb-3 text-[10px] font-black uppercase tracking-[0.15em]">
                            Legal
                        </Muted>
                        <Link
                            href="/terminos"
                            className="flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-sm)] bg-background-secondary border border-border group hover:border-muted-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <div className="flex items-center gap-2.5">
                                <RiFileShieldLine className="w-4 h-4 text-muted-foreground shrink-0" />
                                <span className="text-xs font-bold text-foreground">Información Legal</span>
                            </div>
                            <RiExternalLinkLine className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </Link>
                    </div>
                </nav>
            </aside>

            {/* 📌 Mobile Bottom Nav */}
            <aside className="md:hidden fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-md border-t border-border z-50 pb-safe shadow-lg select-none text-card-foreground">
                <nav className="flex justify-around items-center h-14 px-1">
                    {navItems.slice(0, 4).map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = isActive ? item.iconFill : item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-0.5 w-full h-full outline-none transition-colors",
                                    isActive ? "text-action-cta" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Icon className="w-4 h-4 shrink-0" />
                                <span className="text-[9px] font-black tracking-tight uppercase">
                                    {item.name.split(" ")[0]}
                                </span>
                            </Link>
                        );
                    })}
                    
                    {/* Botón Legal en móvil */}
                    <Link
                        href="/terminos"
                        className="flex flex-col items-center justify-center gap-0.5 w-full h-full text-muted-foreground hover:text-foreground outline-none transition-colors"
                    >
                        <RiFileShieldLine className="w-4 h-4 shrink-0" />
                        <span className="text-[9px] font-black tracking-tight uppercase">Legal</span>
                    </Link>
                </nav>
            </aside>
        </>
    );
}