import "server-only";

import { cache } from 'react';
import { notFound } from 'next/navigation';
import {
    apiCategorySchema,
    apiCategoryListSchema,
    type CategoryResponse,
    type CategoryListResponse
} from "@/src/schemas/category.schema";

export const getCategory = cache(async (id: string): Promise<CategoryResponse> => {
    const url = `${process.env.API_URL}/category/${id}`;

    const req = await fetch(url, {
        method: 'GET',
        next: { tags: ['categories', `category-${id}`] }
    });

    if (!req.ok) {
        notFound();
    }

    const json = await req.json();
    return apiCategorySchema.parse(json);
});

export const getCategoryBySlug = cache(async (slug: string): Promise<CategoryResponse> => {
    const url = `${process.env.API_URL}/category/slug/${slug}`;

    const req = await fetch(url, {
        method: 'GET',
        next: { tags: ['categories', `category-slug-${slug}`] }
    });

    if (!req.ok) {
        notFound();
    }

    const json = await req.json();
    return apiCategorySchema.parse(json);
});

export const getCategories = cache(async (): Promise<CategoryListResponse> => {
    const url = `${process.env.API_URL}/category`;

    const res = await fetch(url, {
        method: "GET",
        next: { tags: ['categories'] }
    });

    if (!res.ok) {
        notFound();
    }

    const json = await res.json();
    return apiCategoryListSchema.parse(json);
});

export const getPatternCategories = cache(async (): Promise<CategoryListResponse> => {
    const url = `${process.env.API_URL}/category/patterns/all`;

    const res = await fetch(url, {
        method: "GET",
        next: { tags: ['categories', 'pattern-categories'] }
    });

    if (!res.ok) {
        notFound();
    }

    const json = await res.json();
    return apiCategoryListSchema.parse(json);
});

export const getAllSubcategories = cache(async (): Promise<CategoryListResponse> => {
    const url = `${process.env.API_URL}/category/all/subcategories`;

    const res = await fetch(url, {
        method: "GET",
        next: { tags: ['categories', 'subcategories'] }
    });

    if (!res.ok) {
        notFound();
    }

    const json = await res.json();
    return apiCategoryListSchema.parse(json);
});