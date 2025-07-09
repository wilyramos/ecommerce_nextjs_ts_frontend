import { cache } from 'react';
import { CategoryAPIResponse, CategoriesAPIResponse } from "@/src/schemas";
import { notFound } from 'next/navigation';


export const getCategory = cache(async (id: string) => {

    const url = `${process.env.API_URL}/category/${id}`;

    const req = await fetch(url, {
        method: 'GET',
    });

    const json = await req.json();
    if (!req.ok) {
        notFound();
    }

    const category = CategoryAPIResponse.parse(json);
    console.log("categoryy", category);
    return category;
});

export const getCategoryBySlug = cache(async (slug: string) => {
    try {
        const url = `${process.env.API_URL}/category/slug/${slug}`;
        const res = await fetch(url, {
            method: "GET",
        });

        if (!res.ok) {
            notFound();
        }

        const json = await res.json();
        const category = CategoryAPIResponse.parse(json);
        return category;
        
    } catch (error) {
        console.error("Error al obtener la categoría por slug:", error);
        return null;
    }
});

export const getCategories = cache(async () => {
    const url = `${process.env.API_URL}/category`;
    const res = await fetch(url, {
        method: "GET",
    });
    if (!res.ok) {
        notFound();
    }

    const json = await res.json();
    const categories = CategoriesAPIResponse.parse(json);
    return categories;
});


export const getAllSubcategories = cache(async () => {
    const url = `${process.env.API_URL}/category/all/subcategories`;
    const res = await fetch(url, {
        method: "GET",
    });
    if (!res.ok) {
        notFound();
    }

    const json = await res.json();
    const categories = CategoriesAPIResponse.parse(json);
    return categories;
});