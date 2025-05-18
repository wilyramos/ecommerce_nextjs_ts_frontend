'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function MobileMenuToggle() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                className="md:hidden text-gray-600"
                onClick={() => setOpen(!open)}
            >
                {open ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>

            {open && (
                <nav className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md z-50 p-6">
                    <ul className="flex flex-col gap-2">
                        {[
                            { href: '/shop/telefonos', label: 'Celulares' },
                            { href: '/shop/accesorios', label: 'Accesorios' },
                            { href: '/shop/laptops', label: 'Laptops' },
                            { href: '/shop/novedades', label: 'Novedades' },
                            { href: '/shop/ofertas', label: 'Ofertas' },
                            { href: '/productos', label: 'Tienda' },
                            { href: '/shop/marcas/apple', label: 'Apple' },
                            { href: '/shop/marcas/samsung', label: 'Samsung' },
                            { href: '/shop/marcas/xiaomi', label: 'Xiaomi' },
                            { href: '/auth/registro', label: 'Iniciar Sesión' },
                        ].map(({ href, label }) => (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className="block text-gray-700 hover:text-blue-600"
                                    onClick={() => setOpen(false)}
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </>
    );
}
