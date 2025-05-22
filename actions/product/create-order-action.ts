"use server";


type ActionStateType = {
    errors: string[],
    success: string
}

type OrderInputType = {
    deliveryInfo: {
        nombre: string;
        direccion: string;
        telefono: string;
        correo: string;
    };
    cart: any[];
    total: number;
    payment: {
        cardNumber: string;
        expiryDate: string;
    };
};


export async function createOrderAction(order: OrderInputType, prevState: ActionStateType, formData: FormData) {

    console.log("order", order)
    console.log("formData", formData)

    return {
        errors: [],
        success: "Orden creada con éxito"
    }
}
