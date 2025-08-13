"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import Logo from "../ui/Logo";
import PaymentMethods from "./PaymentMethods";

export default function Footer() {
    const links = [
        { label: "Inicio", href: "/" },
        { label: "Productos", href: "/productos" },
        { label: "Categorías", href: "/categorias" },
    ];

    const social = [
        { icon: <FaFacebookF />, href: "https://www.facebook.com/gophone.pe", name: "Facebook" },
        { icon: <FaInstagram />, href: "https://www.instagram.com/gophone.pe", name: "Instagram" },
        {
            icon: <FaWhatsapp />,
            href: "https://api.whatsapp.com/send?phone=51907103353&text=Hola%20Gophone,%20tengo%20una%20consulta",
            name: "WhatsApp",
        },
    ];

    return (
        <footer className="bg-slate-50 border-t border-gray-300 text-neutral-700 text-sm">
            <div className="max-w-7xl mx-auto px-6 py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {/* Branding */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Logo />
                        <h3 className="font-bold text-2xl text-gray-700">Cañete</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm">
                        Tecnología móvil, accesorios originales y atención personalizada.<br />
                        Jr. O Higgins 120, San Vicente de Cañete.
                    </p>
                </div>

                {/* Navegación */}
                <nav>
                    <h3 className="mb-3 font-semibold text-gray-900">Explora</h3>
                    <ul className="space-y-2">
                        {links.map(({ label, href }) => (
                            <li key={href}>
                                <Link href={href} className="hover:underline">
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Contacto */}
                <div>
                    <h3 className="mb-3 font-semibold text-gray-900">Contacto</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li>
                            Tel: <a href="tel:+51907103353" className="hover:underline">+51 907 103 353</a>
                        </li>
                        <li>
                            Email: <a href="mailto:ventas@gophone.pe" className="hover:underline">ventas@gophone.pe</a>
                        </li>
                        <li>Horario: Lun-Sáb 10am - 7pm</li>
                    </ul>
                </div>

                {/* Redes sociales */}
                <div>
                    <h3 className="mb-3 font-semibold text-gray-900">Síguenos</h3>
                    <div className="flex gap-4">
                        {social.map(({ icon, href, name }) => (
                            <a
                                key={name}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={name}
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 text-white hover:bg-indigo-600 transition"
                            >
                                {icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <PaymentMethods />

            {/* Footer bottom */}
            <div className="border-t border-gray-300 text-center py-4 text-xs text-gray-500">
                © {new Date().getFullYear()} Gophone. Todos los derechos reservados.
            </div>
        </footer>
    );
}
