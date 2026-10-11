// File: frontend/app/auth/layout.tsx

import ToastNotification from "@/components/ui/ToastNotification"
import React from "react"
import { redirect } from "next/navigation"
import { getSession } from "@/src/auth/dal"

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
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
                <div className="w-full max-w-sm  p-2 sm:p-8 space-y-6">
                    {children}
                </div>
            </div>
            <ToastNotification />
        </>
    )
}