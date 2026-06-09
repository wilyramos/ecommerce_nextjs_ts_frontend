import { verifySession } from '@/src/auth/dal';
import { AdminSidebar, MobileSidebar } from "@/components/admin/AdminSidebar";
import ToastNotification from "@/components/ui/ToastNotification";
import { redirect } from 'next/navigation';
import Logo from '@/components/ui/Logo';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user } = await verifySession();
    if (user.rol !== 'administrador') redirect("/profile");

    return (
        <>
            {/* MOBILE TOPBAR */}
            <div className="md:hidden fixed top-0 inset-x-0 z-40 h-12 border-b bg-background flex items-center px-3 gap-3">
                <MobileSidebar user={user} />
                <div className="flex-1 flex justify-center">
                    <Logo />
                </div>
                <div className="w-9" /> {/* balance */}
            </div>

            {/* DESKTOP LAYOUT */}
            <div className="hidden md:flex h-screen overflow-hidden">
                <div className="border-r shrink-0">
                    <AdminSidebar user={user} />
                </div>
                <main className="flex-1 overflow-y-auto">{children}</main>
            </div>

            {/* MOBILE CONTENT */}
            <div className="md:hidden pt-12">
                {children}
            </div>

            <ToastNotification />
        </>
    );
}