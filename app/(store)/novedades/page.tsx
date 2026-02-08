import { notFound } from "next/navigation";
import { getCatalogDataNewArrivals } from "@/src/services/catalog";
import CatalogLayout from "@/components/catalog/CatalogLayout";
import { Sparkles } from "lucide-react";
import type { Metadata } from "next";

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    console.log("Generating metadata for Novedades page with params:", await searchParams);
    return {
        title: "Novedades y Lanzamientos | GoPhone",
        description: "Descubre lo último en tecnología. Nuevos ingresos en iPhone, Samsung, Audio y Accesorios premium.",
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/novedades`,
        }
    };
}

export default async function NewsPage({ searchParams }: Props) {
    const resolvedSearchParams = await searchParams;

    // 1. Fetch de Novedades
    const data = await getCatalogDataNewArrivals(resolvedSearchParams);

    if (!data) return notFound();

    // 2. Personalización de Contexto
    const newsContext = {
        ...data.context,
        categoryName: "Últimos Ingresos", // Sobrescribe el breadcrumb
        searchQuery: null
    };

    return (
        <div className="bg-[var(--store-bg)] min-h-screen">

            {/* =========================================================
                HEADER EXCLUSIVO DE NOVEDADES (Estilo Apple Pro)
               ========================================================= */}
            <div className="relative bg-[#050505] text-white pt-12 pb-24 overflow-hidden isolate">

                {/* Fondo Abstracto "Aurora" (Estático) */}
                <div className="absolute inset-0 z-0 pointer-events-none select-none">
                    <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[80%] h-[150%] rounded-full bg-blue-900/20 blur-[120px] mix-blend-screen opacity-60" />
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
                </div>

                <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                        <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-100">
                            New Collection
                        </span>
                    </div>

                    {/* Título */}
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-white leading-tight">
                        Lo nuevo <br className="md:hidden" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-purple-200">
                            ha llegado.
                        </span>
                    </h1>

                    {/* Descripción */}
                    <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base font-light leading-relaxed">
                        Explora la última generación de dispositivos y accesorios que definen el futuro de la tecnología.
                    </p>
                </div>
            </div>

            {/* =========================================================
                CATÁLOGO SUPERPUESTO (Efecto "Sheet")
               ========================================================= */}
            <div className="-mt-12 relative z-20 bg-[var(--store-bg)] rounded-t-[2.5rem] border-t border-[var(--store-border)] min-h-screen shadow-2xl shadow-black/10">

                {/* Pequeño espacio visual antes del grid */}
                <div className="h-6" />

                <CatalogLayout
                    products={data.products}
                    filters={data.filters}
                    pagination={data.pagination}
                    context={newsContext}
                    isFallback={data.isFallback}
                />
            </div>
        </div>
    );
}