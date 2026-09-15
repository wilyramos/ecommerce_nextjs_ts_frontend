// File: frontend/components/layout/Footer.tsx

"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaBookOpen } from "react-icons/fa";
import PaymentMethods from "./PaymentMethods";
import Logo from "../ui/Logo";
import { routes } from "@/lib/routes";
import { H4, P, Small } from "@/components/ui/TypographyV3";

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
    ];

    const legalLinks = [
        { label: "Privacidad", href: "/hc/politicas-de-privacidad" },
        { label: "Términos y condiciones", href: "/terminos-y-condiciones" },
        { label: "Cambios y devoluciones", href: "/politicas-de-cambios-y-devoluciones" },
    ];

    const social = [
        { icon: <FaFacebookF size={13} />, href: "https://facebook.com/gophone.pe", name: "Facebook" },
        { icon: <FaInstagram size={13} />, href: "https://instagram.com/gophone.pe", name: "Instagram" },
        { icon: <FaWhatsapp size={13} />, href: "https://wa.me/51925054636", name: "WhatsApp" },
    ];

    return (
        <footer className="w-full border-t border-border-primary/80 bg-surface-primary text-text-primary select-none">
            <div className="mx-auto max-w-screen-2xl px-4 py-12 md:px-6 md:py-16">
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
                    {/* Branding & Social */}
                    <div className="flex flex-col justify-between space-y-6 lg:col-span-4">
                        <div className="space-y-3.5">
                            <div className="w-28">
                                <Logo color="black" />
                            </div>
                            <P className="max-w-sm text-xs leading-relaxed text-text-secondary">
                                Elevando tu experiencia digital. Descubre la selección más curada de tecnología y accesorios premium en Cañete.
                            </P>
                            <div className="flex items-center gap-2 pt-1">
                                {social.map(({ icon, href, name }) => (
                                    <a
                                        key={name}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={name}
                                        className="flex size-8 items-center justify-center rounded-radius-md border border-border-primary/80 bg-surface-secondary/50 text-text-secondary transition-colors duration-fast hover:border-border-strong hover:bg-surface-secondary hover:text-text-primary"
                                    >
                                        {icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
                        {/* Column: Explorar */}
                        <nav className="flex flex-col gap-3">
                            <H4 className="text-[11px] font-semibold uppercase text-text-tertiary">
                                Explorar
                            </H4>
                            <ul className="flex flex-col gap-2">
                                {shopLinks.map(({ label, href }) => (
                                    <li key={label}>
                                        <Link
                                            href={href}
                                            prefetch={false}
                                            className="text-xs text-text-secondary transition-colors duration-fast hover:text-text-primary"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Column: Marcas */}
                        <nav className="flex flex-col gap-3">
                            <H4 className="text-[11px] font-semibold uppercase   text-text-tertiary">
                                Marcas
                            </H4>
                            <ul className="flex flex-col gap-2">
                                {brandLinks.map(({ label, href }) => (
                                    <li key={label}>
                                        <Link
                                            href={href}
                                            prefetch={false}
                                            className="text-xs text-text-secondary transition-colors duration-fast hover:text-text-primary"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Column: Ayuda */}
                        <nav className="flex flex-col gap-3">
                            <H4 className="text-[11px] font-semibold uppercase   text-text-tertiary">
                                Ayuda
                            </H4>
                            <ul className="flex flex-col gap-2">
                                {helpCenterLinks.map(({ label, href }) => (
                                    <li key={href}>
                                        <Link
                                            href={href}
                                            prefetch={false}
                                            className="text-xs text-text-secondary transition-colors duration-fast hover:text-text-primary"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Column: Ubicación */}
                        <div className="flex flex-col gap-3">
                            <H4 className="text-[11px] font-semibold uppercase   text-text-tertiary">
                                Ubicación
                            </H4>
                            <div className="space-y-1 text-xs text-text-secondary">
                                <p className="font-medium text-text-primary">Jr. O Higgins 120</p>
                                <p>San Vicente de Cañete</p>
                                <p className="text-[11px] text-text-tertiary">Lima, Perú</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar: Legal & Medios de pago */}
                <div className="mt-12 border-t border-border-primary/80 pt-6">
                    <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
                        <div className="order-2 flex flex-col items-center gap-4 sm:flex-row md:gap-6 lg:order-1">
                            <Small suppressHydrationWarning className="text-xs text-text-tertiary">
                                © {new Date().getFullYear()} GoPhone Inc.
                            </Small>

                            <nav className="flex flex-wrap items-center justify-center gap-3">
                                {legalLinks.map((link, index) => (
                                    <div key={link.href} className="flex items-center gap-3">
                                        <Link
                                            href={link.href}
                                            prefetch={false}
                                            className="text-[11px] text-text-secondary transition-colors duration-fast hover:text-text-primary"
                                        >
                                            {link.label}
                                        </Link>
                                        {index < legalLinks.length - 1 && (
                                            <span className="h-2.5 w-px bg-border-primary" />
                                        )}
                                    </div>
                                ))}
                            </nav>

                            <Link
                                href="/libro-de-reclamaciones"
                                prefetch={false}
                                className="inline-flex items-center gap-1.5 rounded-radius-sm border border-border-primary/80 bg-surface-secondary/40 px-2.5 py-1 text-[11px] text-text-secondary transition-colors duration-fast hover:border-border-strong hover:bg-surface-secondary hover:text-text-primary"
                            >
                                <FaBookOpen className="size-3 shrink-0 text-text-primary" />
                                <span>Libro de Reclamaciones</span>
                            </Link>
                        </div>

                        <div className="order-1 flex w-full flex-col items-center gap-2 border-b border-border-primary/80 pb-6 lg:order-2 lg:w-auto lg:items-end lg:border-b-0 lg:pb-0">
                            <Small className="text-[10px] font-semibold uppercase   text-text-tertiary">
                                Medios de pago
                            </Small>
                            <PaymentMethods />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}