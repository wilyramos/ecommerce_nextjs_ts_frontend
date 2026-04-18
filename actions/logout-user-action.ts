//File: frontend/actions/logout-user-action.ts

"use server"


import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function logout() {
    // Eliminar la cookie
    (await cookies()).delete("ecommerce-token")
    redirect("/auth/login")
}