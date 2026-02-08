"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { LineFormValues, ActionState } from "@/src/schemas/line.schema"; // Importamos ActionState del schema

const API_URL = process.env.API_URL;

// --- HELPER: Fetch Privado Server-to-Server ---
async function fetchServer(endpoint: string, options: RequestInit = {}) {
    const cookieStore = await cookies();
    const token = cookieStore.get("ecommerce-token")?.value;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}/${endpoint}`, {
        ...options,
        headers,
    });

    let data;
    try {
        data = await res.json();
    } catch {
        data = null;
    }

    if (!res.ok) {
        throw new Error(data?.message || `Error ${res.status}: ${res.statusText}`);
    }

    return data?.data || data;
}

// --- ACTIONS (Solo funciones async exportadas) ---

export async function createLineAction(prevState: ActionState, data: LineFormValues): Promise<ActionState> {
    try {
        const cleanData = {
            ...data,
            slug: data.slug === "" ? undefined : data.slug,
            category: data.category === "" ? undefined : data.category,
        };

        await fetchServer("lines", {
            method: "POST",
            body: JSON.stringify(cleanData),
        });

        revalidatePath("/admin/lines");
        return { success: true, message: "Línea creada correctamente", timestamp: Date.now() };
    } catch (error) {
        return { success: false, message: (error as Error).message, timestamp: Date.now() };
    }
}

export async function updateLineAction(prevState: ActionState, payload: { id: string; data: LineFormValues }): Promise<ActionState> {
    try {
        const { id, data } = payload;

        const cleanData = {
            ...data,
            slug: data.slug === "" ? undefined : data.slug,
            category: data.category === "" ? undefined : data.category,
        };

        await fetchServer(`lines/${id}`, {
            method: "PUT",
            body: JSON.stringify(cleanData),
        });

        revalidatePath("/admin/lines");
        return { success: true, message: "Línea actualizada correctamente", timestamp: Date.now() };
    } catch (error) {
        return { success: false, message: (error as Error).message, timestamp: Date.now() };
    }
}

export async function deleteLineAction(prevState: ActionState, id: string): Promise<ActionState> {
    try {
        await fetchServer(`lines/${id}`, {
            method: "DELETE",
        });

        revalidatePath("/admin/lines");
        return { success: true, message: "Línea eliminada correctamente", timestamp: Date.now() };
    } catch (error) {
        return { success: false, message: (error as Error).message, timestamp: Date.now() };
    }
}