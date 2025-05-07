"use server"



type ActionStateType = {
    errors: string[],
    success: string
}

export async function validateToken(token: string, prevState: ActionStateType) {
    console.log("Validando token")


    return {
        errors: [],
        success: "Token valido"
    }
}