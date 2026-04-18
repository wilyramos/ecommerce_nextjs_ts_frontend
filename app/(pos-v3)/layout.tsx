/* File: frontend/app/(pos-v3)/layout.tsx 
    @Author: whramos 
    @Description: Global shell for POS v3 with RBAC and session protection.
*/

import { redirect } from "next/navigation";
import { verifySession } from "@/src/auth/dal";
import { Sidebar } from "@/src/components/shared/Sidebar";
import { Header } from "@/src/components/shared/Header";

export default async function PosV3Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = await verifySession();

    if (!user?.nombre || !user?.rol ) {
        redirect("/auth/login");
    }

    const allowedRoles = ["administrador", "vendedor"];
    if (!allowedRoles.includes(user.rol)) {
        redirect("/auth/login");
    }

    return (
        <div className="flex h-screen w-full overflow-hidden ">
            {/* Sidebar fijo (Navegación) */}
            <Sidebar user={user} />

            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Header (Contexto y Estado de Usuario) */}
                <Header user={user} />

                <main className="relative flex-1 overflow-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}