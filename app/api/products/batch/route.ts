// frontend/app/api/products/batch/route.ts
import { NextResponse } from "next/server";
import { ProductService } from "@/src/services/product-v2-service";

export async function POST(req: Request) {
    try {
        const { ids } = await req.json();
        const response = await ProductService.getBatchByIds(ids);
        
        // REVISIÓN: Extraemos 'products' de la respuesta del backend
        // Usamos un fallback por si el backend cambia en el futuro
        const results = response && typeof response === 'object' && 'products' in response 
            ? response.products 
            : (Array.isArray(response) ? response : []);

        return NextResponse.json(results);
    } catch (error) {
        console.error("Batch Proxy Error:", error);
        return NextResponse.json([]);
    }
}