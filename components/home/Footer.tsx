"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

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
        <footer className="bg-neutral-950 text-neutral-300 text-sm">
            {/* Top line */}
            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-700 to-indigo-500" />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {/* Branding */}
                <div className="col-span-1">
                    <h2 className="text-white text-xl font-semibold mb-4">Gophone Cañete</h2>
                    <p className="text-neutral-400 leading-relaxed">
                        Tecnología móvil, accesorios originales y atención personalizada. Jr. O Higgins 120, San Vicente de Cañete.
                    </p>
                </div>

                {/* Navegación */}
                <div>
                    <h3 className="text-white text-sm font-semibold mb-3">Explora</h3>
                    <ul className="space-y-2">
                        {links.map(({ label, href }) => (
                            <li key={href}>
                                <Link href={href} className="hover:text-white transition">
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contacto */}
                <div>
                    <h3 className="text-white text-sm font-semibold mb-3">Contacto</h3>
                    <ul className="space-y-2">
                        <li>Tel: <a href="tel:+51907103353" className="hover:text-white">+51 907 103 353</a></li>
                        <li>Email: <a href="mailto:ventas@gophone.pe" className="hover:text-white">ventas@gophone.pe</a></li>
                        <li>Horario: Lun-Sáb 10am - 7pm</li>
                    </ul>
                </div>

                {/* Redes sociales */}
                <div>
                    <h3 className="text-white text-sm font-semibold mb-3">Síguenos</h3>
                    <div className="flex gap-3">
                        {social.map(({ icon, href, name }) => (
                            <a
                                key={name}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={name}
                                className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-indigo-600 transition text-white"
                            >
                                {icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer bottom */}
            <div className="border-t border-neutral-800 text-center py-5 text-xs text-neutral-500">
                © {new Date().getFullYear()} Gophone. Todos los derechos reservados.
            </div>
        </footer>
    );
}
