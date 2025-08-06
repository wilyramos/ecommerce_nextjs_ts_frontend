import { verifySession } from '@/src/auth/dal';
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminSidebarMobil from "@/components/admin/AdminSidebarMobil";
import ToastNotification from "@/components/ui/ToastNotification";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user } = await verifySession();
    return (
        <>
            <div className="flex min-h-screen">
                <aside className="hidden md:block w-48">
                    <AdminSidebar user={user} />
                </aside>
                {/* Header móvil */}
                <header className="md:hidden fixed top-0 left-0 w-full z-40 flex items-center justify-between ">
                    <AdminSidebarMobil user={user} />
                </header>

                {/* Contenido principal */}
                <main className="flex-1 overflow-y-auto p-2 md:p-4">
                    {children}
                </main>
            </div>
            <ToastNotification />
        </>
    );
}
