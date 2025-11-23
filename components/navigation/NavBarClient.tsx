"use client";

import { ReactNode } from "react";

export default function NavBarClient({ children }: { children: ReactNode }) {
    return (
        <div className="sticky top-0 z-50 bg-white shadow-xs transition-all duration-300">
            {children}
        </div>
    );
}
