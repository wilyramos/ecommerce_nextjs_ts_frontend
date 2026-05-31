// File: frontend/app/(store)/carrito/page.tsx
import ResumenCarrito from "@/components/cart/ResumenCarrito";
import { getDestacadosProducts } from "@/src/services/products"; // Ajusta la ruta de tus servicios
import ProductGridMini from "@/components/product/ProductGridMini";
import { H2 } from "@/components/ui/Typography";

export default async function CarritoPage() {
    // Fetch paralelo en el servidor para no bloquear el renderizado
    const [destacadosData] = await Promise.all([
        getDestacadosProducts()
    ]);

    const sugerencias = destacadosData?.products || [];

    return (
        <main className="mx-auto max-w-6xl px-4 md:py-6 bg-background text-foreground">
            {/* Sección principal: Detalle y totales del carrito */}
            <section className="w-full">
                <ResumenCarrito />
            </section>

            {/* Sección complementaria: Recomendaciones estilo Apple / iShop */}
            {sugerencias.length > 0 && (
                <section className="mt-10 border-t border-border">
                    <H2>
                        Te puede interesar
                    </H2>

                    {/* Grid compacto de 4 productos máximo para mantener el minimalismo */}
                    <ProductGridMini products={sugerencias.slice(0, 4)} />
                </section>
            )}
        </main>
    );
}