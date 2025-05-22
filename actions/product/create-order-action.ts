"use server";


type ActionStateType = {
    errors: string[],
    success: string
}


export async function createOrderAction(total: number, prevState: ActionStateType, formData: FormData) {

    console.log("total", total)
    console.log("formData", formData)

    return {
        errors: [],
        success: "Orden creada con éxito"
    }

}
