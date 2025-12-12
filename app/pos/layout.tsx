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
        <div className="flex h-screen overflow-hidden bg-white md:flex-row">

            {/* HEADER MÓVIL */}
            <header className="flex h-14 shrink-0 items-center justify-between border-b px-2 md:hidden">
                <MobileSidebarPOS user={user} />
                <Logo />
                <div className="w-6" />
            </header>

            {/* SIDEBAR DESKTOP */}
            <aside className="hidden h-full w-60 shrink-0 border-r md:block">
                <SidebarPOS user={user} />
            </aside>

            {/* AREA DE CONTENIDO SCROLLEABLE */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>

            <ToastNotification />
        </div>
    );
}
