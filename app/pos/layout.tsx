import { verifySession } from "@/src/auth/dal";
import { redirect } from "next/navigation";
import ToastNotification from "@/components/ui/ToastNotification";
import Logo from "@/components/ui/Logo";
import MobileSidebarPOS from "@/components/POS/MobileSidebarPOS";
import SidebarPOS from "@/components/POS/SidebarPOS";

export default async function POSlayout({ children }: { children: React.ReactNode }) {
    const { user } = await verifySession();
    if (user.rol !== "administrador" && user.rol !== "vendedor") redirect("/profile");

    return (
        <>
            <div className="md:hidden px-2 border-b flex items-center justify-between bg-white">
                <div className="flex items-center">
                    <MobileSidebarPOS user={user} />
                </div>

                <div className="flex-1 flex justify-center">
                    <Logo />
                </div>

                <div className="w-6" />
            </div>


            {/* DESKTOP LAYOUT */}
            <div className="hidden md:grid h-screen grid-cols-[auto_1fr] overflow-hidden">
                <SidebarPOS user={user} />
                <main className="overflow-auto p-4">{children}</main>
            </div>

            {/* MOBILE CONTENT */}
            <div className="md:hidden p-4">{children}</div>

            <ToastNotification />
        </>
    );
}
