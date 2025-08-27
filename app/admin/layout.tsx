import { verifySession } from '@/src/auth/dal';
import AdminSidebar from "@/components/admin/AdminSidebar";
import ToastNotification from "@/components/ui/ToastNotification";
import { redirect } from 'next/navigation';


export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user } = await verifySession();
    if ( user.rol !== 'administrador' ) {
        redirect("/pos");
    }

    return (
        <>
            <div className="flex md:flex-row h-screen">
                <aside className="hidden sm:block">
                    <AdminSidebar user={user} />
                </aside>

                {/* Contenido principal */}
                <main className="flex-1 overflow-y-auto p-1 md:p-2">
                    {children}
                </main>
            </div>
            <ToastNotification />
        </>
    );
}
