"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import PaymentMethods from "./PaymentMethods"; // Asegúrate de que este componente soporte modo oscuro o sea SVG
import Logo from "../ui/Logo"; // Asegúrate de que tu Logo se vea bien sobre fondo oscuro (o pasa una prop className)

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
        <footer className="bg-neutral-950 text-neutral-400 text-sm border-t border-neutral-900">
            {/* Contenido principal */}
            <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">

                    {/* COL 1: Brand & Info (Ocupa más espacio en desktop) */}
                    <div className="lg:col-span-4 flex flex-col items-start gap-4">
                        <div className="opacity-90 grayscale brightness-200 contrast-200">
                            {/* Ajuste visual para el logo en modo oscuro */}
                            <div className="w-20">
                                <Logo
                                    color="white"
                                />
                            </div>
                        </div>
                        <p className="text-neutral-500 leading-relaxed text-sm max-w-xs">
                            Calidad premium a tu alcance. Especialistas en tecnología y estilo de vida.
                        </p>
                        <div className="mt-2 text-xs text-neutral-600">
                            <p>Jr. O Higgins 120,</p>
                            <p>San Vicente de Cañete, Perú.</p>
                        </div>
                    </div>

                    {/* COL 2: Navegación */}
                    <nav className="lg:col-span-2">
                        <h3 className="mb-6 font-medium text-white text-xs uppercase tracking-wider">
                            Explora
                        </h3>
                        <ul className="space-y-3">
                            {links.map(({ label, href }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className="hover:text-white transition-colors duration-300 block w-fit"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* COL 3: Centro de Ayuda */}
                    <nav className="lg:col-span-3">
                        <h3 className="mb-6 font-medium text-white text-xs uppercase tracking-wider">
                            Soporte
                        </h3>
                        <ul className="space-y-3">
                            {helpCenterLinks.map(({ label, href }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className="hover:text-white transition-colors duration-300 block w-fit"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* COL 4: Contacto y Social */}
                    <div className="lg:col-span-3">
                        <h3 className="mb-6 font-medium text-white text-xs uppercase tracking-wider">
                            Contacto
                        </h3>
                        <ul className="space-y-3 mb-8">
                            <li>
                                <a
                                    href="mailto:contacto@gophone.pe"
                                    className="hover:text-white transition-colors duration-300 border-b border-transparent hover:border-white/50 pb-0.5"
                                >
                                    contacto@gophone.pe
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:+51925054636"
                                    className="hover:text-white transition-colors duration-300"
                                >
                                    +51 925 054 636
                                </a>
                            </li>
                            <li className="text-neutral-600 text-xs mt-1">
                                Lun-Sáb 10am - 7pm
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
                                    className="text-xl text-neutral-500 hover:text-white hover:scale-110 transition-all duration-300"
                                >
                                    {icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="border-t border-neutral-900 bg-neutral-950">
                <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">

                    <div className="text-xs text-neutral-600 text-center md:text-left">
                        © {new Date().getFullYear()} Gophone. Todos los derechos reservados.
                        <span className="hidden sm:inline"> · </span>
                        <br className="sm:hidden" />
                        <span className="opacity-70">Desarrollado por Wily Ramos</span>
                    </div>

                    <div className="opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
                        <PaymentMethods />
                    </div>
                </div>
            </div>
        </footer>
    );
}