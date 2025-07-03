"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// This action handles the login with Google by sending the credential to the backend
// and setting the token in cookies for session management.
// This 


export async function googleLoginAction({ credential, redirectTo }: { credential: string, redirectTo: string }) {
    if (!credential) {
        return {
            error: "No se recibió el token de Google"
        }
    }

    const res = await fetch(`${process.env.API_URL}/auth/google`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ credential  })
    })

    const data = await res.json()

    if (!res.ok) {
        return {
            error: data.message || "Error al iniciar sesión con Google"
        }
    }

    const { token, role } = data;
    (await cookies()).set({
        name: "ecommerce-token",
        value: token,
        path: "/",
        httpOnly: true
    })

    // Redirección basada en rol
    if (role === "administrador") return redirect("/admin")
    if (role === "vendedor") return redirect("/pos")
    redirect(redirectTo)
}
