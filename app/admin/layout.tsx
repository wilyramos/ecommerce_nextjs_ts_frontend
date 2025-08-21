import { verifySession } from '@/src/auth/dal';
import AdminSidebar from "@/components/admin/AdminSidebar";
import ToastNotification from "@/components/ui/ToastNotification";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user } = await verifySession();
    return (
        <>
            <div className="flex md:flex-row h-screen">
                <aside className="">
                    <AdminSidebar user={user} />
                </aside>

                {/* Contenido principal */}
                <main className="flex-1 overflow-y-auto p-2 md:p-4">
                    {children}
                </main>
            </div>
            <ToastNotification />
        </>
    );
}
