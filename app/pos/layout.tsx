import { verifySession } from '@/src/auth/dal';
import ToastNotification from "@/components/ui/ToastNotification";
import SidebarPOS from "@/components/POS/SidebarPOS";

export default async function POSlayout({ children }: { children: React.ReactNode }) {
    const { user } = await verifySession();

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar oculto en móviles */}
            <aside className="hidden md:block">
                <SidebarPOS user={user} />
            </aside>

            {/* Contenido principal scrollable */}
            <main className="flex-grow overflow-y-auto px-4 py-4 bg-white">
                {children}
            </main>

            <ToastNotification />
        </div>
    );
}
