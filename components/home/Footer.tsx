"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
    const EnlacesExplora = [
        { label: "Inicio", href: "/" },
        { label: "Productos", href: "/productos" },
        { label: "Categorías", href: "/categorias" },
    ];

    const RedesSociales = [
        { icon: <FaFacebookF size={18} />, href: "https://www.facebook.com/gophone.pe" },
        { icon: <FaInstagram size={18} />, href: "https://www.instagram.com/gophone.pe" },
        { icon: <FaWhatsapp size={18} />, href: "https://api.whatsapp.com/send?phone=51907103353&text=Hola%20Gophone,%20tengo%20una%20consulta" },
    ];

    return (
        <footer className="relative bg-black text-gray-50 ">
            {/* Línea superior con gradiente */}
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-indigo-800 to-indigo-500 w-full"></div>

            {/* Contenido principal */}
            <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 text-center ">
                {/* Marca */}
                <div>
                    <h2 className="text-3xl font-extrabold text-white mb-4 tracking-wide">Gophone Cañete</h2>
                    <p className="text-xs leading-relaxed text-gray-400 max-w-xs mx-auto">
                        Lo último en tecnología móvil y accesorios. Envíos rápidos, atención garantizada y productos 100% originales.
                        Tienda física en Jr. Ohiggins 120, San Vicente de Cañete.
                    </p>
                </div>

                {/* Enlaces rápidos */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Explora</h3>
                    <ul className="space-y-2 text-sm">
                        {EnlacesExplora.map(({ label, href }) => (
                            <li key={href}>
                                <Link href={href} className="hover:text-white transition duration-200">
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Redes Sociales */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Síguenos</h3>
                    <div className="flex justify-center space-x-4">
                        {RedesSociales.map(({ icon, href }, index) => (
                            <a
                                key={index}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-100 hover:text-white transition duration-200"
                                aria-label={`Síguenos en ${href}`}
                            >
                                {icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-800 py-6 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} Gophone. Todos los derechos reservados.
            </div>
        </footer>
    );
}
