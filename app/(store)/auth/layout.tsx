import ToastNotification from "@/components/ui/ToastNotification"
import React from "react"
import { redirect } from "next/navigation"
import { getSession } from "@/src/auth/dal"

export default async function LayoutAuth({ children }: { children: React.ReactNode }) {
    const session = await getSession()

    if (session) {
        if (session.user.rol === "administrador") {
            redirect("/admin")
        }
        redirect("/profile")
    }

    return (
        <>
            <div className="flex min-h-[calc(100vh-180px)] w-full items-center justify-center px-4 py-12">
                <div className="w-full max-w-sm rounded-radius-xl border border-border-primary bg-surface-primary p-6 shadow-sm sm:p-8">
                    {children}
                </div>
            </div>
            <ToastNotification />
        </>
    )
}