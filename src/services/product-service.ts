import "server-only";

import getToken from "../auth/token";
import { productSchema, Product, PaginatedProducts } from "@/src/schemas/product.schema";
import { z } from "zod";

const API_URL = process.env.API_URL;

export const ProductService = {
    /**
     * Obtiene productos optimizados para el POS (Busqueda rápida)
     * Endpoint: GET /api/products/v2/pos?q=...
     */
    getPosProducts: async (query: string = ""): Promise<Product[]> => {
        const token = await getToken();
        const res = await fetch(`${API_URL}/products/v2/pos?q=${encodeURIComponent(query)}`, {
            headers: { Authorization: `Bearer ${token}` },
            next: { tags: ["pos-products"], revalidate: 60 } // Cache de 1 min
        });

        if (!res.ok) throw new Error("Fallo al obtener productos del POS");
        
        const data = await res.json();
        // Validamos que la respuesta sea un array de productos
        const validated = z.array(productSchema).safeParse(data);
        
        return validated.success ? validated.data : [];
    },

    /**
     * Obtiene el listado de inventario completo (Paginado)
     * Endpoint: GET /api/products/v2
     */
    getInventory: async (page: number = 1, limit: number = 10, search: string = ""): Promise<PaginatedProducts> => {
        const token = await getToken();
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            search
        });

        const res = await fetch(`${API_URL}/products/v2?${params.toString()}`, {
            headers: { Authorization: `Bearer ${token}` },
            next: { tags: ["inventory"] }
        });

        if (!res.ok) throw new Error("Error al cargar inventario");

        const data = await res.json();
        
        // Validamos la integridad de los productos recibidos
        const validatedProducts = z.array(productSchema).safeParse(data.products);
        if (!validatedProducts.success) {
            console.error("Error de validación en Inventario:", validatedProducts.error.format());
        }

        return data as PaginatedProducts;
    },

    /**
     * Busca un producto por IMEI o Código de Barras
     * Endpoint: GET /api/products/v2/barcode/:code
     */
    getByBarcode: async (code: string): Promise<Product | null> => {
        const token = await getToken();
        const res = await fetch(`${API_URL}/products/v2/barcode/${code}`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store' // Datos siempre frescos para scanners
        });

        if (!res.ok) return null;

        const data = await res.json();
        const validated = productSchema.safeParse(data);

        return validated.success ? validated.data : null;
    }
};