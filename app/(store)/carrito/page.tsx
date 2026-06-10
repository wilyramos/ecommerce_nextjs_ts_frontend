// File: frontend/app/(store)/carrito/page.tsx
import ResumenCarrito from "@/components/cart/ResumenCarrito";
import { getDestacadosProducts } from "@/src/services/products";
import ProductGridMini from "@/components/product/ProductGridMini";

export default async function CarritoPage() {
    const [destacadosData] = await Promise.all([getDestacadosProducts()])
    const sugerencias = destacadosData?.products || []

    return (
        <main className="mx-auto max-w-5xl px-4 py-6 bg-background text-foreground">
            <section>
                <ResumenCarrito />
            </section>

            {sugerencias.length > 0 && (
                <section className="mt-10 pt-8 border-t border-border">
                    <h2 className="text-sm font-bold text-foreground mb-4">Te puede interesar</h2>
                    <ProductGridMini products={sugerencias.slice(0, 4)} />
                </section>
            )}
        </main>
    )
}