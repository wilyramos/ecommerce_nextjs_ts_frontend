"use server";

import getToken from "@/src/auth/token";
import { createBrandSchema } from "@/src/schemas/brands";
import { ErrorResponse } from "@/src/schemas";
import { revalidatePath } from "next/cache";

export type ActionStateType = { errors: string[]; success: string };

export async function createBrandAction(
    prev: ActionStateType,
    formData: FormData
): Promise<ActionStateType> {
    const token = await getToken();

    const brandData = {
        nombre: formData.get("nombre") as string,
        descripcion: formData.get("descripcion") as string,
        logo: formData.get("logo") ? (formData.get("logo") as string) : undefined
    };
    console.log("brandData", brandData);

    const parsed = createBrandSchema.safeParse(brandData);

    console.log("Parsed brandData:", parsed);
    if (!parsed.success) {
        return {
            errors: parsed.error.errors.map(e => e.message),
            success: "",
        };
    }

    try {
        const res = await fetch(`${process.env.API_URL}/brands`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(parsed.data),
        });

        const json = await res.json();
        if (!res.ok) {
            const err = ErrorResponse.parse(json);
            return { errors: [err.message || "Error al crear"], success: "" };
        }

        revalidatePath("/admin/brands");

        return { errors: [], success: "Marca creada correctamente" };
    } catch (error) {
        console.error("Error al crear marca:", error);
        return { errors: ["Error interno al crear la marca"], success: "" };
    }
}
