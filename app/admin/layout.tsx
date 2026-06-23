import { verifySession } from '@/src/auth/dal';
import { AdminSidebar, MobileSidebar } from "@/components/admin/AdminSidebar";
import ToastNotification from "@/components/ui/ToastNotification";
import { redirect } from 'next/navigation';
import Logo from '@/components/ui/Logo';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user } = await verifySession();
    if (user.rol !== 'administrador') redirect("/profile");

    return (
        <div className="min-h-screen bg-background text-foreground antialiased">
            {/* TOPBAR MÓVIL */}
            <div className="md:hidden fixed top-0 inset-x-0 z-40 h-12 border-b bg-background flex items-center px-3 gap-3">
                <MobileSidebar user={user} />
                <div className="flex-1 flex justify-center">
                    <Logo />
                </div>
                <div className="w-9" />
            </div>

            {/* CONTENEDOR ESTRUCTURAL */}
            <div className="flex w-full min-h-screen">
                {/* SIDEBAR ESCRITORIO (Fijo al costado mediante sticky) */}
                <aside className="hidden md:block shrink-0 sticky top-0 h-screen">
                    <AdminSidebar user={user} />
                </aside>
                
                {/* CONTENIDO PRINCIPAL (Usa el scroll nativo de la ventana) */}
                <main className="flex-1 min-w-0 pt-12 md:pt-0">
                    <div className="p-4 md:p-8 max-w-[1600px] mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>

            <ToastNotification />
        </div>
    );
}