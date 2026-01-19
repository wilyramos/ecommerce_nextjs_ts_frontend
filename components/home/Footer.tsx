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
    ];

    const helpCenterLinks = [
        { label: "Contacto y soporte", href: "/hc/contacto-y-soporte" },
        { label: "Proceso de compra", href: "/hc/proceso-de-compra" },
        { label: "Garantías y devoluciones", href: "/hc/garantias-y-devoluciones" },
        { label: "Preguntas frecuentes", href: "/hc/preguntas-frecuentes" },
        { label: "Políticas de privacidad", href: "/hc/politicas-de-privacidad" },
    ];

    const social = [
        { icon: <FaFacebookF />, href: "https://www.facebook.com/gophone.pe", name: "Facebook" },
        { icon: <FaInstagram />, href: "https://www.instagram.com/gophone.pe", name: "Instagram" },
        {
            icon: <FaWhatsapp />,
            href: "https://api.whatsapp.com/send?phone=51925054636&text=Hola%20Gophone,%20tengo%20una%20consulta",
            name: "WhatsApp",
        },
    ];

    return (
        <footer
            className="
                bg-[var(--store-surface)]
                text-[var(--store-text-muted)]
                text-sm
                border-t
                border-[var(--store-border)]
            "
        >
            {/* Contenido principal */}
            <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">

                    {/* Brand */}
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        <div className="w-20 opacity-100">
                            {/* Logo en negro para contrastar con el fondo blanco/gris claro */}
                            <Logo color="black" />
                        </div>

                        <p className="text-sm leading-relaxed max-w-xs text-[var(--store-text-muted)]">
                            Calidad premium a tu alcance. Especialistas en tecnología y estilo de vida.
                        </p>

                        <div className="text-xs text-[var(--store-text-muted)] opacity-80 mt-2">
                            <p>Jr. O Higgins 120</p>
                            <p>San Vicente de Cañete, Perú</p>
                        </div>
                    </div>

                    {/* Navegación */}
                    <nav className="lg:col-span-2">
                        <h3
                            className="
                                mb-6
                                text-xs
                                uppercase
                                tracking-wider
                                font-semibold
                                text-[var(--store-text)]
                            "
                        >
                            Explora
                        </h3>
                        <ul className="space-y-3">
                            {links.map(({ label, href }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className="
                                            block w-fit
                                            transition-colors duration-200
                                            hover:text-[var(--store-primary)]
                                            hover:underline
                                        "
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Soporte */}
                    <nav className="lg:col-span-3">
                        <h3
                            className="
                                mb-6
                                text-xs
                                uppercase
                                tracking-wider
                                font-semibold
                                text-[var(--store-text)]
                            "
                        >
                            Soporte
                        </h3>
                        <ul className="space-y-3">
                            {helpCenterLinks.map(({ label, href }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className="
                                            block w-fit
                                            transition-colors duration-200
                                            hover:text-[var(--store-primary)]
                                            hover:underline
                                        "
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Contacto */}
                    <div className="lg:col-span-3">
                        <h3
                            className="
                                mb-6
                                text-xs
                                uppercase
                                tracking-wider
                                font-semibold
                                text-[var(--store-text)]
                            "
                        >
                            Contacto
                        </h3>

                        <ul className="space-y-3 mb-8">
                            <li>
                                <a
                                    href="mailto:contacto@gophone.pe"
                                    className="
                                        transition-colors duration-200
                                        hover:text-[var(--store-primary)]
                                    "
                                >
                                    contacto@gophone.pe
                                </a>
                            </li>

                            <li>
                                <a
                                    href="tel:+51925054636"
                                    className="
                                        hover:text-[var(--store-primary)] 
                                        transition-colors duration-200
                                    "
                                >
                                    +51 925 054 636
                                </a>
                            </li>

                            <li className="text-xs opacity-70 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                                Lun–Sáb · 10am – 7pm
                            </li>
                        </ul>

                        <div className="flex gap-4">
                            {social.map(({ icon, href, name }) => (
                                <a
                                    key={name}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={name}
                                    className="
                                        text-xl
                                        text-[var(--store-text-muted)]
                                        transition-all duration-300
                                        hover:text-[var(--store-text)]
                                        hover:scale-110
                                    "
                                >
                                    {icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div
                className="
                    border-t
                    border-[var(--store-border)]
                    bg-[var(--store-bg)]
                "
            >
                <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

                    <div className="text-xs text-center md:text-left text-[var(--store-text-muted)]">
                        © {new Date().getFullYear()} Gophone. Todos los derechos reservados.
                    </div>

                    <div className="opacity-80 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                        <PaymentMethods />
                    </div>
                </div>
            </div>
        </footer>
    );
}