"use client";

import Link from "next/link";
import {
    RiHeadphoneLine,
    RiShoppingBag3Line,
    RiShieldCheckLine,
    RiChat1Line,
    RiFileShieldLine,
    RiArrowRightSLine,
    RiTruckLine,
    RiWallet3Line
} from "react-icons/ri";
import { H1, H2, Muted } from "@/components/ui/Typography";

export default function PageCentroAyuda() {
    const categories = [
        {
            title: "Pedidos",
            description: "Rastreo y estados",
            href: "/hc/proceso-de-compra",
            icon: RiShoppingBag3Line,
        },
        {
            title: "Envíos",
            description: "Plazos y entrega",
            href: "/hc/proceso-de-compra",
            icon: RiTruckLine,
        },
        {
            title: "Reembolsos",
            description: "Devolución de dinero",
            href: "/hc/garantias-y-devoluciones",
            icon: RiWallet3Line,
        },
        {
            title: "Soporte",
            description: "Especialistas GoPhone",
            href: "/hc/contacto-y-soporte",
            icon: RiHeadphoneLine,
        }
    ];

    return (
        <div className="max-w-4xl mx-auto py-8 md:py-12 select-none bg-background text-foreground">
            {/* --- HEADER SIMPLE --- */}
            <header className="px-4 mb-10">
                <H1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">
                    Centro de Ayuda
                </H1>
                <Muted className="text-xs md:text-sm text-muted-foreground font-medium">
                    Estamos aquí para ayudarte con tus compras en GoPhone.
                </Muted>
            </header>

            {/* --- GRID DE ACCESO RÁPIDO (Estilo Apple/iShop Premium) --- */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 mb-14">
                {categories.map((cat, idx) => (
                    <Link
                        key={idx}
                        href={cat.href}
                        className="flex flex-col items-start p-5 bg-background border border-border/60 rounded-sm hover:border-border transition-colors outline-none"
                    >
                        <div className="text-muted-foreground/80 mb-4">
                            <cat.icon size={22} />
                        </div>
                        <h3 className="text-[13px] font-bold text-foreground mb-0.5">{cat.title}</h3>
                        <p className="text-[11px] text-muted-foreground leading-normal font-medium">{cat.description}</p>
                    </Link>
                ))}
            </section>

            {/* --- LISTA DE TEMAS (Autoservicio) --- */}
            <section className="px-4 space-y-2">
                <H2 className="text-base font-bold text-foreground mb-4 px-0.5 border-none pb-0">
                    Temas comunes
                </H2>
                
                {[
                    { title: "Preguntas frecuentes", href: "/hc/preguntas-frecuentes", icon: RiChat1Line },
                    { title: "Garantías de productos", href: "/hc/garantias-y-devoluciones", icon: RiShieldCheckLine },
                    { title: "Políticas de privacidad", href: "/hc/politicas-de-privacidad", icon: RiFileShieldLine },
                ].map((item, i) => (
                    <Link
                        key={i}
                        href={item.href}
                        className="flex items-center justify-between p-4 bg-background border border-border/40 rounded-sm group hover:bg-background-secondary/60 hover:border-border transition-colors outline-none"
                    >
                        <div className="flex items-center gap-3.5">
                            <item.icon className="text-muted-foreground/70 group-hover:text-action-cta transition-colors" size={18} />
                            <span className="text-[13px] font-medium text-foreground">{item.title}</span>
                        </div>
                        <RiArrowRightSLine className="text-muted-foreground/40 group-hover:text-foreground transition-colors" size={18} />
                    </Link>
                ))}
            </section>

            {/* --- FOOTER DE SOPORTE DIRECTO --- */}
            <footer className="mt-14 px-4 pb-6 text-center">
                <div className="p-8 bg-background-secondary border border-border/60 rounded-sm flex flex-col items-center">
                    <h3 className="text-[15px] font-bold text-foreground mb-1">¿Todavía necesitas ayuda?</h3>
                    <Muted className="text-xs text-muted-foreground mb-5 font-medium">Nuestro equipo de soporte está disponible para ti.</Muted>
                    <Link
                        href="/hc/contacto-y-soporte"
                        className="inline-block bg-foreground text-background px-8 py-2.5 rounded-full text-xs font-bold hover:bg-action-cta hover:text-primary-foreground transition-colors outline-none"
                    >
                        Contáctanos
                    </Link>
                </div>
            </footer>
        </div>
    );
}