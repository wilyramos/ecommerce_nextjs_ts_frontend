"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    RiHeadphoneLine, RiHeadphoneFill, // Contacto
    RiShoppingBag3Line, RiShoppingBag3Fill, // Proceso de compra
    RiShieldCheckLine, RiShieldCheckFill, // Garantías
    RiChat1Line, RiChat1Fill, // FAQ
    RiFileShieldLine, RiFileShieldFill, // Privacidad
    RiServiceLine, RiServiceFill,
} from "react-icons/ri";

export default function Sidebarcs() {
    const pathname = usePathname();

    const navItems = [
        {
            name: "Centro de ayuda",
            href: "/hc",
            icon: RiServiceLine,
            iconFill: RiServiceFill,
        },
        {
            name: "Contacto y soporte",
            href: "/hc/contacto-y-soporte",
            icon: RiHeadphoneLine,
            iconFill: RiHeadphoneFill,
        },
        {
            name: "Proceso de compra",
            href: "/hc/proceso-de-compra",
            icon: RiShoppingBag3Line,
            iconFill: RiShoppingBag3Fill,
        },
        {
            name: "Garantías y devoluciones",
            href: "/hc/garantias-y-devoluciones",
            icon: RiShieldCheckLine,
            iconFill: RiShieldCheckFill,
        },
        {
            name: "Preguntas frecuentes",
            href: "/hc/preguntas-frecuentes",
            icon: RiChat1Line,
            iconFill: RiChat1Fill,
        },
        {
            name: "Políticas de privacidad",
            href: "/hc/politicas-de-privacidad",
            icon: RiFileShieldLine,
            iconFill: RiFileShieldFill,
        },
    ];

    return (
        <>
            {/* 📌 Desktop sidebar */}
            <aside className="sticky top-30 hidden md:flex md:flex-col border-r  backdrop-blur-sm h-full">
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = isActive ? item.iconFill : item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group
                                    ${isActive
                                        ? "font-medium text-primary bg-primary/10"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"}
                                `}
                            >
                                {/* El icono escala ligeramente al hacer hover para un efecto moderno */}
                                <Icon className={`w-5 h-5 transition-transform group-hover:scale-105 ${isActive ? "text-primary" : ""}`} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* 📌 Mobile bottom nav */}
            <aside className="md:hidden fixed bottom-0 left-0 right-0 border-t  backdrop-blur-md z-50 pb-safe">
                <nav className="flex justify-around items-center h-16 px-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = isActive ? item.iconFill : item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors
                                    ${isActive
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground"}
                                `}
                            >
                                <Icon className={`w-6 h-6 ${isActive ? "scale-110" : ""} transition-transform`} />
                                <span className="text-[10px] font-medium text-center leading-none max-w-[64px] truncate">
                                    {item.name.split(" ")[0]} {/* Truco minimalista: Mostrar solo la 1ra palabra en móvil si es muy largo, o quitar .split si prefieres todo */}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}