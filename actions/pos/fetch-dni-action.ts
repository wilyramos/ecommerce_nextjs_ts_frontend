"use server"

import { ErrorResponseSchema, CreateSaleSchema } from "@/src/schemas"
import { revalidatePath } from "next/cache"
import getToken from "@/src/auth/token"
import { verifySession } from '@/src/auth/dal';
import { DniSchema } from "@/src/schemas"


// Define the type for the action state
type ActionStateType = {
    errors: string[],
    success: string
}


export async function fetchDniAction(prevState: ActionStateType, formData: FormData) {

    const dni = formData.get("dni")

    // parsear

    const dniParsed = DniSchema.safeParse({ dni })
    if (!dniParsed.success) {
        return {
            errors: dniParsed.error.errors.map((error) => error.message),
            success: ""
        }
    }

    await new Promise((resolve) => setTimeout(resolve, 500))


    return {
        errors: [],
        success: `DNI registrado correctamente: ${dni}`,
    }
}