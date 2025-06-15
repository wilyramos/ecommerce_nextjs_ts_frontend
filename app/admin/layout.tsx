// app/admin/layout.tsx
import { verifySession } from '@/src/auth/dal';
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminSidebarMobil from "@/components/admin/AdminSidebarMobil";
import ToastNotification from "@/components/ui/ToastNotification";
import Logo from '@/components/ui/Logo';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user } = await verifySession();

    return (
        <>
            <div className="flex h-screen bg-gray-50">
                {/* Sidebar escritorio */}
                <aside className="hidden md:block w-64 border-r bg-white">
                    <AdminSidebar user={user} />
                </aside>

                {/* Contenedor principal */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    
                    {/* Barra móvil */}
                    <div className="md:hidden flex items-center justify-between px-4 py-1 bg-white z-50">
                        <AdminSidebarMobil user={user} />
                        <Logo />
                    </div>

                    {/* Contenido */}
                    <main className="flex-1 overflow-y-auto px-4 md:px-6 md:py-8 w-full max-w-screen-xl mx-auto">
                        {children}
                    </main>
                </div>
            </div>

            <ToastNotification />
        </>
    );
}
