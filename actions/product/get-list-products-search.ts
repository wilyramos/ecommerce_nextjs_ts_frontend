"use server"

import { ProductsListSchema } from "@/src/schemas";

export const searchProductsIndex = async (query: string) => {
    if (!query || query.trim() === "") {
        return [];
    }
    try {
        const url = `${process.env.API_URL}/products/searchindex?query=${encodeURIComponent(query)}`;
        const req = await fetch(url);

        if (!req.ok) {
            return [];
        }
        console.log("Ressss:", req);

        const json = await req.json();
        console.log("json", json)
        const products = ProductsListSchema.parse(json);
        return products;
    } catch (error) {
        console.error("Error searching products:", error);
        return [];
    }
}