import "server-only";


import getToken from "../auth/token";
import { apiProductListSchema, productsResponseAllSchema, ApiProductsSchema } from "@/src/schemas";

// new

import { ApiProductWithCategorySchema, productsAPIResponse, productsWithCategoryAPIResponse, productsApiResponseWithFilters } from "@/src/schemas";
import { notFound } from "next/navigation";


export const getProduct = async (id: string) => {
    const token = getToken();
    const url = `${process.env.API_URL}/products/${id}`;

    const req = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const json = await req.json();
    if (!req.ok) {
        return null;
    }

    const product = ApiProductWithCategorySchema.parse(json);
    return product;
};

export const GetProductsBySlug = async (slug: string) => {
    const url = `${process.env.API_URL}/products/slug/${slug}`;

    const req = await fetch(url, {
    });

    if (!req.ok) {
        return notFound();
    }

    const json = await req.json();
    const product = ApiProductWithCategorySchema.parse(json);
    return product;
};

type GetProductsByFilterParams = {
    page: number;
    limit: number;
    category?: string;
    priceRange?: string;
    query?: string;
    sort?: string;
    compatibilidad?: string;
    atributos?: Record<string, string[]>; // Nuevos filtros dinámicos
};

export const getProductsByFilter = async ({
    page,
    limit,
    category = "",
    priceRange = "",
    query = "",
    sort = "",
    atributos = {}
}: GetProductsByFilterParams) => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        category,
        priceRange,
        query,
        sort,
    });

    // Agregar los atributos dinámicos al query string
    for (const [key, value] of Object.entries(atributos)) {
        if (value) {
            // Asegura que sea string[]
            const valuesArray = Array.isArray(value) ? value : [value];
            params.append(`atributos[${key}]`, valuesArray.join(","));
        }
    }


    const url = `${process.env.API_URL}/products/filter?${params.toString()}`;

    const req = await fetch(url, {
        method: "GET",
    });

    if (!req.ok) {
        return null;
    }

    const json = await req.json();
    const products = productsAPIResponse.parse(json);
    return products;
};

export const searchProducts = async ({ query, page, limit }: {
    query: string;
    page?: number;
    limit?: number;
}) => {
    // console.log("seeding")
    const url = `${process.env.API_URL}/products/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
    const req = await fetch(url, {
        method: 'GET'
    });

    if (!req.ok) {
        return null;
    }

    const json = await req.json();
    const products = productsWithCategoryAPIResponse.parse(json);
    return products;
}

type GetProductListParams = {
    q?: string;
};

type GetProductsMainPageParams = {
    page: number;
    limit?: number;
    query?: string;
    category?: string;
    priceRange?: string;
    sort?: string;
    [key: string]: string | number | undefined; // Para atributos dinámicos
};

export const getProductsMainPage = async ({
    page,
    limit,
    query,
    category,
    priceRange,
    sort,
    ...rest // Atributos dinámicos
}: GetProductsMainPageParams) => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit?.toString() || "24",
        query: query || "",
        category: category || "",
        priceRange: priceRange || "",
        sort: sort || "",
        ...rest as Record<string, string> // Asegura que rest sea del tipo correcto
    });

    const url = `${process.env.API_URL}/products/mainpage?${params.toString()}`;
    const req = await fetch(url, {
        method: 'GET',
    });

    if (!req.ok) {
        return null;
    }

    const json = await req.json();
    const products = productsApiResponseWithFilters.parse(json);
    return products;
};

export const getAllProductsSlug = async ({ q }: GetProductListParams) => {
    try {

        const params = new URLSearchParams();
        if (q) params.set("q", q);

        const url = `${process.env.API_URL}/products/list?${params.toString()}`;

        const req = await fetch(url, {
            method: 'GET',
            next: { revalidate: 604800 } // Revalida cada semana
        });

        if (!req.ok) {
            return [];
        }

        const json = await req.json();
        const products = apiProductListSchema.parse(json);
        return products;
    } catch (error) {
        console.error("Error fetching product list:", error);
        return [];
    }
};

export const getNewProducts = async () => {
    const url = `${process.env.API_URL}/products/new?limit=4`;

    const req = await fetch(url, {
        method: 'GET',
        next: { revalidate: 86400 } // Revalida cada dia
    });

    if (!req.ok) {
        return null;
    }

    const json = await req.json();

    const products = productsAPIResponse.parse(json);

    return products;
};

export const getDestacadosProducts = async () => {
    const url = `${process.env.API_URL}/products/destacados/all?limit=4`;

    const req = await fetch(url, {
        method: 'GET',
        next: { revalidate: 86400 }
    });

    if (!req.ok) {
        return null;
    }

    const json = await req.json();
    const products = productsAPIResponse.parse(json);
    return products;
};

export const getFrontPageProducts = async () => {
    const url = `${process.env.API_URL}/products/frontpage/all`;
    const req = await fetch(url, {
        method: 'GET',
        next: { revalidate: 86400 }
    });

    if (!req.ok) {
        return null;
    }

    const json = await req.json();
    const products = productsAPIResponse.parse(json);
    return products;
};

export const getProductsRelated = async (slug: string) => {
    const url = `${process.env.API_URL}/products/${slug}/related`;

    const req = await fetch(url, {
        method: 'GET'
    });

    if (!req.ok) {
        return null;
    }

    const json = await req.json();
    const products = ApiProductsSchema.parse(json);
    return products;

}

type GetProductsByAdminParams = {
    page?: number;
    limit?: number;
    nombre?: string;
    sku?: string;
    precioSort?: "asc" | "desc";
    stockSort?: "asc" | "desc";
    isActive?: string;
    esNuevo?: string;
    esDestacado?: string;
    query?: string;
    category?: string;
    brand?: string;
};

export const getProductsByAdmin = async (filters: GetProductsByAdminParams = {}) => {
    const token = await getToken();
    const paramsObject = Object.fromEntries(
        Object.entries(filters)
            .filter(([, value]) => value !== undefined && value !== "")
            .map(([key, value]) => [key, String(value)])
    );
    const queryString = new URLSearchParams(paramsObject).toString();

    const url = `${process.env.API_URL}/products?${queryString}`;

    const req = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!req.ok) return null;
    const json = await req.json();
    return productsAPIResponse.parse(json);
};


export const GetAllProductsSlug = async () => {
    const url = `${process.env.API_URL}/products/all/slug`;
    const req = await fetch(url, {
        method: 'GET',
    });
    if (!req.ok) {
        return [];
    }

    const json = await req.json();
    const parsed = productsResponseAllSchema.safeParse(json);
    if (!parsed.success) {
        console.error("Error validando productos:", parsed.error);
        return [];
    }
    return parsed.data;
}

export const getProductsByBrandSlug = async (brandSlug: string) => {
    const url = `${process.env.API_URL}/products/brand/${brandSlug}`;
    const req = await fetch(url, {
        method: 'GET',
    });
    if (!req.ok) {
        return null;
    }

    const json = await req.json();
    const products = productsApiResponseWithFilters.parse(json);
    return products;
}