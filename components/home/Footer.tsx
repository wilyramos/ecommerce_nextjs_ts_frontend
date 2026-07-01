"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaBookOpen } from "react-icons/fa";
import PaymentMethods from "./PaymentMethods";
import Logo from "../ui/Logo";
import { routes } from "@/lib/routes";

export default function Footer() {
    const shopLinks = [
        { label: "Ver todo", href: routes.catalog() },
        { label: "Novedades", href: "/novedades" },
        { label: "Ofertas", href: "/ofertas" },
        { label: "Categorías", href: "/categorias" },
    ];

    const brandLinks = [
        { label: "Apple", href: routes.catalog({ brand: 'apple' }) },
        { label: "iFans", href: routes.catalog({ brand: 'ifans' }) },
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
        { icon: <FaFacebookF size={16} />, href: "https://facebook.com/gophone.pe", name: "Facebook" },
        { icon: <FaInstagram size={16} />, href: "https://instagram.com/gophone.pe", name: "Instagram" },
        { icon: <FaWhatsapp size={16} />, href: "https://wa.me/51925054636", name: "WhatsApp" },
    ];

    return (
        <footer className="bg-card text-card-foreground border-t border-border select-none">
            <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-14 lg:py-20">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">

                    {/* Branding & Social */}
                    <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
                        <div className="space-y-5">
                            <div className="w-28">
                                <Logo />
                            </div>
                            <p className="text-xs leading-relaxed max-w-sm text-muted-foreground font-medium">
                                Elevando tu experiencia digital. Descubre la selección más curada de tecnología y accesorios premium en Cañete.
                            </p>
                            <div className="flex gap-4">
                                {social.map(({ icon, href, name }) => (
                                    <a
                                        key={name}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={name}
                                        className="text-muted-foreground hover:text-action-cta transition-colors p-1.5 bg-background-secondary border border-border rounded-[var(--radius-sm)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
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
                        <nav className="flex flex-col gap-4">
                            <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-foreground">
                                Explorar
                            </h3>
                            <ul className="flex flex-col gap-2.5">
                                {shopLinks.map(({ label, href }) => (
                                    <li key={label}>
                                        <Link href={href} className="text-xs  text-muted-foreground hover:text-action-cta transition-colors focus-visible:outline-hidden">
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Column: Marcas */}
                        <nav className="flex flex-col gap-4">
                            <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-foreground">
                                Marcas
                            </h3>
                            <ul className="flex flex-col gap-2.5">
                                {brandLinks.map(({ label, href }) => (
                                    <li key={label}>
                                        <Link href={href} className="text-xs  text-muted-foreground hover:text-action-cta transition-colors focus-visible:outline-hidden">
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Column: Ayuda */}
                        <nav className="flex flex-col gap-4">
                            <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-foreground">
                                Ayuda
                            </h3>
                            <ul className="flex flex-col gap-2.5">
                                {helpCenterLinks.map(({ label, href }) => (
                                    <li key={href}>
                                        <Link href={href} className="text-xs  text-muted-foreground hover:text-action-cta transition-colors focus-visible:outline-hidden">
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Column: Visítanos */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-foreground">
                                Nos ubicamos en
                            </h3>
                            <div className="text-xs text-muted-foreground  leading-relaxed space-y-0.5">
                                <p>Jr. O Higgins 120</p>
                                <p>San Vicente de Cañete</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar: Legal & Global */}
                <div className="mt-16 pt-6 border-t border-border">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-6">

                        <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-8 order-2 lg:order-1">
                            <span
                                className="text-[11px] text-muted-foreground "
                                suppressHydrationWarning
                            >
                                © {new Date().getFullYear()} GoPhone Inc.
                            </span>
                            <nav className="flex items-center gap-4">
                                {legalLinks.map((link, index) => (
                                    <div key={link.href} className="flex items-center gap-4">
                                        <Link
                                            href={link.href}
                                            className="text-[11px] text-muted-foreground  hover:text-foreground transition-colors focus-visible:outline-hidden"
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
                                className="inline-flex items-center gap-2 px-3 py-2 border border-border text-xs  text-muted-foreground hover:text-foreground hover:bg-background-secondary transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <FaBookOpen className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                Libro de Reclamaciones
                            </Link>
                        </div>

                        <div className="flex flex-col items-center lg:items-end gap-2 order-1 lg:order-2 w-full lg:w-auto border-b lg:border-b-0 pb-6 lg:pb-0 border-border">
                            <span className="text-[11px] text-muted-foreground">
                                Medios de pago:
                            </span>
                            <PaymentMethods />
                        </div>

                    </div>
                </div>
            </div>
        </footer>
    );
}