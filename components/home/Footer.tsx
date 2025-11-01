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
        <footer className="bg-neutral-100 text-gray-700 text-sm py-4">

            <PaymentMethods />
            {/* Contenido principal */}
            <div className="max-w-7xl mx-auto px-6 py-2 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {/* Branding */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Logo />
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm">
                        Tecnología móvil, accesorios originales y atención personalizada.
                        <br />
                        Jr. O Higgins 120, San Vicente de Cañete.
                    </p>
                </div>

                {/* Navegación */}
                <nav>
                    <h3 className="mb-4 font-semibold text-gray-900 text-lg relative after:block after:w-8 after:h-1 after:bg-black after:mt-1">
                        Explora
                    </h3>
                    <ul className="space-y-2">
                        {links.map(({ label, href }) => (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className="hover:text-black transition-colors duration-200"
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Contacto */}
                <div>
                    <h3 className="mb-4 font-semibold text-gray-900 text-lg relative after:block after:w-8 after:h-1 after:bg-black after:mt-1">
                        Contacto
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                        <li>
                            Tel:{" "}
                            <a
                                href="tel:+51925054636"
                                className="hover:text-black transition-colors duration-200"
                            >
                                +51 925 054 636
                            </a>
                        </li>
                        <li>
                            Email:{" "}
                            <a
                                href="mailto:ventas@gophone.pe"
                                className="hover:text-black transition-colors duration-200"
                            >
                                ventas@gophone.pe
                            </a>
                        </li>
                        <li>Horario: Lun-Sáb 10am - 7pm</li>
                    </ul>
                </div>

                {/* Redes sociales */}
                <div>
                    <h3 className="mb-4 font-semibold text-gray-900 text-lg relative after:block after:w-8 after:h-1 after:bg-black after:mt-1">
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
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-black text-gray-700 hover:text-white transition-colors duration-300 shadow-sm hover:shadow-indigo-200"
                            >
                                {icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer bottom */}
            <div className="border-t border-gray-300 text-center py-4 px-6 text-xs text-gray-500">
                © {new Date().getFullYear()} <span className="font-semibold text-gray-700">Gophone</span>.
                Todos los derechos reservados · Developed by{" "}
                <span className="font-light">Wily Ramos</span>
            </div>
        </footer>
    );
}
