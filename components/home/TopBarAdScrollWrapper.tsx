// components/home/TopBarAdScrollWrapper.tsx
"use client";
import { useEffect, useState } from "react";

export default function TopBarAdScrollWrapper({ children }: { children: React.ReactNode }) {
    const [visible, setVisible] = useState(true);
    const [lastY, setLastY] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const currentY = window.scrollY;
            // Ocultar si scrolleando hacia abajo y ya pasó 40px
            if (currentY > lastY && currentY > 40) {
                setVisible(false);
            } else {
                setVisible(true);
            }
            setLastY(currentY);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [lastY]);

    return (
        <div
            className="sticky top-0 z-[30] transition-transform duration-300"
            style={{ transform: visible ? "translateY(0)" : "translateY(-100%)" }}
        >
            {children}
        </div>
    );
}