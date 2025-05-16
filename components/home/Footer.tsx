"use client";

import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

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
                        <li><a href="/productos" className="hover:text-white">Productos</a></li>
                        <li><a href="/ofertas" className="hover:text-white">Ofertas</a></li>
                        <li><a href="/contacto" className="hover:text-white">Contacto</a></li>
                        <li><a href="/faq" className="hover:text-white">Preguntas Frecuentes</a></li>
                    </ul>
                </div>

                {/* Ayuda */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Soporte</h3>
                    <ul className="space-y-2 text-sm">
                        <li><a href="/politica-de-privacidad" className="hover:text-white">Política de Privacidad</a></li>
                        <li><a href="/terminos" className="hover:text-white">Términos y Condiciones</a></li>
                        <li><a href="/envios" className="hover:text-white">Envíos y Devoluciones</a></li>
                    </ul>
                </div>

                {/* Redes sociales */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Síguenos</h3>
                    <div className="flex space-x-4">
                        <a href="#" aria-label="Facebook" className="hover:text-white">
                            <FaFacebookF />
                        </a>
                        <a href="#" aria-label="Instagram" className="hover:text-white">
                            <FaInstagram />
                        </a>
                        <a href="#" aria-label="Twitter" className="hover:text-white">
                            <FaTwitter />
                        </a>
                        <a href="#" aria-label="YouTube" className="hover:text-white">
                            <FaYoutube />
                        </a>
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