// File: frontend/app/(store)/comparativas/[slug]/page.tsx

import { Metadata } from "next";
import { ComparisonService } from "@/src/services/comparison-service";
import { Comparison } from "@/src/schemas/comparison.schema";
import { H1, H2 } from "@/components/ui/Typography";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProductGallery from "@/components/store/comparisons/ProductGallery";
import ComparisonTable from "@/components/store/comparisons/ComparisonTable";
import ComparisonRadar from "@/components/store/comparisons/ComparisonRadar";
import QuickVerdict from "@/components/store/comparisons/QuickVerdict";
import FaqSection from "@/components/store/comparisons/FaqSection";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    try {
        const res = await ComparisonService.getBySlug(slug);
        if (!res?.data) return { title: "Comparativa no encontrada" };
        const c = res.data as Comparison;
        const title = c.title;
        const description = c.metaDescription || c.veredictoRapido;
        return {
            title,
            description,
            openGraph: { title, description, type: "article", url: `/comparativas/${slug}` },
            twitter: { card: "summary_large_image", title, description },
        };
    } catch {
        return {};
    }
}

export default async function ComparisonDetailPage({ params }: Props) {
    const { slug } = await params;
    const res = await ComparisonService.getBySlug(slug);
    if (!res?.data) notFound();

    const comparison = res.data as Comparison;

    return (
        <article className="min-h-screen bg-background text-foreground antialiased max-w-screen-xl mx-auto px-4 md:px-8 py-12 space-y-14">

            {/* 1 · Título */}
            <header className="space-y-4">
                <Breadcrumbs
                    items={[{ label: "Comparativas", href: "/comparativas" }]}
                    current={comparison.title}
                    className="p-0 text-muted-foreground"
                />
                <H1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-primary">
                    {comparison.title}
                </H1>
            </header>

            {/* 2 · Galería de productos */}
            <section>
                <ProductGallery products={comparison.products} />
            </section>

            {/* 3 · Veredicto rápido */}
            <section>
                <QuickVerdict content={comparison.veredictoRapido} />
            </section>

            {/* 4 · Radar */}
            <section className="space-y-4">
                <H2 className="text-xl font-bold tracking-tight border-b border-border pb-2 text-primary">
                    Análisis visual comparativo
                </H2>
                <ComparisonRadar
                    specs={comparison.especificaciones}
                    products={comparison.products}
                />
            </section>

            {/* 5 · Tabla técnica */}
            <section className="space-y-4">
                <H2 className="text-xl font-bold tracking-tight border-b border-border pb-2 text-primary">
                    Especificaciones técnicas
                </H2>
                <ComparisonTable
                    products={comparison.products}
                    specs={comparison.especificaciones}
                />
            </section>

            {/* 6 · FAQ */}
            {comparison.faqItems.length > 0 && (
                <FaqSection items={comparison.faqItems} />
            )}

        </article>
    );
}