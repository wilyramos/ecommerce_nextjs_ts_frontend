// actions/checkout/create-payment-izipay.ts

export interface IzipayPaymentPayload {
    amount: number;
    currency: string;
    orderId: string;
    customer: {
        email: string;
        reference: string;
    };
}

export async function createPaymentIzipay(payload: IzipayPaymentPayload) {

    try {
        const url = `https://api.micuentaweb.pe/izipay/create-payment`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al crear el pago en Izipay");
        }

        return data; // Debe devolver { formToken: string }


    } catch (error) {
        console.error("Error al crear el pago en Izipay:", error);
        throw new Error("Error al crear el pago en Izipay");
    }



}
