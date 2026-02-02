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

export default function Sidebarcs() {
    const pathname = usePathname();

    const navItems = [
        { name: "Centro de ayuda", href: "/hc", icon: RiServiceLine, iconFill: RiServiceFill },
        { name: "Contacto y soporte", href: "/hc/contacto-y-soporte", icon: RiHeadphoneLine, iconFill: RiHeadphoneFill },
        { name: "Proceso de compra", href: "/hc/proceso-de-compra", icon: RiShoppingBag3Line, iconFill: RiShoppingBag3Fill },
        { name: "Garantías y devoluciones", href: "/hc/garantias-y-devoluciones", icon: RiShieldCheckLine, iconFill: RiShieldCheckFill },
        { name: "Preguntas frecuentes", href: "/hc/preguntas-frecuentes", icon: RiChat1Line, iconFill: RiChat1Fill },
        { name: "Políticas de privacidad", href: "/hc/politicas-de-privacidad", icon: RiFileShieldLine, iconFill: RiFileShieldFill },
    ];

    return (
        <>
            {/* 📌 Desktop sidebar */}
            <aside className="sticky top-24 hidden md:flex md:flex-col w-72 h-fit">
                <nav className="flex-1 pr-8 border-r border-[var(--store-border)] space-y-8">

                    {/* Sección Principal */}
                    <div>
                        <h2 className="px-4 mb-5 text-[11px] uppercase tracking-[0.25em] font-bold text-[var(--store-text)]">
                            Soporte
                        </h2>
                        <div className="space-y-1.5">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = isActive ? item.iconFill : item.icon;

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all duration-300 group
                                            ${isActive
                                                ? "font-semibold text-[var(--store-primary)] bg-[var(--store-primary)]/5"
                                                : "text-[var(--store-text-muted)] hover:bg-[var(--store-surface-hover)] hover:text-[var(--store-text)]"}
                                        `}
                                    >
                                        <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "text-[var(--store-primary)]" : "opacity-70"}`} />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sección de Enlace a Legal (Redirección) */}
                    <div className="pt-4">
                        <h2 className="px-4 mb-4 text-[11px] uppercase tracking-[0.25em] font-bold text-[var(--store-text-muted)]">
                            Legal
                        </h2>
                        <Link
                            href="/terminos"
                            className="flex items-center justify-between px-4 py-4 rounded-2xl bg-[var(--store-bg)] border border-[var(--store-border)] group hover:border-[var(--store-primary)] transition-all duration-300"
                        >
                            <div className="flex items-center gap-3">
                                <RiFileShieldLine className="w-5 h-5 text-[var(--store-text)]" />
                                <span className="text-xs font-bold text-[var(--store-text)]">Información Legal</span>
                            </div>
                            <RiExternalLinkLine className="w-4 h-4 text-[var(--store-text-muted)] group-hover:text-[var(--store-primary)] group-hover:translate-x-0.5 transition-all" />
                        </Link>
                    </div>
                </nav>
            </aside>

            {/* 📌 Mobile bottom nav */}
            <aside className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--store-surface)]/80 backdrop-blur-xl border-t border-[var(--store-border)] z-50 pb-safe">
                <nav className="flex justify-around items-center h-16 px-2">
                    {navItems.slice(0, 4).map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = isActive ? item.iconFill : item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex flex-col items-center justify-center gap-1 w-full h-full
                                    ${isActive ? "text-[var(--store-primary)]" : "text-[var(--store-text-muted)]"}
                                `}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""}`} />
                                <span className="text-[9px] font-bold tracking-tight">{item.name.split(" ")[0]}</span>
                            </Link>
                        );
                    })}
                    {/* Botón Legal en móvil para saltar de layout */}
                    <Link
                        href="/terminos"
                        className="flex flex-col items-center justify-center gap-1 w-full h-full text-[var(--store-text-muted)]"
                    >
                        <RiFileShieldLine className="w-5 h-5" />
                        <span className="text-[9px] font-bold tracking-tight">Legal</span>
                    </Link>
                </nav>
            </aside>
        </>
    );
}