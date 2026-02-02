import { Metadata } from "next";
import { getOffers } from "@/src/services/products";
import ProductGrid from "@/components/product/product-grid";
import Pagination from "@/components/ui/Pagination";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { LuTag, LuPercent } from "react-icons/lu";

interface OffersPageProps {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}

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
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function OffersPage({ searchParams }: OffersPageProps) {
    const params = await searchParams;
    const currentPage = Number(params.page) || 1;

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
        <main className="bg-[var(--store-bg)] min-h-screen pb-10">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* --- COMPACT HEADER (Estilo Apple) --- */}
            <div className="bg-[var(--store-surface)] border-b border-[var(--store-border)]">
                <div className="container mx-auto px-4 py-8 md:py-10">
                    <Breadcrumbs segments={[]} current="Ofertas" />

                    <div className="mt-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        {/* Título y Subtítulo */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <h1 className="text-3xl md:text-4xl font-bold text-[var(--store-text)] tracking-tight">
                                    Ofertas Flash
                                </h1>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FF3B30]/10 text-[#FF3B30]">
                                    Live
                                </span>
                            </div>
                            <p className="text-[var(--store-text-muted)] text-sm md:text-base max-w-lg">
                                Descuentos reales ordenados por oportunidad de ahorro.
                            </p>
                        </div>

                        {/* Contador Compacto */}
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--store-bg)] border border-[var(--store-border)]">
                            <LuPercent size={14} className="text-[var(--store-primary)]" />
                            <span className="text-xs font-semibold text-[var(--store-text)]">
                                {data.totalProducts} productos en liquidación
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 mt-8">
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
                    <div className="flex flex-col items-center justify-center py-24 px-4 border border-dashed border-[var(--store-border)] rounded-2xl bg-[var(--store-surface)] text-center">
                        <div className="bg-[var(--store-bg)] p-4 rounded-full mb-4">
                            <LuTag className="text-[var(--store-text-muted)]" size={32} />
                        </div>
                        <h2 className="text-lg font-bold text-[var(--store-text)] mb-1">
                            Sin ofertas activas
                        </h2>
                        <p className="text-sm text-[var(--store-text-muted)]">
                            Estamos renovando el stock. Vuelve pronto.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}