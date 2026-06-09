// File: frontend/app/(store)/comparativas/[slug]/page.tsx
import { Metadata } from "next";
import { ComparisonService } from "@/src/services/comparison-service";
import { Comparison } from "@/src/schemas/comparison.schema";
import { H1, H2 } from "@/components/ui/Typography";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProductGallery from "@/components/store/comparisons/ProductGallery";
import ComparisonTable from "@/components/store/comparisons/ComparisonTable";
import ComparisonCharts from "@/components/store/comparisons/ComparisonCharts";
import QuickVerdict from "@/components/store/comparisons/QuickVerdict";
import EditorialAnalysis from "@/components/store/comparisons/EditorialAnalysis";
import FaqSection from "@/components/store/comparisons/FaqSection";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    try {
        const res = await ComparisonService.getBySlug(slug, true);
        if (!res?.data) {
            return { title: "Comparativa no encontrada" };
        }
        const comparison = res.data as Comparison;

        const title = comparison.metaTitle || comparison.title;
        const description = comparison.metaDescription || comparison.veredictoRapido;

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

export default async function ComparisonDetailPage({ params }: Props) {
    const { slug } = await params;
    const res = await ComparisonService.getBySlug(slug, true);

    if (!res?.data) {
        notFound();
    }
    const comparison = res.data as Comparison;
    const breadcrumbItems = [{ label: "Comparativas", href: "/comparativas" }];

    return (
        <article className="min-h-screen bg-background text-foreground antialiased max-w-screen-2xl mx-auto px-4 md:px-8 py-12 space-y-14">

            {/* 1 · Navegación y título */}
            <header className="space-y-4">
                <Breadcrumbs
                    items={breadcrumbItems}
                    current={comparison.title}
                    className="p-0 text-muted-foreground"
                />
                <H1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-primary">
                    {comparison.title}
                </H1>
            </header>

            {/* 2 · Galería de productos */}
            <section className="max-w-7xl mx-auto">
                <ProductGallery products={comparison.products} />
            </section>

            {/* 3 · Veredicto Rápido de Venta & Caja Captación Leads */}
            <section className="grid grid-cols-1 gap-6 items-stretch">
                <div className="flex">
                    <QuickVerdict content={comparison.veredictoRapido} />
                </div>
            </section>

            {/* 4 · Gráficos visuales interactivos */}
            <section className="space-y-6 bg-muted-neutral p-6 md:p-8 rounded-2xl border border-border">
                <div className="space-y-1">
                    <H2 className="text-xl md:text-2xl font-bold tracking-tight text-primary">
                        Métricas y Balance de Rendimiento
                    </H2>
                </div>
                <ComparisonCharts
                    analisisEditorial={comparison.analisisEditorial}
                    products={comparison.products}
                />
            </section>

            {/* 5 · Matriz técnica limpia */}
            <section className="space-y-4">
                <H2 className="text-xl md:text-2xl font-bold tracking-tight border-b border-border pb-2 text-primary">
                    Ficha Técnica Comparativa
                </H2>
                <ComparisonTable
                    products={comparison.products}
                    specs={comparison.especificaciones}
                />
            </section>

            {/* 6 · Análisis detallado de Pros y Contras por producto */}
            <section className="space-y-6">
                <H2 className="text-xl md:text-2xl font-bold tracking-tight border-b border-border pb-2 text-primary">
                    Ventajas y Desventajas de cada Opción
                </H2>
                <EditorialAnalysis
                    items={comparison.analisisEditorial}
                    products={comparison.products}
                />
            </section>

            {/* 7 · Preguntas frecuentes */}
            <FaqSection items={comparison.faqItems} />
        </article>
    );
}