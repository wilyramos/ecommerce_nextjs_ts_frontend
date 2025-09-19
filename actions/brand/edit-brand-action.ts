// File: frontend/actions/brand/create-brand-action.ts
"use server";

import getToken from "@/src/auth/token";
import { ErrorResponse } from "@/src/schemas";
import { updateBrandSchema } from "@/src/schemas/brands";
import { revalidatePath } from "next/cache";

export type ActionStateType = { errors: string[]; success: string };

export async function editBrandAction(
    id: string,
    _prev: ActionStateType,
    formData: FormData
): Promise<ActionStateType> {
    try {
        const token = await getToken();

        const parsed = updateBrandSchema.safeParse({
            nombre: formData.get("nombre"),
            descripcion: formData.get("descripcion"),
            logo: formData.get("logo") ? (formData.get("logo") as string) : undefined

        });
        if (!parsed.success) {
            return { errors: parsed.error.errors.map(e => e.message), success: "" };
        }

        const res = await fetch(`${process.env.API_URL}/brands/${id}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(parsed.data),
        });

        if (!res.ok) {
            const { message } = ErrorResponse.parse(await res.json());
            return { errors: [message || "Error al editar"], success: "" };
        }
        revalidatePath("/admin/brands");

        return { errors: [], success: "Marca actualizada correctamente" };
    } catch {
        return { errors: ["Error interno al actualizar la marca"], success: "" };
    }
}
