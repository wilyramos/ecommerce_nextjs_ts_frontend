import { notFound } from "next/navigation";
import { getCatalogDataNewArrivals } from "@/src/services/catalog";
import CatalogLayout from "@/components/catalog/CatalogLayout";
import type { Metadata } from "next";

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    
    console.log("Generando metadata para Novedades con searchParams:", await searchParams);
    return {
        title: "Novedades | GoPhone",
        description: "Lo último en tecnología premium.",
    };
}

export default async function NewsPage({ searchParams }: Props) {
    const resolvedSearchParams = await searchParams;
    const data = await getCatalogDataNewArrivals(resolvedSearchParams);

    if (!data) return notFound();

    const newsContext = {
        ...data.context,
        categoryName: "Novedades",
        searchQuery: null
    };

    return (
        <div className="bg-[var(--color-bg-primary)] min-h-screen flex flex-col">
            
            {/* Header Compacto y Minimalista */}
            <header className="w-full border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]">
                <div className="container mx-auto px-4 md:px-6 max-w-[1440px] py-10 md:py-14 flex flex-col gap-4">
                    
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 w-fit px-3 py-1 bg-[var(--color-accent-warm)]">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-inverse)]">
                            Novedades
                        </span>
                    </div>
                    
                    {/* Título Breve */}
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--color-text-primary)]">
                        Descubre lo <span className="text-[var(--color-accent-warm)] font-light italic">nuevo.</span>
                    </h1>
                    
                    {/* Descripción */}
                    <p className="text-sm md:text-base text-[var(--color-text-secondary)] max-w-2xl font-medium">
                        Explora la última generación de dispositivos y accesorios cuidadosamente seleccionados.
                    </p>

                </div>
            </header>

            {/* Catálogo (Fluye naturalmente debajo del header sin márgenes negativos) */}
            <main className="flex-1 bg-[var(--color-bg-primary)]">
                <CatalogLayout
                    products={data.products}
                    filters={data.filters}
                    pagination={data.pagination}
                    context={newsContext}
                    isFallback={data.isFallback}
                />
            </main>
            
        </div>
    );
}