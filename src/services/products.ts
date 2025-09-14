import "server-only";


import getToken from "../auth/token";
import { apiProductListSchema, ProductsAPIResponse, productsSchema, productsResponseAllSchema } from "@/src/schemas";
import { cache } from 'react';

// new

import { ApiProductWithCategorySchema, productsAPIResponse, productsWithCategoryAPIResponse } from "@/src/schemas";
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
    const token = getToken();
    const url = `${process.env.API_URL}/products/slug/${slug}`;

    const req = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        cache: 'no-store' // Ensure fresh data
    });

    if (!req.ok) {
        return notFound();
    }

    const json = await req.json();
    // console.log("jsson", json)
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
        // headers: { Authorization: `Bearer ${token}` },
    });

    if (!req.ok) {
        return null;
    }

    const json = await req.json();
    const products = ProductsAPIResponse.parse(json);
    return products;
};

export const searchProducts = async ({ query, page, limit }: {
    query: string;
    page?: number;
    limit?: number;
}) => {
    console.log("seeding")
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

export const getProductList = async ({ q }: GetProductListParams) => {
    try {
        const token = getToken();

        const params = new URLSearchParams();
        if (q) params.set("q", q);

        const url = `${process.env.API_URL}/products/list?${params.toString()}`;

        const req = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
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

export const getNewProducts = (async () => {
    const url = `${process.env.API_URL}/products/new`;

    const req = await fetch(url, {
        method: 'GET'
    });

    if (!req.ok) {
        return null;
    }

    const json = await req.json();
    const products = ProductsAPIResponse.parse(json);

    // console.log("Nuevos productos", products);
    return products;
});

export const getDestacadosProducts = cache(async () => {
    const url = `${process.env.API_URL}/products/destacados/all`;

    const req = await fetch(url, {
        method: 'GET'
    });

    if (!req.ok) {
        return null;
    }

    const json = await req.json();
    const products = ProductsAPIResponse.parse(json);
    return products;
});


export const getProductsRelated = async (slug: string) => {
    const url = `${process.env.API_URL}/products/${slug}/related`;

    const req = await fetch(url, {
        method: 'GET'
    });

    if (!req.ok) {
        return null;
    }

    const json = await req.json();
    const products = productsSchema.parse(json);
    return products;

}

export const getProductsByAdmin = async (
    { page = 1, limit = 10, query = "" }: { page?: number; limit?: number; query?: string } = {}
) => {
    const token = await getToken();
    const url = `${process.env.API_URL}/products?page=${page}&limit=${limit}&query=${query}`;

    const req = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`

        }
    });

    if (!req.ok) {
        return null;
    }


    const json = await req.json();

    console.log(json);
    const products = productsAPIResponse.parse(json);
    return products;
}


export const GetAllProductsSlug = async () => {
    const token = getToken();
    const url = `${process.env.API_URL}/products/all/slug`;
    const req = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
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
