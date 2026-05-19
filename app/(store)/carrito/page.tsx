// File: frontend/app/(store)/carrito/page.tsx
import ResumenCarrito from "@/components/cart/ResumenCarrito";
import { getOffers, getDestacadosProducts } from "@/src/services/products"; // Ajusta la ruta de tus servicios
import ProductGridMini from "@/components/product/ProductGridMini";
import { H2 } from "@/components/ui/Typography";

export default async function CarritoPage() {
    // Fetch paralelo en el servidor para no bloquear el renderizado
    const [offersData, destacadosData] = await Promise.all([
        getOffers({ page: 1, limit: 4 }),
        getDestacadosProducts()
    ]);

    const sugerencias = offersData?.products || destacadosData?.products || [];

    return (
        <main className="mx-auto max-w-6xl px-4 md:py-6 bg-background text-foreground">
            {/* Sección principal: Detalle y totales del carrito */}
            <section className="w-full">
                <ResumenCarrito />
            </section>

            {/* Sección complementaria: Recomendaciones estilo Apple / iShop */}
            {sugerencias.length > 0 && (
                <section className="mt-16 md:mt-24 pt-12 border-t border-border">
                    <H2 className="text-xl md:text-2xl font-bold tracking-tight mb-6 border-none pb-0">
                        Te puede interesar
                    </H2>
                    
                    {/* Grid compacto de 4 productos máximo para mantener el minimalismo */}
                    <ProductGridMini products={sugerencias.slice(0, 4)} />
                </section>
            )}
        </main>
    );
}