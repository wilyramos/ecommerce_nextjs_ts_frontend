"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import PaymentMethods from "./PaymentMethods";
import Logo from "../ui/Logo";

export default function Footer() {
    const links = [
        { label: "Inicio", href: "/" },
        { label: "Productos", href: "/productos" },
        { label: "Categorías", href: "/categorias" },
        { label: "Ofertas", href: "/ofertas" },
        // { label: "Marcas", href: "/marcas" },
    ];

    const helpCenterLinks = [
        { label: "Contacto y soporte", href: "/hc/contacto-y-soporte" },
        { label: "Proceso de compra", href: "/hc/proceso-de-compra" },
        { label: "Garantías y devoluciones", href: "/hc/garantias-y-devoluciones" },
        { label: "Preguntas frecuentes", href: "/hc/preguntas-frecuentes" },
    ];

    const legalLinks = [
        { label: "Privacidad", href: "/hc/politicas-de-privacidad" },
        { label: "Términos", href: "/terminos" },
        { label: "Cookies", href: "/cookies" },
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
                    <div className="lg:col-span-5 flex flex-col justify-between">
                        <div className="space-y-6">
                            <div className="w-24">
                                <Logo color="black" />
                            </div>
                            <p className="text-[15px] leading-relaxed max-w-sm text-[var(--store-text-muted)]">
                                Elevando tu experiencia digital. Descubre la selección más curada de tecnología y accesorios premium en Cañete.
                            </p>
                            <div className="flex gap-5">
                                {social.map(({ icon, href, name }) => (
                                    <a
                                        key={name}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[var(--store-text-muted)] hover:text-[var(--store-text)] transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        {icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
                        <nav className="flex flex-col gap-5">
                            <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[var(--store-text)]">
                                Navegación
                            </h3>
                            <ul className="flex flex-col gap-3">
                                {links.map(({ label, href }) => (
                                    <li key={href}>
                                        <Link href={href} className="text-[13px] text-[var(--store-text-muted)] hover:text-[var(--store-primary)] transition-colors">
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        <nav className="flex flex-col gap-5">
                            <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[var(--store-text)]">
                                Soporte
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

                        <div className="flex flex-col gap-5 col-span-2 md:col-span-1">
                            <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[var(--store-text)]">
                                Sede Central
                            </h3>
                            <div className="text-[13px] text-[var(--store-text-muted)] leading-relaxed space-y-1">
                                <p>Jr. O Higgins 120</p>
                                <p>San Vicente de Cañete</p>
                                <div className="pt-2 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[11px] font-medium">Abierto ahora</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar: Legal & Global */}
                <div className="mt-16 pt-8 border-t border-[var(--store-border)]">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                            <span className="text-[11px] text-[var(--store-text-muted)] font-medium">
                                Copyright © {new Date().getFullYear()} GoPhone Inc.
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
                                        {index < legalLinks.length - 1 && (
                                            <span className="w-px h-2.5 bg-[var(--store-border)]" />
                                        )}
                                    </div>
                                ))}
                            </nav>
                        </div>
                        
                        <div className="flex items-center gap-6">
                            <div className="grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                                <PaymentMethods />
                            </div>
                            <span className="text-[11px] font-semibold text-[var(--store-text)]">Perú</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}