"use server"


type ActionStateType = {
    errors: string[],
    success: string
}

export async function resetPassword(token: string, prevState: ActionStateType) {
    console.log("Resetting password")



    return {
        errors: [],
        success: "Password reset successful"
    }


}