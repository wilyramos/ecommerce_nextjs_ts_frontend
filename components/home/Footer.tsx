"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="relative bg-gray-950 text-gray-300">
            {/* Línea superior con gradiente */}
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-indigo-800 to-indigo-500 w-full"></div>

            {/* Contenido principal */}
            <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
                {/* Marca */}
                <div>
                    <h2 className="text-3xl font-extrabold text-white mb-4 tracking-wide">Gophone</h2>
                    <p className="text-sm leading-relaxed text-gray-400">
                        Lo último en tecnología móvil y accesorios. Envíos rápidos, atención garantizada y productos 100% originales.
                        Tienda fisica en Jr. Ohggins 120, San Vicente de Cañete.
                    </p>
                </div>

                {/* Enlaces rápidos */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Explora</h3>
                    <ul className="space-y-2 text-sm">
                        {[
                            { label: "Inicio", href: "/" },
                            { label: "Productos", href: "/productos" },
                            { label: "Categorías", href: "/categorias" },
                            { label: "Nosotros", href: "/nosotros" },
                            { label: "Contacto", href: "/contacto" },
                        ].map(({ label, href }) => (
                            <li key={href}>
                                <Link href={href} className="hover:text-white transition duration-200">
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Soporte */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Soporte</h3>
                    <ul className="space-y-2 text-sm">
                        {[
                            { label: "Envíos y Devoluciones", href: "/" },
                            { label: "Términos y Condiciones", href: "/" },
                            { label: "Política de Privacidad", href: "/" },
                        ].map(({ label, href }) => (
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
                    <div className="flex space-x-4">
                        {[
                            { icon: <FaFacebookF size={18} />, href: "https://www.facebook.com" },
                            { icon: <FaInstagram size={18} />, href: "https://www.instagram.com" },
                            { icon: <FaTwitter size={18} />, href: "https://www.twitter.com" },
                        ].map(({ icon, href }) => (
                            <Link
                                key={href}
                                href={href}
                                target="_blank"
                                className="p-2 rounded-full bg-gray-800 hover:bg-purple-600 transition duration-300 text-gray-300 hover:text-white"
                            >
                                {icon}
                            </Link>
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
