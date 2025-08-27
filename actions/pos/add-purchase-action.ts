"use server"

import getToken from "@/src/auth/token"



type ActionStateType = {
    errors: string[],
    success: string
}

export async function createPurchaseAction(prevState: ActionStateType, formData: FormData) {


    console.log("formData", formData)
    console.log("prevState", prevState)


    return {
        errors: [],
        success: "Compra creada exitosamente"
    }
}