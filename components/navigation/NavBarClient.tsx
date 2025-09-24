// File: components/store/NavBarClient.tsx
"use client";

import { useState, useEffect, ReactNode } from "react";

export default function NavBarClient({ children }: { children: ReactNode }) {
    const [show, setShow] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setShow(false); // ocultar
            } else {
                setShow(true); // mostrar
            }
            setLastScrollY(currentScrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <div
            className={`${show ? "translate-y-0" : "-translate-y-full"} transition-transform duration-300`}
        >
            {children}
        </div>
    );
}
