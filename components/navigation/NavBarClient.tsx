"use client";

import { useState, useEffect, ReactNode } from "react";

export default function NavBarClient({ children }: { children: ReactNode }) {
    const [show, setShow] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                // bajando → ocultar
                setShow(false);
            } else {
                // subiendo → mostrar
                setShow(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <div
            className={`sticky top-0 z-50 transition-transform duration-300 ${show ? "translate-y-0" : "-translate-y-full"
                }`}
        >
            {children}
        </div>
    );
}
