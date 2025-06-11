'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Hamburger from 'hamburger-react';

export default function MobileMenuToggle() {
    const [open, setOpen] = useState(false);

    const menuItems = [
        { name: 'Productos', href: '/productos' },
        { name: 'Registro', href: '/auth/registro' },
        { name: 'Login', href: '/auth/login' },
    ];

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : 'auto';
    }, [open]);

    return (
        <>
            {/* Botón hamburguesa */}
            <div className="md:hidden z-50 relative">
                <Hamburger toggled={open} toggle={setOpen} size={20} />
            </div>

            {/* Menú móvil: altura limitada */}
            {open && (
                <div className="absolute top-full left-0 w-full bg-white shadow-md z-40 py-4 flex flex-col items-center gap-4 border-t">
                    {menuItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-gray-800 text-base font-medium hover:text-indigo-600 transition"
                            onClick={() => setOpen(false)}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
}
