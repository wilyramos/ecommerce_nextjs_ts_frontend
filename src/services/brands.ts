// File: frontend/src/services/brands.ts

import "server-only";
import { cache } from "react";
import { type Brand } from "@/src/schemas/brand.schema";

export const getBrands = cache(async (): Promise<Brand[]> => {
    const res = await fetch(`${process.env.API_URL}/brands`);
    if (!res.ok) {
        return [];
    }
    return res.json();
});

export const getActiveBrands = cache(async (): Promise<Brand[]> => {
    const res = await fetch(`${process.env.API_URL}/brands/active`);
    if (!res.ok) {
        return [];
    }
    return res.json();
});

export const getBrandBySlug = async (slug: string): Promise<Brand | null> => {
    const url = `${process.env.API_URL}/brands/slug/${slug}`;
    const res = await fetch(url);

    console.log('Fetching brand by slug:', slug, 'Response status:', res.status);
    if (!res.ok) {
        return null;
    }
    return res.json();
};