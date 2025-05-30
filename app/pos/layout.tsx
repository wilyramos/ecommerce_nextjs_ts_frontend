import { verifySession } from '@/src/auth/dal';
import ToastNotification from "@/components/ui/ToastNotification";
import SidebarPOS from "@/components/POS/SidebarPOS";

export default async function POSlayout({ children }: { children: React.ReactNode }) {
    const { user } = await verifySession();

    return (
        <div className="flex h-screen bg-gray-100">
            <SidebarPOS user={user} />


            <main className="flex-grow overflow-y-auto px-6 py-4">
                {children}
            </main>

            <ToastNotification />
        </div>
    );
}
