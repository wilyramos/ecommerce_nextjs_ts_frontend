import { verifySession } from '@/src/auth/dal';
import AdminSidebar from "@/components/admin/AdminSidebar";
import ToastNotification from "@/components/ui/ToastNotification";
import AdminSidebarMobil from "@/components/admin/AdminSidebarMobil";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user } = await verifySession();
    return (
        <>
            <div className="flex h-screen">
                <div className="hidden md:block border-r">
                    <AdminSidebar user={user} />
                </div>
                <div className="block md:hidden w-full border-b border-gray-200">
                    <AdminSidebarMobil user={user} />
                </div>
                <main className="flex-grow overflow-y-auto px-6 py-4">
                    {children}
                </main>
            </div>
            <ToastNotification />
        </>
    )
}
