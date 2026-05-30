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

// ─── Por ID ───────────────────────────────────────────────────────────────────

export const getCategory = cache(async (id: string): Promise<CategoryResponse> => {
    const res = await fetch(`${BASE}/${id}`, {
        next: { tags: ["categories", `category-${id}`] },
    });

    if (!res.ok) notFound();

    return apiCategorySchema.parse(await res.json());
});

// ─── Por slug ─────────────────────────────────────────────────────────────────

export const getCategoryBySlug = cache(async (slug: string): Promise<CategoryResponse> => {
    const res = await fetch(`${BASE}/slug/${slug}`, {
        next: { tags: ["categories", `category-slug-${slug}`] },
    });

    if (!res.ok) notFound();

    return apiCategorySchema.parse(await res.json());
});

// ─── Todas ────────────────────────────────────────────────────────────────────

export const getCategories = cache(async (): Promise<CategoryListResponse> => {
    const res = await fetch(BASE, {
        next: { tags: ["categories"] },
    });

    if (!res.ok) notFound();

    return apiCategoryListSchema.parse(await res.json());
});

// ─── Categorías raíz (antes "patterns") ──────────────────────────────────────
// Endpoint actualizado: GET /category/roots

export const getRootCategories = cache(async (): Promise<CategoryListResponse> => {
    const res = await fetch(`${BASE}/roots`, {
        next: { tags: ["categories", "root-categories"] },
    });

    if (!res.ok) notFound();

    return apiCategoryListSchema.parse(await res.json());
});

// ─── Todas las subcategorías pobladas ────────────────────────────────────────
// Endpoint actualizado: GET /category/subcategories

export const getAllSubcategories = cache(async (): Promise<CategoryListResponse> => {
    const res = await fetch(`${BASE}/subcategories`, {
        next: { tags: ["categories", "subcategories"] },
    });

    if (!res.ok) notFound();

    return apiCategoryListSchema.parse(await res.json());
});

// ─── Subcategorías de una categoría específica ───────────────────────────────
// Endpoint nuevo: GET /category/:id/subcategories

export const getSubcategoriesById = cache(async (id: string): Promise<CategoryListResponse> => {
    const res = await fetch(`${BASE}/${id}/subcategories`, {
        next: { tags: ["categories", `subcategories-${id}`] },
    });

    if (!res.ok) notFound();

    return apiCategoryListSchema.parse(await res.json());
});