// File: frontend/components/profile/settings/LogoutButton.tsx
"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { logout } from "@/actions/logout-user-action";

export function LogoutButton() {
    const [isPending, startTransition] = useTransition();

    const handleLogout = () => {
        startTransition(() => {
            logout();
        });
    };

    return (
        <button
            type="button"
            onClick={handleLogout}
            disabled={isPending}
            className="mt-3 inline-flex items-center justify-center rounded-radius-md border border-border-primary px-4 py-2 text-xs font-semibold text-text-primary hover:bg-surface-secondary transition-colors disabled:opacity-50"
        >
            <LogOut className="w-4 h-4 mr-2" />
            {isPending ? "Cerrando sesión..." : "Cerrar Sesión"}
        </button>
    );
}