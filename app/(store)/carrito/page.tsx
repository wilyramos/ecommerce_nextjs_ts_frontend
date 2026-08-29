// File: frontend/app/(store)/carrito/page.tsx

import ResumenCarrito from "@/components/cart/ResumenCarrito";
import { getDestacadosProducts } from "@/src/services/products";
import ProductGridMini from "@/components/product/ProductGridMini";
import { H2 } from "@/components/ui/TypographyStore";

export default async function CarritoPage() {
    const [destacadosData] = await Promise.all([getDestacadosProducts()]);
    const sugerencias = destacadosData?.products || [];

    return (
        <div className="w-full">
            <section>
                <ResumenCarrito />
            </section>

            {sugerencias.length > 0 && (
                <section className="mt-16 pt-10 border-t border-border flex flex-col gap-6">
                    <H2>Te puede interesar</H2>
                    <ProductGridMini products={sugerencias.slice(0, 4)} />
                </section>
            )}
        </div>
    );
}