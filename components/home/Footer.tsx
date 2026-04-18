"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import PaymentMethods from "./PaymentMethods";
import Logo from "../ui/Logo";
import { routes } from "@/lib/routes";

export default function Footer() {
    // 1. Navigation Links
    const shopLinks = [
        { label: "Ver todo", href: routes.catalog() },
        { label: "Novedades", href: "/novedades" },
        { label: "Ofertas", href: "/ofertas" },
        { label: "Categorías", href: "/categorias" }, 
    ];

    // 2. Brand Links
    const brandLinks = [
        { label: "Apple", href: routes.catalog({ brand: 'apple' }) },
        { label: "Samsung", href: routes.catalog({ brand: 'samsung' }) },
        { label: "Xiaomi", href: routes.catalog({ brand: 'xiaomi' }) },
    ];

    const helpCenterLinks = [
        { label: "Contacto y soporte", href: "/hc/contacto-y-soporte" },
        { label: "Garantías y devoluciones", href: "/hc/garantias-y-devoluciones" },
        { label: "Preguntas frecuentes", href: "/hc/preguntas-frecuentes" },
    ];

    const legalLinks = [
        { label: "Privacidad", href: "/hc/politicas-de-privacidad" },
        { label: "Términos", href: "/terminos" },
    ];

    const social = [
        { icon: <FaFacebookF size={18} />, href: "https://facebook.com/gophone.pe", name: "Facebook" },
        { icon: <FaInstagram size={18} />, href: "https://instagram.com/gophone.pe", name: "Instagram" },
        { icon: <FaWhatsapp size={18} />, href: "https://wa.me/51925054636", name: "WhatsApp" },
    ];

    return (
        <footer className="bg-[var(--color-bg-primary)] border-t border-[var(--color-border-default)]">
            <div className="max-w-7xl mx-auto px-6 py-14 lg:py-20">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">

                    {/* Branding & Social */}
                    <div className="lg:col-span-4 flex flex-col justify-between space-y-8">
                        <div className="space-y-6">
                            <div className="w-28">
                                <Logo color="black" />
                            </div>
                            <p className="text-[14px] leading-relaxed max-w-sm text-[var(--color-text-secondary)]">
                                Elevando tu experiencia digital. Descubre la selección más curada de tecnología y accesorios premium en Cañete.
                            </p>
                            <div className="flex gap-5">
                                {social.map(({ icon, href, name }) => (
                                    <a
                                        key={name}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={name}
                                        className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-all duration-300 transform hover:-translate-y-1 hover:scale-110"
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
                        <nav className="flex flex-col gap-5">
                            <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[var(--color-text-primary)]">
                                Explorar
                            </h3>
                            <ul className="flex flex-col gap-3">
                                {shopLinks.map(({ label, href }) => (
                                    <li key={label}>
                                        <Link href={href} className="text-[13px] text-[var(--color-text-secondary)] hover:text-[var(--color-action-primary)] hover:underline transition-colors decoration-1 underline-offset-4">
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Column: Marcas */}
                        <nav className="flex flex-col gap-5">
                            <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[var(--color-text-primary)]">
                                Marcas
                            </h3>
                            <ul className="flex flex-col gap-3">
                                {brandLinks.map(({ label, href }) => (
                                    <li key={label}>
                                        <Link href={href} className="text-[13px] text-[var(--color-text-secondary)] hover:text-[var(--color-action-primary)] hover:underline transition-colors decoration-1 underline-offset-4">
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Column: Ayuda */}
                        <nav className="flex flex-col gap-5">
                            <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[var(--color-text-primary)]">
                                Ayuda
                            </h3>
                            <ul className="flex flex-col gap-3">
                                {helpCenterLinks.map(({ label, href }) => (
                                    <li key={href}>
                                        <Link href={href} className="text-[13px] text-[var(--color-text-secondary)] hover:text-[var(--color-action-primary)] transition-colors">
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Column: Visítanos */}
                        <div className="flex flex-col gap-5">
                            <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[var(--color-text-primary)]">
                                Visítanos
                            </h3>
                            <div className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed space-y-1">
                                <p>Jr. O Higgins 120</p>
                                <p>San Vicente de Cañete</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar: Legal & Global */}
                <div className="mt-16 pt-8 border-t border-[var(--color-border-default)]">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">

                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 order-2 md:order-1">
                            <span 
                                className="text-[11px] text-[var(--color-text-tertiary)] font-medium"
                                suppressHydrationWarning
                            >
                                © {new Date().getFullYear()} GoPhone Inc.
                            </span>
                            <nav className="flex items-center gap-4">
                                {legalLinks.map((link, index) => (
                                    <div key={link.href} className="flex items-center gap-4">
                                        <Link
                                            href={link.href}
                                            className="text-[11px] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                        {index < legalLinks.length - 1 && (
                                            <span className="w-px h-2.5 bg-[var(--color-border-default)]" />
                                        )}
                                    </div>
                                ))}
                            </nav>
                        </div>

                        <div className="flex items-center gap-4 order-1 md:order-2">
                            <div className="grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all duration-500 scale-90">
                                <PaymentMethods />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </footer>
    );
}