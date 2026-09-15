import ResumenCarrito from "@/components/cart/ResumenCarrito";
import { getDestacadosProducts } from "@/src/services/products";
import ProductGridMini from "@/components/product/ProductGridMini";
import { H2 } from "@/components/ui/TypographyV3";

export default async function CarritoPage() {
    const [destacadosData] = await Promise.all([getDestacadosProducts()]);
    const sugerencias = destacadosData?.products || [];

    return (
        <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-6">
            <section>
                <ResumenCarrito />
            </section>

            {sugerencias.length > 0 && (
                <section className="mt-16 pt-10 border-t border-border-primary/80 flex flex-col gap-6">
                    <H2>Te puede interesar</H2>
                    <ProductGridMini products={sugerencias.slice(0, 4)} />
                </section>
            )}
        </div>
    );
}