"use server";

import { ProductService } from "@/src/services/product-service";
import { Product } from "@/src/schemas/product.schema";

/**
 * Acción de servidor para buscar productos en el POS
 */
export async function searchProductsAction(query: string): Promise<Product[]> {
    try {
        // Llamamos al servicio que ya tienes definido
        return await ProductService.getPosProducts(query);
    } catch (error) {
        console.error("Error searching products:", error);
        return [];
    }
}