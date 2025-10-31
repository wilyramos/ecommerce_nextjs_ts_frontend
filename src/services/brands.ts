// frontend/src/services/brands.ts
import "server-only";
import { cache } from "react";

export interface Brand {
    _id: string;
    nombre: string;
    slug: string;
    descripcion?: string;
    logo?: string;
    isActive: boolean;
    createdAt: string;
}

export const getBrands = cache(async (): Promise<Brand[]> => {
    const res = await fetch(`${process.env.API_URL}/brands`, {
        cache: "no-store",
    });
    if (!res.ok) {
        return [];
    }
    return res.json();
});

export const getActiveBrands = cache(async (): Promise<Brand[]> => {
    const res = await fetch(`${process.env.API_URL}/brands/active`, {
        cache: "no-store",
    });
    if (!res.ok) {
        return [];
    }
    return res.json();
});

export const getBrandBySlug = async (slug: string): Promise<Brand | null> => {

    const url = `${process.env.API_URL}/brands/slug/${slug}`;
    const res = await fetch(url, {
        cache: "no-store",
    });

    console.log('Fetching brand by slug:', slug, 'Response status:', res.status);
    if (!res.ok) {
        return null;
    }
    return res.json();
};
