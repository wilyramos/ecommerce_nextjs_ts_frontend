import AdminMenu from "@/components/admin/AdminMenu";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Logo from "@/components/ui/Logo"
import { verifySession } from '@/src/auth/dal'
import ToastNotification from "@/components/ui/ToastNotification";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {

    const { user } = await verifySession();

    return (
        <>
            <div className="flex flex-col w-full h-screen bg-gray-50 border-r border-gray-200">
                
                <div className="flex flex-row w-full h-full">
                    <AdminSidebar user={user} />
                    <main className="flex-grow p-4 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
            {/* <AdminSidebar user={user}/> */}


            <ToastNotification />


        </>

    )
}