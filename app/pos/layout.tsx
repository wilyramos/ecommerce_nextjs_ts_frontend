import { verifySession } from "@/src/auth/dal";
import { redirect } from "next/navigation";
import ToastNotification from "@/components/ui/ToastNotification";
import MobileSidebarPOS from "@/components/POS/MobileSidebarPOS";
import SidebarPOS from "@/components/POS/SidebarPOS";

export default async function POSlayout({ children }: { children: React.ReactNode }) {
    const { user } = await verifySession();
    if (user.rol !== "administrador" && user.rol !== "vendedor") redirect("/profile");

    return (
        // Usamos h-[100dvh] para que en celulares la barra de navegación no tape contenido
        <div className="flex flex-col md:flex-row h-[100dvh] w-full overflow-hidden bg-[var(--admin-bg)] font-sans text-[var(--admin-text)]">

            {/* HEADER MÓVIL (Solo visible < md) */}
            <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--admin-border)] bg-[var(--admin-sidebar-bg)] px-4 md:hidden shadow-sm z-50">
                <MobileSidebarPOS user={user} />
                <div className="w-8" />
            </header>

            {/* SIDEBAR DESKTOP (Maneja su propio ancho dinámico) */}
            <SidebarPOS user={user} />

            {/* ÁREA DE CONTENIDO PRINCIPAL */}
            {/* Es flex-1 para tomar todo el espacio, y relativo para posicionar modales */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
                {children}
            </main>

            <ToastNotification />
        </div>
    );
}