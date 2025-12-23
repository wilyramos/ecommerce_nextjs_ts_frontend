"use client";

import { ReactNode } from "react";

export default function NavBarClient({ children }: { children: ReactNode }) {
    return (
        <div
            id="navbar-fixed"
            className="fixed top-0 left-0 w-full z-[22]"
        >
            {children}
        </div>
    );
}
