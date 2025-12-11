import { verifySession } from "@/src/auth/dal";
import { redirect } from "next/navigation";
import ToastNotification from "@/components/ui/ToastNotification";
import Logo from "@/components/ui/Logo";
import MobileSidebarPOS from "@/components/POS/MobileSidebarPOS";
import SidebarPOS from "@/components/POS/SidebarPOS";

export default async function POSlayout({ children }: { children: React.ReactNode }) {
    const { user } = await verifySession();
    if (user.rol !== "administrador" && user.rol !== "vendedor") redirect("/profile");

    return (
        <div className="flex h-dvh flex-col overflow-hidden bg-white md:flex-row">
            
            {/* HEADER MÓVIL (Solo visible en < md) */}
            <header className="flex h-14 shrink-0 items-center justify-between border-b px-2 md:hidden">
                <MobileSidebarPOS user={user} />
                <Logo />
                <div className="w-6" /> {/* Espaciador para centrar logo */}
            </header>

            {/* SIDEBAR DESKTOP (Solo visible en md+) */}
            <aside className="hidden h-full shrink-0 border-r md:block">
                <SidebarPOS user={user} />
            </aside>

            {/* CONTENEDOR PRINCIPAL */}
            <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
                {children}
            </main>

            <ToastNotification />
        </div>
    );
}