// File: frontend/app/(store)/comparativas/[slug]/page.tsx

import { Metadata } from "next";
import { ComparisonService } from "@/src/services/comparison-service";
import { Comparison, PopulatedProduct } from "@/src/schemas/comparison.schema";
import { H1, H2, P, Lead } from "@/components/ui/Typography";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProductGallery from "@/components/store/comparisons/ProductGallery";
import ComparisonTable from "@/components/store/comparisons/ComparisonTable";
import ComparisonCharts from "@/components/store/comparisons/ComparisonCharts";
import QuickVerdict from "@/components/store/comparisons/QuickVerdict";
import EditorialAnalysis from "@/components/store/comparisons/EditorialAnalysis";
import FaqSection from "@/components/store/comparisons/FaqSection";

// ─────────────────────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────────────────────

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    
    try {
        const res = await ComparisonService.getBySlug(slug, true);
        const comparison = res.data as Comparison;

        if (!comparison) return {};

        // Usa metaTitle cargado por el admin, o cae de vuelta al título principal
        const title = comparison.metaTitle || comparison.title;
        // Usa metaDescription cargada por el admin, o cae de vuelta a la introducción truncada
        const description = comparison.metaDescription || 
            (comparison.introduccion.length > 155 
                ? `${comparison.introduccion.substring(0, 152)}...` 
                : comparison.introduccion);

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                type: "article",
                url: `/comparativas/${slug}`,
            },
            twitter: {
                card: "summary_large_image",
                title,
                description,
            }
        };
    } catch (error) {
        console.error("Error generating metadata:", error);
        return {};
    }
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function getProductNames(products: Comparison["products"]): string {
    return products
        .map((p) => (typeof p === "object" && p !== null ? (p as PopulatedProduct).nombre : "Producto"))
        .join(" vs ");
}

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────

export default async function ComparisonDetailPage({ params }: Props) {
    const { slug } = await params;
    const res = await ComparisonService.getBySlug(slug, true);
    const comparison = res.data as Comparison;

    const breadcrumbItems = [{ label: "Comparativas", href: "/comparativas" }];

    return (
        <article className="min-h-screen bg-background text-foreground antialiased selection:bg-action-cta/10 max-w-screen-2xl mx-auto px-4 md:px-8 py-12 space-y-12">

            {/* 1 · Navegación y título */}
            <header className="space-y-4">
                <Breadcrumbs
                    items={breadcrumbItems}
                    current={comparison.title}
                    className="p-0 text-muted-foreground"
                />
                <H1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground balance">
                    {comparison.title}
                </H1>
            </header>

            {/* 2 · Galería de productos */}
            <section className="max-w-7xl mx-auto">
                <ProductGallery products={comparison.products} />
            </section>

            {/* 3 · Especificaciones técnicas */}
            <section className="space-y-6">
                <div className="space-y-2 border-b border-border pb-4">
                    <H2 className="text-xl md:text-2xl font-bold tracking-tight">
                        Especificaciones técnicas
                    </H2>
                    <p className="text-sm font-semibold tracking-tight text-action-cta">
                        {getProductNames(comparison.products)}
                    </p>
                    <Lead className="text-muted-foreground text-sm md:text-base leading-relaxed">
                        {comparison.introduccion}
                    </Lead>
                </div>
                <ComparisonTable
                    products={comparison.products}
                    specs={comparison.especificaciones}
                />
            </section>

            {/* 4 · Métricas de rendimiento */}
            <section className="space-y-6">
                <H2 className="text-xl md:text-2xl font-bold tracking-tight border-b border-border pb-2">
                    Métricas de rendimiento
                </H2>
                <ComparisonCharts
                    products={comparison.products}
                    specs={comparison.especificaciones}
                />
            </section>

            <QuickVerdict content={comparison.veredictoRapido} />

            {/* 6 · Análisis detallado por producto */}
            <section className="space-y-6">
                <H2 className="text-xl md:text-2xl font-bold tracking-tight border-b border-border pb-2">
                    Análisis detallado por producto
                </H2>
                <EditorialAnalysis
                    items={comparison.analisisEditorial}
                    products={comparison.products}
                />
            </section>

            {/* 7 · Conclusión */}
            <section className="bg-secondary text-secondary-foreground p-8 md:p-10 rounded-xl space-y-3 border border-action-cta/10">
                <H2 className="text-lg md:text-xl font-bold tracking-tight text-foreground">
                    Conclusión
                </H2>
                <P className="text-muted-foreground leading-relaxed text-xs md:text-md">
                    {comparison.conclusion}
                </P>
            </section>

            {/* 8 · Preguntas frecuentes */}
            <FaqSection items={comparison.faqItems} />
        </article>
    );
}