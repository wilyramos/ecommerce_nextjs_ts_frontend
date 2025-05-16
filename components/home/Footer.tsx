"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-10 pb-6">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Marca / Acerca */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-4">GoStore</h2>
                    <p className="text-sm">
                        Tu tienda de confianza para lo último en tecnología. Productos originales, atención rápida y envíos a todo el país.
                    </p>
                </div>

                {/* Enlaces */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Enlaces rápidos</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/" className="hover:text-white">Inicio</Link></li>
                        <li><Link href="/productos" className="hover:text-white">Productos</Link></li>
                        <li><Link href="/categorias" className="hover:text-white">Categorías</Link></li>
                        <li><Link href="/contacto" className="hover:text-white">Contacto</Link></li>
                        <li><Link href="/nosotros" className="hover:text-white">Nosotros</Link></li>
                    </ul>
                </div>

                {/* Ayuda */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Soporte</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/politica-de-privacidad" className="hover:text-white">Política de Privacidad</Link></li>
                        <li><Link href="/terminos" className="hover:text-white">Términos y Condiciones</Link></li>
                        <li><Link href="/envios" className="hover:text-white">Envíos y Devoluciones</Link></li>
                    </ul>
                </div>

                {/* Redes sociales */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Síguenos</h3>
                    <div className="flex space-x-4">
                        <Link href="https://www.facebook.com" target="_blank" className="text-gray-400 hover:text-white">
                            <FaFacebookF size={20} />
                        </Link>
                        <Link href="https://www.instagram.com" target="_blank" className="text-gray-400 hover:text-white">
                            <FaInstagram size={20} />
                        </Link>
                        <Link href="https://www.twitter.com" target="_blank" className="text-gray-400 hover:text-white">
                            <FaTwitter size={20} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} TechStore. Todos los derechos reservados.
            </div>
        </footer>
    );
}