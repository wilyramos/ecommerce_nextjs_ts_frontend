import { notFound } from "next/navigation";
import { getCatalogDataOffers } from "@/src/services/catalog";
import CatalogLayout from "@/components/catalog/CatalogLayout";
import { Percent } from "lucide-react"; // Icono para el banner
import type { Metadata } from "next";

// Props para Next.js 15
type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// --- SEO Dinámico para Ofertas ---
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {

    const resolvedSearchParams = await searchParams;
    console.log("Search params en metadata de ofertas: ", resolvedSearchParams);

    return {
        title: "Ofertas y Liquidación | GoPhone",
        description: "Aprovecha descuentos exclusivos en celulares, audio y accesorios. Precios rebajados por tiempo limitado en GoPhone Perú.",
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/ofertas`,
        },
        openGraph: {
            title: "Ofertas Exclusivas | GoPhone",
            description: "Tecnología premium a precios de oportunidad.",
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/ofertas`,
            type: "website",
        }
    };
}

export default async function OffersPage({ searchParams }: Props) {
    const resolvedSearchParams = await searchParams;

    // 1. Llamada al servicio específico de ofertas
    const data = await getCatalogDataOffers(resolvedSearchParams);

    if (!data) return notFound();

    // 2. Sobrescribir el contexto para personalizar el UI
    // Esto hace que el CatalogLayout muestre "Ofertas" en lugar de "Catálogo" en el H1 y Breadcrumbs
    const offersContext = {
        ...data.context,
        categoryName: "Ofertas del Mes", // Título principal
        // Forzamos null en otros para limpiar la jerarquía visual si no se está filtrando
        searchQuery: null 
    };

    return (
        <div className="bg-[var(--store-bg)] min-h-screen">
            
            {/* Banner exclusivo para la página de Ofertas */}
            <div className="bg-[#D62828] text-white pt-8 pb-12 relative overflow-hidden">
                <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
                        <Percent className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2">
                        Oportunidades Únicas
                    </h1>
                    <p className="text-white/90 text-sm md:text-base font-medium max-w-xl mx-auto">
                        Stock limitado. Precios reducidos en productos seleccionados y últimas unidades.
                    </p>
                </div>
                
                {/* Decoración de fondo */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                    </svg>
                </div>
            </div>

            {/* Layout del Catálogo (Reutilizado) */}
            {/* El div negativo (-mt) hace que el catálogo se solape elegantemente con el banner rojo */}
            <div className="-mt-8 relative z-20 bg-[var(--store-surface)] rounded-t-[2.5rem] border-t border-[var(--store-border)] min-h-screen ">
                <CatalogLayout
                    products={data.products}
                    filters={data.filters}
                    pagination={data.pagination}
                    context={offersContext} // Pasamos el contexto modificado
                    isFallback={data.isFallback}
                />
            </div>
        </div>
    );
}