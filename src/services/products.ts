import getToken from "../auth/token"
import { ProductsAPIResponse, ProductSchema } from "@/src/schemas";


export const getProducts = async ({ page = 1, limit = 5 }) => {

    // const token = getToken();
    const url = `${process.env.API_URL}/products?page=${page}&limit=${limit}`;

    const req = await fetch(url, {
        method: 'GET'
    });

    const json = await req.json();
    // console.log("jssson", json);
    if (!req.ok) {
        return null;
    }

    const products = ProductsAPIResponse.parse(json);
    // console.log("son los productos", products);
    return products;
}

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

    const product = ProductSchema.parse(json);
    return product;
}

export const getProductsByFilter = async ({ page, limit, category, priceRange, query, brand, color }: {
    page: number;
    limit: number;
    category: string;
    priceRange: string;
    query?: string;
    brand?: string;
    color?: string;
}) => {
    // const token = getToken();
    const url = `${process.env.API_URL}/products/filter?page=${page}&limit=${limit}&category=${category}&priceRange=${priceRange}&query=${query}&brand=${brand}&color=${color}`;
    // console.log("urlee", url);
    const req = await fetch(url, {
        method: 'GET'
    });
    if (!req.ok) {  
        return null;
    }

    const json = await req.json();

    const products = ProductsAPIResponse.parse(json);
    // console.log("son los productos", products);
    return products;
}

export const searchProducts = async ({ query, page, limit }: {
    query: string;
    page?: number;
    limit?: number;
}) => {
    const url = `${process.env.API_URL}/products/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
    const req = await fetch(url, {
        method: 'GET'
    });

    if (!req.ok) {
        return null;
    }

    const json = await req.json();
    const products = ProductsAPIResponse.parse(json);
    return products;
}