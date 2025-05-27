import { verifySession } from '@/src/auth/dal';
import AdminSidebar from "@/components/admin/AdminSidebar";
import ToastNotification from "@/components/ui/ToastNotification";
import AdminSidebarMobil from "@/components/admin/AdminSidebarMobil";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user } = await verifySession();
    return (
        <>
            <div className="flex flex-col md:flex-row min-h-screen">
                <div className="hidden md:block border-r border-gray-200">
                    <AdminSidebar user={user} />
                </div>
                <div className="block md:hidden w-full border-b border-gray-200">
                    <AdminSidebarMobil user={user} />
                </div>
                <main className="flex-grow p-4 bg-gray-50">
                    {children}
                </main>
            </div>
            <ToastNotification />
        </>
    )
}
