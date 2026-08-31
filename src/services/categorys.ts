// File: frontend/src/services/categorys.ts

import "server-only";

import { cache } from "react";
import { notFound } from "next/navigation";
import {
    apiCategorySchema,
    apiCategoryListSchema,
    type CategoryResponse,
    type CategoryListResponse,
} from "@/src/schemas/category.schema";

const BASE = `${process.env.API_URL}/category`;

function logZodValidation(fnName: string, rawData: unknown, schema: typeof apiCategorySchema | typeof apiCategoryListSchema) {
    const result = schema.safeParse(rawData);
    if (!result.success) {
        console.error(`\n❌ [ZodError in ${fnName}]`);
        console.error("Path & Message:", JSON.stringify(result.error.issues, null, 2));

        if (Array.isArray(rawData)) {
            result.error.issues.forEach((issue) => {
                const index = issue.path[0];
                if (typeof index === "number" && rawData[index]) {
                    console.error(`\n🔎 [Detalle Elemento índice ${index}]:`, {
                        id: rawData[index]._id ?? rawData[index].id,
                        name: rawData[index].name,
                        slug: rawData[index].slug,
                        attributes: JSON.stringify(rawData[index].attributes, null, 2),
                    });
                }
            });
        } else if (rawData && typeof rawData === "object") {
            console.error("\n🔎 [Payload completo recibido]:", JSON.stringify(rawData, null, 2));
        }
        throw result.error;
    }
    return result.data;
}

// ─── Por ID ───────────────────────────────────────────────────────────────────

export const getCategory = cache(async (id: string): Promise<CategoryResponse> => {
    const res = await fetch(`${BASE}/${id}`, {
        next: { tags: ["categories", `category-${id}`] },
    });

    if (!res.ok) notFound();

    const data = await res.json();
    return logZodValidation(`getCategory(${id})`, data, apiCategorySchema) as CategoryResponse;
});

// ─── Por slug ─────────────────────────────────────────────────────────────────

export const getCategoryBySlug = cache(async (slug: string): Promise<CategoryResponse> => {
    const res = await fetch(`${BASE}/slug/${slug}`, {
        next: { tags: ["categories", `category-slug-${slug}`] },
    });

    if (!res.ok) notFound();

    const data = await res.json();
    return logZodValidation(`getCategoryBySlug(${slug})`, data, apiCategorySchema) as CategoryResponse;
});

// ─── Todas ────────────────────────────────────────────────────────────────────

export const getCategories = cache(async (): Promise<CategoryListResponse> => {
    const res = await fetch(BASE, {
        next: { tags: ["categories"] },
    });

    if (!res.ok) notFound();

    const data = await res.json();
    return logZodValidation("getCategories", data, apiCategoryListSchema) as CategoryListResponse;
});

// ─── Categorías raíz (antes "patterns") ──────────────────────────────────────

export const getRootCategories = cache(async (): Promise<CategoryListResponse> => {
    const res = await fetch(`${BASE}/roots`, {
        next: { tags: ["categories", "root-categories"] },
    });

    if (!res.ok) notFound();

    const data = await res.json();
    return logZodValidation("getRootCategories", data, apiCategoryListSchema) as CategoryListResponse;
});

// ─── Todas las subcategorías pobladas ────────────────────────────────────────

export const getAllSubcategories = cache(async (): Promise<CategoryListResponse> => {
    const res = await fetch(`${BASE}/subcategories`, {
        next: { tags: ["categories", "subcategories"] },
    });

    if (!res.ok) notFound();

    const data = await res.json();
    return logZodValidation("getAllSubcategories", data, apiCategoryListSchema) as CategoryListResponse;
});

// ─── Subcategorías de una categoría específica ───────────────────────────────

export const getSubcategoriesById = cache(async (id: string): Promise<CategoryListResponse> => {
    const res = await fetch(`${BASE}/${id}/subcategories`, {
        next: { tags: ["categories", `subcategories-${id}`] },
    });

    if (!res.ok) notFound();

    const data = await res.json();
    return logZodValidation(`getSubcategoriesById(${id})`, data, apiCategoryListSchema) as CategoryListResponse;
});