// frontend/src/services/brands.ts
import "server-only";
import { cache } from "react";
import getToken from "../auth/token";

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
    const token = await getToken();
    const res = await fetch(`${process.env.API_URL}/brands`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });
    if (!res.ok) {
        return [];
    }
    return res.json();
});

export const getActiveBrands = cache(async (): Promise<Brand[]> => {
    const token = await getToken();
    const res = await fetch(`${process.env.API_URL}/brands/active`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });
    if (!res.ok) {
        return [];
    }
    return res.json();
});
