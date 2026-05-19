"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    RiServiceLine, RiServiceFill,
    RiFileShieldLine, RiFileShieldFill,
    RiExternalLinkLine
} from "react-icons/ri";
import { MdCookie, MdOutlineCookie } from "react-icons/md";

export default function SidebarPages() {
    const pathname = usePathname();

    const legalNav = [
        {
            name: "Términos y Condiciones",
            href: "/terminos",
            icon: RiServiceLine,
            iconFill: RiServiceFill
        },
        {
            name: "Política de privacidad",
            href: "/hc/politicas-de-privacidad",
            icon: RiFileShieldLine,
            iconFill: RiFileShieldFill
        },
        {
            name: "Política de cookies",
            href: "/cookies",
            icon: MdOutlineCookie,
            iconFill: MdCookie
        },
    ];

    return (
        <>
            {/* 📌 Desktop Sidebar */}
            <aside className="sticky top-24 hidden md:flex md:flex-col w-64 h-fit bg-background select-none">
                <nav className="flex-1 pr-6 border-r border-border space-y-6">

                    {/* Sección Principal: Información Legal */}
                    <div>
                        <h2 className="px-3 mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">
                            Información Legal
                        </h2>
                        <div className="space-y-0.5">
                            {legalNav.map((item) => {
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

                    {/* Sección: Redirección al Centro de Ayuda */}
                    <div className="pt-2">
                        <Link
                            href="/hc"
                            className="flex items-center justify-between px-3 py-2.5 rounded-sm bg-background-secondary border border-border/60 group hover:border-muted-foreground/50 transition-colors duration-200 outline-none"
                        >
                            <span className="text-[12px] font-semibold text-foreground">
                                Centro de ayuda
                            </span>
                            <RiExternalLinkLine className="w-3.5 h-3.5 text-muted-foreground/60 group-hover:text-foreground transition-colors duration-200" />
                        </Link>
                    </div>
                </nav>
            </aside>

            {/* 📌 Mobile Bottom Nav */}
            <aside className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border z-50 pb-safe shadow-sm select-none">
                <nav className="flex justify-around items-center h-14 px-1">
                    {legalNav.map((item) => {
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
                                <span className="text-[9px] font-bold tracking-tight">
                                    {item.name.split(" ")[0]}
                                </span>
                            </Link>
                        );
                    })}

                    <Link
                        href="/hc"
                        className="flex flex-col items-center justify-center gap-0.5 w-full h-full text-muted-foreground outline-none"
                    >
                        <RiExternalLinkLine className="w-4 h-4" />
                        <span className="text-[9px] font-bold tracking-tight">Ayuda</span>
                    </Link>
                </nav>
            </aside>
        </>
    );
}