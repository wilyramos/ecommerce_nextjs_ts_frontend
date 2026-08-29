// File: frontend/components/layout/Footer.tsx

"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaBookOpen } from "react-icons/fa";
import PaymentMethods from "./PaymentMethods";
import Logo from "../ui/Logo";
import { routes } from "@/lib/routes";
import { H4, P, Small } from "@/components/ui/TypographyStore";

export default function Footer() {
    const shopLinks = [
        { label: "Ver todo", href: routes.catalog() },
        { label: "Novedades", href: "/novedades" },
        { label: "Ofertas", href: "/ofertas" },
        { label: "Categorías", href: "/categorias" },
    ];

    const brandLinks = [
        { label: "Apple", href: routes.catalog({ brand: "apple" }) },
        { label: "iFans", href: routes.catalog({ brand: "ifans" }) },
    ];

    const helpCenterLinks = [
        { label: "Contacto y soporte", href: "/hc/contacto-y-soporte" },
        { label: "Garantías y devoluciones", href: "/hc/garantias-y-devoluciones" },
        { label: "Preguntas frecuentes", href: "/hc/preguntas-frecuentes" },
        { label: "Comparador de productos", href: "/comparativas" },
        { label: "Libro de reclamaciones", href: "/libro-de-reclamaciones" },
    ];

    const legalLinks = [
        { label: "Privacidad", href: "/hc/politicas-de-privacidad" },
        { label: "Términos y condiciones", href: "/terminos-y-condiciones" },
        { label: "Cambios y devoluciones", href: "/politicas-de-cambios-y-devoluciones" },
    ];

    const social = [
        { icon: <FaFacebookF size={14} />, href: "https://facebook.com/gophone.pe", name: "Facebook" },
        { icon: <FaInstagram size={14} />, href: "https://instagram.com/gophone.pe", name: "Instagram" },
        { icon: <FaWhatsapp size={14} />, href: "https://wa.me/51925054636", name: "WhatsApp" },
    ];

    return (
        <footer className="bg-card text-card-foreground border-t border-border select-none">
            <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-12 lg:py-16">
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
                    {/* Branding & Social */}
                    <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                            <div className="w-28">
                                <Logo />
                            </div>
                            <P className="text-xs text-muted-foreground max-w-sm">
                                Elevando tu experiencia digital. Descubre la selección más curada de tecnología y accesorios premium en Cañete.
                            </P>
                            <div className="flex gap-3">
                                {social.map(({ icon, href, name }) => (
                                    <a
                                        key={name}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={name}
                                        className="text-muted-foreground hover:text-foreground transition-colors p-2 bg-muted/20 border border-border"
                                    >
                                        {icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
                        {/* Column: Explorar */}
                        <nav className="flex flex-col gap-3">
                            <H4 className="text-foreground">Explorar</H4>
                            <ul className="flex flex-col gap-2">
                                {shopLinks.map(({ label, href }) => (
                                    <li key={label}>
                                        <Link
                                            href={href}
                                            prefetch={false}
                                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Column: Marcas */}
                        <nav className="flex flex-col gap-3">
                            <H4 className="text-foreground">Marcas</H4>
                            <ul className="flex flex-col gap-2">
                                {brandLinks.map(({ label, href }) => (
                                    <li key={label}>
                                        <Link
                                            href={href}
                                            prefetch={false}
                                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Column: Ayuda */}
                        <nav className="flex flex-col gap-3">
                            <H4 className="text-foreground">Ayuda</H4>
                            <ul className="flex flex-col gap-2">
                                {helpCenterLinks.map(({ label, href }) => (
                                    <li key={href}>
                                        <Link
                                            href={href}
                                            prefetch={false}
                                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Column: Ubicación */}
                        <div className="flex flex-col gap-3">
                            <H4 className="text-foreground">Nos ubicamos en</H4>
                            <div className="space-y-0.5">
                                <Small className="block">Jr. O Higgins 120</Small>
                                <Small className="block">San Vicente de Cañete</Small>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar: Legal & Global */}
                <div className="mt-12 pt-6 border-t border-border">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                        <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 order-2 lg:order-1">
                            <Small suppressHydrationWarning>
                                © {new Date().getFullYear()} GoPhone Inc.
                            </Small>

                            <nav className="flex items-center gap-3">
                                {legalLinks.map((link, index) => (
                                    <div key={link.href} className="flex items-center gap-3">
                                        <Link
                                            href={link.href}
                                            prefetch={false}
                                            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                        {index < legalLinks.length - 1 && (
                                            <span className="w-px h-2.5 bg-border" />
                                        )}
                                    </div>
                                ))}
                            </nav>

                            <Link
                                href="/libro-de-reclamaciones"
                                prefetch={false}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-border text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors"
                            >
                                <FaBookOpen className="w-3 h-3 text-foreground/80 shrink-0" />
                                Libro de Reclamaciones
                            </Link>
                        </div>

                        <div className="flex flex-col items-center lg:items-end gap-1.5 order-1 lg:order-2 w-full lg:w-auto border-b lg:border-b-0 pb-6 lg:pb-0 border-border">
                            <Small>Medios de pago</Small>
                            <PaymentMethods />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}