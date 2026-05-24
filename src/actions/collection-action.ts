// File: frontend/src/actions/collection-action.ts

"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { collectionService } from "../services/collection-service";
import {
    createCollectionPayloadSchema,
    updateCollectionPayloadSchema,
    Collection,
    CollectionType,
} from "../schemas/collection.schema";
import { ZodError } from "zod";

interface ActionResponse<T = undefined> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

const getErrorMessage = (error: unknown): string => {
    if (error instanceof ZodError) return error.errors.map(e => e.message).join(", ");
    if (error instanceof Error) return error.message;
    return "Error desconocido";
};

function processCollectionFormData(formData: FormData) {
    const rawData = Object.fromEntries(formData.entries());

    // Función auxiliar interna para procesar cada fecha de forma segura
    const parseToISO = (value: unknown): string | undefined => {
        if (!value || typeof value !== "string" || value.trim() === "") {
            return undefined;
        }
        const date = new Date(value);
        return isNaN(date.getTime()) ? undefined : date.toISOString();
    };

    return {
        ...rawData,
        order: rawData.order ? Number(rawData.order) : undefined,
        isActive: formData.has("isActive"),
        startsAt: parseToISO(rawData.startsAt),
        endsAt: parseToISO(rawData.endsAt),
    };
}

function revalidatePromotion(type?: CollectionType | string) {
    if (type === "promotion") revalidateTag("promotions-active");
}

export async function createCollectionAction(
    prevState: ActionResponse<Collection> | null,
    formData: FormData
): Promise<ActionResponse<Collection>> {
    try {
        const processedData = processCollectionFormData(formData);
        const validatedFields = createCollectionPayloadSchema.parse(processedData);
        const newCollection = await collectionService.create(validatedFields);

        revalidatePath("/admin/collections");
        revalidateTag("collections-list");
        revalidatePromotion(validatedFields.type);

        return { success: true, data: newCollection, message: "Colección creada con éxito" };
    } catch (error) {
        return { success: false, error: getErrorMessage(error) };
    }
}

export async function updateCollectionAction(
    id: string,
    prevState: ActionResponse<Collection> | null,
    formData: FormData
): Promise<ActionResponse<Collection>> {
    try {
        const processedData = processCollectionFormData(formData);
        const validatedFields = updateCollectionPayloadSchema.parse(processedData);
        const updatedCollection = await collectionService.update(id, validatedFields);

        revalidatePath("/admin/collections");
        revalidatePath(`/admin/collections/${updatedCollection.slug}`);
        revalidateTag(`collection-${updatedCollection.slug}`);
        revalidateTag("collections-list");
        revalidatePromotion(updatedCollection.type);

        return { success: true, data: updatedCollection, message: "Colección actualizada con éxito" };
    } catch (error) {
        return { success: false, error: getErrorMessage(error) };
    }
}

export async function deleteCollectionAction(
    id: string,
    slug: string,
    type?: CollectionType
): Promise<ActionResponse> {
    try {
        await collectionService.delete(id);

        revalidatePath("/admin/collections");
        revalidateTag(`collection-${slug}`);
        revalidateTag("collections-list");
        revalidatePromotion(type);

        return { success: true, message: "Colección eliminada correctamente" };
    } catch (error) {
        return { success: false, error: getErrorMessage(error) };
    }
}

export async function addProductsToCollectionAction(
    id: string,
    slug: string,
    productIds: string[]
): Promise<ActionResponse> {
    try {
        await collectionService.addProducts(id, productIds);

        revalidateTag(`collection-${slug}`);
        revalidatePath(`/admin/collections/${slug}`);

        return { success: true, message: "Productos vinculados con éxito" };
    } catch (error) {
        return { success: false, error: getErrorMessage(error) };
    }
}

export async function removeProductFromCollectionAction(
    id: string,
    slug: string,
    productId: string
): Promise<ActionResponse> {
    try {
        await collectionService.removeProduct(id, productId);

        revalidateTag(`collection-${slug}`);
        revalidatePath(`/admin/collections/${slug}`);

        return { success: true, message: "Producto desvinculado con éxito" };
    } catch (error) {
        return { success: false, error: getErrorMessage(error) };
    }
}