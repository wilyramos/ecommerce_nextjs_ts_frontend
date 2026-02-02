import { Metadata } from "next";
import { getOffers } from "@/src/services/products"; // Tu nuevo servicio dedicado
import ProductGrid from "@/components/product/product-grid";
import Pagination from "@/components/ui/Pagination";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { LuTag, LuTimer, LuPercent } from "react-icons/lu";

// Definición de Props para Next.js 15 (searchParams es una Promesa)
interface OffersPageProps {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}

// 1. SEO AVANZADO: Metadatos Dinámicos
export async function generateMetadata({ searchParams }: OffersPageProps): Promise<Metadata> {
    const params = await searchParams;
    const pageInfo = params.page && params.page !== "1" ? ` - Página ${params.page}` : "";

    return {
        title: `Ofertas y Liquidación${pageInfo} | GoPhone`,
        description: "Aprovecha descuentos exclusivos por tiempo limitado. Productos con rebajas reales ordenados por mayor porcentaje de ahorro.",
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/ofertas`,
        },
        openGraph: {
            title: "🔥 Ofertas Flash | Descuentos Reales",
            description: "Explora nuestra selección de productos con precio rebajado.",
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/ofertas`,
            type: "website",
            images: [
                {
                    url: `${process.env.NEXT_PUBLIC_BASE_URL}/og-offers.jpg`, // Asegúrate de tener una imagen genérica
                    width: 1200,
                    height: 630,
                    alt: "Ofertas Especiales",
                },
            ],
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function OffersPage({ searchParams }: OffersPageProps) {
    // Resolver parámetros (Next.js 15)
    const params = await searchParams;
    const currentPage = Number(params.page) || 1;

    // 2. FETCH DE DATOS (Usando el endpoint optimizado /products/offers)
    const data = await getOffers({
        page: currentPage,
        limit: 12
    });

    if (!data) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center bg-[var(--store-bg)]">
                <h2 className="text-xl font-bold text-[var(--store-text)]">Error cargando ofertas</h2>
                <p className="text-[var(--store-text-muted)]">Por favor intenta recargar la página.</p>
            </div>
        );
    }

    // 3. SCHEMA.ORG (Datos Estructurados para Google)
    // Usamos 'CollectionPage' para indicar que es una lista curada de items
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Ofertas Especiales",
        "description": "Lista de productos con descuentos activos.",
        "url": `${process.env.NEXT_PUBLIC_BASE_URL}/ofertas`,
        "numberOfItems": data.totalProducts,
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": data.products.map((product, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `${process.env.NEXT_PUBLIC_BASE_URL}/productos/${product.slug}`,
                "name": product.nombre
            }))
        }
    };

    return (
        <main className="bg-[var(--store-bg)] min-h-screen pb-20">
            {/* Inyección de JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* --- HERO BANNER (Estilo Apple) --- */}
            <div className="bg-[var(--store-surface)] border-b border-[var(--store-border)] pt-12 pb-16 px-4 mb-8">
                <div className="container mx-auto flex flex-col items-center text-center max-w-4xl">
                    <Breadcrumbs segments={[]} current="Ofertas" />

                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF3B30]/10 text-[#FF3B30] text-[10px] font-bold uppercase tracking-widest mb-6">
                        <LuPercent size={12} />
                        <span>Precios Reducidos</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-[var(--store-text)] tracking-tight mb-4">
                        Oportunidades únicas.
                        <br />
                        <span className="text-[var(--store-text-muted)]">Por tiempo limitado.</span>
                    </h1>

                    <p className="text-[var(--store-text-muted)] text-lg max-w-2xl leading-relaxed">
                        Hemos seleccionado los mejores descuentos para ti.
                        Estos productos están ordenados automáticamente por <strong>mayor porcentaje de ahorro</strong>.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4">

                {/* --- BARRA DE ESTADO --- */}
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 p-4 rounded-2xl bg-[var(--store-surface)] border border-[var(--store-border)] shadow-sm">
                    <div className="flex items-center gap-3 text-[var(--store-text)] mb-2 sm:mb-0">
                        <div className="p-2 rounded-full bg-[var(--store-primary)]/10 text-[var(--store-primary)]">
                            <LuTimer size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold">Ofertas Flash Activas</span>
                            <span className="text-xs text-[var(--store-text-muted)]">El stock puede variar rápidamente</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--store-bg)] border border-[var(--store-border)]">
                        <LuTag size={14} className="text-[var(--store-text-muted)]" />
                        <span className="text-xs font-medium text-[var(--store-text-muted)]">
                            {data.totalProducts} productos encontrados
                        </span>
                    </div>
                </div>

                {/* --- GRID DE PRODUCTOS --- */}
                {data.products.length > 0 ? (
                    <div className="space-y-12">
                        <ProductGrid products={data.products} />

                        {/* Paginación */}
                        {data.totalPages > 1 && (
                            <div className="flex justify-center border-t border-[var(--store-border)] pt-12">
                                <Pagination
                                    pathname="/ofertas"
                                    currentPage={data.currentPage}
                                    totalPages={data.totalPages}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    /* Estado Vacío */
                    <div className="flex flex-col items-center justify-center py-32 px-4 border border-dashed border-[var(--store-border)] rounded-3xl bg-[var(--store-surface)] text-center">
                        <div className="bg-[var(--store-bg)] p-6 rounded-full mb-6">
                            <LuTag className="text-[var(--store-text-muted)]" size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-[var(--store-text)] mb-2">
                            Todo se ha vendido
                        </h2>
                        <p className="text-[var(--store-text-muted)] max-w-md mx-auto">
                            En este momento no tenemos ofertas activas.
                            Estamos actualizando nuestro catálogo, vuelve a visitarnos pronto.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}