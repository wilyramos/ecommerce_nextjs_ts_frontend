"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import PaymentMethods from "./PaymentMethods";
import Logo from "../ui/Logo";
import { routes } from "@/lib/routes";

export default function Footer() {

    // 1. Enlaces de Navegación (Priorizando lo nuevo)
    const shopLinks = [
        { label: "Ver todo", href: routes.catalog() },
        { label: "Novedades", href: "/novedades" }, // <--- NUEVO
        { label: "Ofertas", href: "/ofertas" },     // <--- NUEVO
        { label: "Celulares", href: routes.catalog({ category: 'iphone' }) },
        { label: "Audio", href: routes.catalog({ category: 'audio' }) },
        { label: "Cables y Cargadores", href: routes.catalog({ category: 'cables-y-cargadores' }) },
    ];

    // 2. Enlaces de Marcas
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
        <footer className="bg-[var(--store-surface)] border-t border-[var(--store-border)]">
            <div className="max-w-7xl mx-auto px-6 py-14 lg:py-20">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">

                    {/* Branding & Social */}
                    <div className="lg:col-span-4 flex flex-col justify-between space-y-8">
                        <div className="space-y-6">
                            <div className="w-28">
                                <Logo color="black" />
                            </div>
                            <p className="text-[14px] leading-relaxed max-w-sm text-[var(--store-text-muted)]">
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
                                        className="text-[var(--store-text-muted)] hover:text-[var(--store-text)] transition-all duration-300 transform hover:-translate-y-1 hover:scale-110"
                                    >
                                        {icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">

                        {/* Columna: Tienda */}
                        <nav className="flex flex-col gap-5">
                            <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[var(--store-text)]">
                                Explorar
                            </h3>
                            <ul className="flex flex-col gap-3">
                                {shopLinks.map(({ label, href }) => (
                                    <li key={label}>
                                        <Link href={href} className="text-[13px] text-[var(--store-text-muted)] hover:text-[var(--store-primary)] hover:underline transition-colors decoration-1 underline-offset-4">
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Columna: Marcas */}
                        <nav className="flex flex-col gap-5">
                            <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[var(--store-text)]">
                                Marcas
                            </h3>
                            <ul className="flex flex-col gap-3">
                                {brandLinks.map(({ label, href }) => (
                                    <li key={label}>
                                        <Link href={href} className="text-[13px] text-[var(--store-text-muted)] hover:text-[var(--store-primary)] hover:underline transition-colors decoration-1 underline-offset-4">
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Columna: Soporte */}
                        <nav className="flex flex-col gap-5">
                            <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[var(--store-text)]">
                                Ayuda
                            </h3>
                            <ul className="flex flex-col gap-3">
                                {helpCenterLinks.map(({ label, href }) => (
                                    <li key={href}>
                                        <Link href={href} className="text-[13px] text-[var(--store-text-muted)] hover:text-[var(--store-primary)] transition-colors">
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Columna: Info */}
                        <div className="flex flex-col gap-5">
                            <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[var(--store-text)]">
                                Visítanos
                            </h3>
                            <div className="text-[13px] text-[var(--store-text-muted)] leading-relaxed space-y-1">
                                <p>Jr. O Higgins 120</p>
                                <p>San Vicente de Cañete</p>
                                
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar: Legal & Global */}
                <div className="mt-16 pt-8 border-t border-[var(--store-border)]">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">

                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 order-2 md:order-1">
                            <span 
                                className="text-[11px] text-[var(--store-text-muted)] font-medium"
                                suppressHydrationWarning
                            >
                                © {new Date().getFullYear()} GoPhone Inc.
                            </span>
                            <nav className="flex items-center gap-4">
                                {legalLinks.map((link, index) => (
                                    <div key={link.href} className="flex items-center gap-4">
                                        <Link
                                            href={link.href}
                                            className="text-[11px] text-[var(--store-text-muted)] hover:text-[var(--store-text)] transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                        {/* Separador vertical sutil */}
                                        {index < legalLinks.length - 1 && (
                                            <span className="w-px h-2.5 bg-[var(--store-border)]" />
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