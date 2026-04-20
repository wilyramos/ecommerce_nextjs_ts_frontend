// frontend/app/api/products/search/route.ts
import { NextResponse } from "next/server";
import { ProductService } from "@/src/services/product-v2-service";
import { Product } from "@/src/schemas/product.schema";

// Definimos la estructura posible que devuelve el servicio
type SearchResponse = Product[] | { products: Product[] } | null | undefined;

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || "";
    
    try {
        // Tipamos la respuesta del servicio
        const data = await ProductService.search(q) as SearchResponse;
        
        let results: Product[] = [];

        if (Array.isArray(data)) {
            results = data;
        } else if (data && typeof data === "object" && "products" in data && Array.isArray(data.products)) {
            // "products" in data es un Type Guard nativo de TS
            results = data.products;
        }
        
        console.log("Proxy Data to send:", results.length, "items");
        return NextResponse.json(results);
    } catch (error) {
        console.error("Proxy Search Error:", error);
        return NextResponse.json([]); 
    }
}