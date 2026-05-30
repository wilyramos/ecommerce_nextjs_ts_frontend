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
        { name: "Libro de reclamaciones", href: "/hc/libro-de-reclamaciones", icon: RiFileShieldLine, iconFill: RiFileShieldFill },
    ];

    return (
        <>
            <aside className="sticky top-24 hidden md:flex md:flex-col w-64 h-fit bg-background select-none">
                <nav className="flex-1 pr-6 border-r border-border space-y-6">

                    {/* Sección Principal */}
                    <div>
                        <h2 className="px-3 mb-3 text-sm *:font-bold uppercase ">
                            Soporte
                        </h2>
                        <div className="space-y-0.5">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = isActive ? item.iconFill : item.icon;

                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-sm text-[13px] font-medium transition-colors duration-200 outline-none
                                            ${isActive
                                                ? "text-action-cta bg-background-secondary font-bold"
                                                : "text-muted-foreground hover:bg-background-secondary/60 hover:text-foreground"
                                            }
                                        `}
                                    >
                                        <Icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? "text-action-cta" : "text-muted-foreground/70"}`} />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sección de Enlace a Legal */}
                    <div className="pt-2">
                        <h2 className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">
                            Legal
                        </h2>
                        <Link
                            href="/terminos"
                            className="flex items-center justify-between px-3 py-2.5 rounded-sm bg-background-secondary border border-border/60 group hover:border-muted-foreground/50 transition-colors duration-200 outline-none"
                        >
                            <div className="flex items-center gap-2.5">
                                <RiFileShieldLine className="w-4 h-4 text-muted-foreground" />
                                <span className="text-[12px] font-semibold text-foreground">Información Legal</span>
                            </div>
                            <RiExternalLinkLine className="w-3.5 h-3.5 text-muted-foreground/60 group-hover:text-foreground transition-colors duration-200" />
                        </Link>
                    </div>
                </nav>
            </aside>

            {/* 📌 Mobile Bottom Nav */}
            <aside className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border z-50 pb-safe shadow-sm select-none">
                <nav className="flex justify-around items-center h-14 px-1">
                    {navItems.slice(0, 4).map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = isActive ? item.iconFill : item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex flex-col items-center justify-center gap-0.5 w-full h-full outline-none
                                    ${isActive ? "text-action-cta" : "text-muted-foreground"}
                                `}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-[9px] font-bold tracking-tight">{item.name.split(" ")[0]}</span>
                            </Link>
                        );
                    })}
                    
                    {/* Botón Legal en móvil */}
                    <Link
                        href="/terminos"
                        className="flex flex-col items-center justify-center gap-0.5 w-full h-full text-muted-foreground outline-none"
                    >
                        <RiFileShieldLine className="w-4 h-4" />
                        <span className="text-[9px] font-bold tracking-tight">Legal</span>
                    </Link>
                </nav>
            </aside>
        </>
    );
}