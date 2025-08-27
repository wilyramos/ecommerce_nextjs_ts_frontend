"use server";

import getToken from "@/src/auth/token";
import { createPurchaseSchema, type TPurchaseItemInput } from "@/src/schemas";

type ActionStateType = {
    errors: string[];
    success: string;
};

export async function createPurchaseAction(
    prevState: ActionStateType,
    formData: FormData
) {
    // Paso 1: leer formData
    const rawItems = formData.get("items") as string;

    let items: TPurchaseItemInput[] = [];
    try {
        const parsedItems = JSON.parse(rawItems);
        items = parsedItems.map((item: any) => ({
            productId: item.productId,
            quantity: Number(item.cantidad),
            priceUnit: Number(item.costo),
            totalPrice: Number(item.total),
        }));
    } catch (error) {
        return {
            errors: ["Formato de datos inválido en los items"],
            success: "",
        };
    }

    // Paso 2: construir el objeto final
    const purchaseData = {
        proveedor: formData.get("supplier") as string,
        items,
        total: Number(formData.get("total")),
    };

    // Paso 3: validar con Zod
    const parsedData = createPurchaseSchema.safeParse(purchaseData);
    console.log("🔍 Datos a validar:", purchaseData);
    console.log("🔍 Resultado de validación:", parsedData);
    console.log("errrorrs", parsedData.error)

    if (!parsedData.success) {
        return {
            errors: parsedData.error.issues.map((issue) => issue.message),
            success: "",
        };
    }

    console.log("✅ Datos validados:", parsedData.data);
    const token = await getToken()
    const url = `${process.env.API_URL}/purchases`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(parsedData.data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.log("Error creating purchase:", errorData);
        return {
            errors: [errorData.message || "Error creating purchase"],
            success: "",
        };
    }


    console.log("Compra creada exitosamente");


    // Aquí harías el fetch con token
    // const token = await getToken();
    // await fetch(url, { ... });

    return {
        errors: [],
        success: "Compra creada exitosamente",
    };
}
