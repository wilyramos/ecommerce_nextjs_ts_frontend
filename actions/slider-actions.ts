// File: frontend/src/actions/slider-actions.ts
"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import {
    SliderBannerSchema,
    type SliderBannerFormValues,
    type SliderBanner,
    type SliderPrice,    // ← agregar
    type SliderDesign,   // ← agregar
} from "@/src/schemas/slider.schema";
import getToken from "@/src/auth/token";

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const ADMIN_BANNERS_PATH = "/admin/slider";
const BASE_URL = `${process.env.API_URL}/slider-banners`;

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type ReorderItem = { id: string; order: number };

export type ActionSuccess<T> = {
    success: true;
    data: T;
    message?: string;
};

export type ActionFailure = {
    success: false;
    message: string;
    errors?: string[];
    fieldErrors?: Record<string, string[]>;
    fields?: Record<string, string>;
};

export type ActionState<T = null> = ActionSuccess<T> | ActionFailure;

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

async function getAuthHeaders(): Promise<HeadersInit> {
    const token = await getToken();
    if (!token) throw new Error("Sesión expirada o inválida.");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return "Error inesperado.";
}

function formString(formData: FormData, key: string): string | undefined {
    const val = formData.get(key);
    if (val === null) return undefined;
    return typeof val === "string" ? val.trim() : undefined;
}

function formNumber(formData: FormData, key: string): number | undefined {
    const val = formData.get(key);
    if (!val) return undefined;
    const n = Number(val);
    return Number.isFinite(n) ? n : undefined;
}

function formBool(formData: FormData, key: string): boolean {
    return formData.get(key) === "true";
}

/**
 * Mapea FormData a la estructura tipada de SliderBannerFormValues.
 * Todos los campos opcionales se omiten si están vacíos,
 * alineado exactamente con el modelo del backend.
 */
function mapFormDataToBanner(formData: FormData): SliderBannerFormValues {
    const contentType = (formData.get("contentType") as SliderBannerFormValues["contentType"]) ?? "product";
    const referenceId = formString(formData, "referenceId");

    // ── Price ──────────────────────────────────────────────
    // ── Price ──────────────────────────────────────────────
    const priceCurrent = formNumber(formData, "price.current");
    const price: SliderPrice | undefined = priceCurrent !== undefined
        ? {
            current: priceCurrent,
            compare: formNumber(formData, "price.compare"),
            label: formString(formData, "price.label"),
            suffix: formString(formData, "price.suffix"),
            note: formString(formData, "price.note"),
            currency: formString(formData, "price.currency") ?? "S/",
            border: (formString(formData, "price.border") as SliderPrice["border"]) ?? "none",
        }
        : undefined;

    // ── Media ──────────────────────────────────────────────
    const media: SliderBannerFormValues["media"] = {
        imageUrl: formData.get("media.imageUrl") as string,
        videoUrl: formString(formData, "media.videoUrl"),
        videoPoster: formString(formData, "media.videoPoster"),
        altText: formString(formData, "media.altText") ?? (formString(formData, "title") ?? ""),
        objectFit: (formString(formData, "media.objectFit") as SliderBannerFormValues["media"]["objectFit"]) ?? "cover",
        border: (formString(formData, "media.border") as SliderBannerFormValues["media"]["border"]) ?? "none",
    };

    // ── Design ─────────────────────────────────────────────
    // ── Design ─────────────────────────────────────────────
    type ContentDistribution = NonNullable<SliderDesign["contentDistribution"]>;

    const leftSide = formData.getAll("design.leftSide") as ContentDistribution["leftSide"];
    const rightSide = formData.getAll("design.rightSide") as ContentDistribution["rightSide"];

    const design: SliderDesign = {
        layout: (formString(formData, "design.layout") as SliderDesign["layout"]) ?? "default",
        theme: (formString(formData, "design.theme") as SliderDesign["theme"]) ?? "dark",
        bgColor: formString(formData, "design.bgColor"),
        accentColor: formString(formData, "design.accentColor"),
        textColor: formString(formData, "design.textColor"),
        textMutedColor: formString(formData, "design.textMutedColor"),
        contentDistribution: leftSide.length > 0 || rightSide.length > 0
            ? { leftSide, rightSide }
            : undefined,
    };

    // ── Countdown ──────────────────────────────────────────
    const countdownEndsAt = formString(formData, "countdown.endsAt");
    const countdown: SliderBannerFormValues["countdown"] = countdownEndsAt
        ? {
            endsAt: new Date(countdownEndsAt),
            label: formString(formData, "countdown.label"),
            showDays: formBool(formData, "countdown.showDays"),
        }
        : undefined;

    // ── Schedule ───────────────────────────────────────────
    const scheduleStartsAt = formString(formData, "schedule.startsAt");
    const scheduleEndsAt = formString(formData, "schedule.endsAt");
    const schedule: SliderBannerFormValues["schedule"] = scheduleStartsAt || scheduleEndsAt
        ? {
            startsAt: scheduleStartsAt ? new Date(scheduleStartsAt) : undefined,
            endsAt: scheduleEndsAt ? new Date(scheduleEndsAt) : undefined,
        }
        : undefined;

    return {
        contentType,
        product: contentType === "product" ? referenceId : undefined,
        brand: contentType === "brand" ? referenceId : undefined,
        category: contentType === "category" ? referenceId : undefined,
        title: formString(formData, "title"),
        subtitle: formString(formData, "subtitle"),
        description: formString(formData, "description"),
        destUrl: formData.get("destUrl") as string,
        isActive: formBool(formData, "isActive"),
        price,
        media,
        design,
        countdown,
        schedule,
        order: formNumber(formData, "order"),
    };
}

// ─────────────────────────────────────────────────────────────
// ACTIONS
// ─────────────────────────────────────────────────────────────

export async function createSliderBannerAction(
    _prev: ActionState<SliderBanner>,
    formData: FormData,
): Promise<ActionState<SliderBanner>> {
    const bannerData = mapFormDataToBanner(formData);
    const result = SliderBannerSchema.safeParse(bannerData);

    if (!result.success) {
        const fieldErrors: Record<string, string[]> = {};
        for (const issue of result.error.issues) {
            fieldErrors[issue.path.join(".")] = [issue.message];
        }
        return {
            success: false,
            message: "Error de validación.",
            fieldErrors,
            fields: Object.fromEntries(
                Array.from(formData.entries())
                    .filter(([, v]) => typeof v === "string")
                    .map(([k, v]) => [k, v as string]),
            ),
        };
    }

    try {
        const res = await fetch(BASE_URL, {
            method: "POST",
            headers: await getAuthHeaders(),
            body: JSON.stringify(result.data),
        });
        const body = await res.json() as { data: SliderBanner; message?: string };
        if (!res.ok) throw new Error((body as { message?: string }).message ?? "Error al crear.");

        revalidateTag("banners-active");
        revalidatePath(ADMIN_BANNERS_PATH);
        return { success: true, data: body.data, message: "Creado con éxito." };
    } catch (error) {
        return { success: false, message: getErrorMessage(error) };
    }
}

export async function updateSliderBannerAction(
    id: string,
    _prev: ActionState<SliderBanner>,
    formData: FormData,
): Promise<ActionState<SliderBanner>> {
    const bannerData = mapFormDataToBanner(formData);
    const result = SliderBannerSchema.safeParse(bannerData);

    if (!result.success) {
        const fieldErrors: Record<string, string[]> = {};
        for (const issue of result.error.issues) {
            fieldErrors[issue.path.join(".")] = [issue.message];
        }
        return { success: false, message: "Error de validación.", fieldErrors };
    }

    try {
        const res = await fetch(`${BASE_URL}/${id}`, {
            method: "PUT",
            headers: await getAuthHeaders(),
            body: JSON.stringify(result.data),
        });
        const body = await res.json() as { data: SliderBanner; message?: string };
        if (!res.ok) throw new Error((body as { message?: string }).message ?? "Error al actualizar.");

        revalidateTag("banners-active");
        revalidateTag(`banner-${id}`);
        revalidatePath(ADMIN_BANNERS_PATH);
        return { success: true, data: body.data, message: "Actualizado correctamente." };
    } catch (error) {
        return { success: false, message: getErrorMessage(error) };
    }
}

export async function toggleSliderBannerAction(
    id: string,
): Promise<ActionState<SliderBanner>> {
    try {
        const res = await fetch(`${BASE_URL}/${id}/toggle`, {
            method: "PATCH",
            headers: await getAuthHeaders(),
        });
        const body = await res.json() as { data: SliderBanner; message?: string };
        if (!res.ok) throw new Error((body as { message?: string }).message ?? "Error al cambiar estado.");

        revalidateTag("banners-active");
        revalidateTag(`banner-${id}`);
        return { success: true, data: body.data };
    } catch (error) {
        return { success: false, message: getErrorMessage(error) };
    }
}

export async function deleteSliderBannerAction(
    id: string,
): Promise<ActionState> {
    try {
        const res = await fetch(`${BASE_URL}/${id}`, {
            method: "DELETE",
            headers: await getAuthHeaders(),
        });

        if (res.status === 204) {
            revalidateTag("banners-active");
            revalidatePath(ADMIN_BANNERS_PATH);
            return { success: true, data: null };
        }

        const body = await res.json() as { message?: string };
        throw new Error(body.message ?? "No se pudo eliminar.");
    } catch (error) {
        return { success: false, message: getErrorMessage(error) };
    }
}

export async function reorderSliderBannersAction(
    items: ReorderItem[],
): Promise<ActionState> {
    try {
        const res = await fetch(`${BASE_URL}/reorder`, {
            method: "PATCH",
            headers: await getAuthHeaders(),
            body: JSON.stringify({ items }),
        });

        if (!res.ok) {
            const body = await res.json() as { message?: string };
            throw new Error(body.message ?? "Error al reordenar.");
        }

        revalidateTag("banners-active");
        revalidatePath(ADMIN_BANNERS_PATH);
        return { success: true, data: null };
    } catch (error) {
        return { success: false, message: getErrorMessage(error) };
    }
}