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
        <footer className="bg-gray-950 text-gray-300 text-sm">
            {/* Contenido principal */}
            <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {/* Branding */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        
                        <h3 className="font-bold text-2xl text-white"> GOPHONE Cañete</h3>
                    </div>
                    <p className="text-gray-400 leading-relaxed text-sm">
                        Tecnología móvil, accesorios originales y atención personalizada.
                        <br />
                        Jr. O Higgins 120, San Vicente de Cañete.
                    </p>
                </div>

                {/* Navegación */}
                <nav>
                    <h3 className="mb-4 font-semibold text-white text-lg relative after:block after:w-8 after:h-1 after:bg-indigo-500 after:mt-1">
                        Explora
                    </h3>
                    <ul className="space-y-2">
                        {links.map(({ label, href }) => (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className="hover:text-indigo-400 transition-colors duration-200"
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Contacto */}
                <div>
                    <h3 className="mb-4 font-semibold text-white text-lg relative after:block after:w-8 after:h-1 after:bg-indigo-500 after:mt-1">
                        Contacto
                    </h3>
                    <ul className="space-y-2 text-gray-400">
                        <li>
                            Tel:{" "}
                            <a
                                href="tel:+51907103353"
                                className="hover:text-indigo-400 transition-colors duration-200"
                            >
                                +51 907 103 353
                            </a>
                        </li>
                        <li>
                            Email:{" "}
                            <a
                                href="mailto:ventas@gophone.pe"
                                className="hover:text-indigo-400 transition-colors duration-200"
                            >
                                ventas@gophone.pe
                            </a>
                        </li>
                        <li>Horario: Lun-Sáb 10am - 7pm</li>
                    </ul>
                </div>

                {/* Redes sociales */}
                <div>
                    <h3 className="mb-4 font-semibold text-white text-lg relative after:block after:w-8 after:h-1 after:bg-indigo-500 after:mt-1">
                        Síguenos
                    </h3>
                    <div className="flex gap-4">
                        {social.map(({ icon, href, name }) => (
                            <a
                                key={name}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={name}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-indigo-500 text-white transition-colors duration-300 shadow-lg hover:shadow-indigo-500/30"
                            >
                                {icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer bottom */}
            <div className="border-t border-gray-700 text-center py-5 text-xs text-gray-500">
                © {new Date().getFullYear()} Gophone. Todos los derechos reservados.
            </div>
        </footer>
    );
}
