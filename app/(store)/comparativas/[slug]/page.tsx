// File: frontend/app/(store)/comparativas/[slug]/page.tsx

import { Metadata } from "next";
import { ComparisonService } from "@/src/services/comparison-service";
import { Comparison } from "@/src/schemas/comparison.schema";
import { H1, H2 } from "@/components/ui/TypographyStore";
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
        <article className="min-h-screen bg-background text-foreground antialiased max-w-screen-xl mx-auto px-4 md:px-8 py-12 space-y-12">
            <header className="space-y-3">
                <Breadcrumbs
                    items={[{ label: "Comparativas", href: "/comparativas" }]}
                    current={comparison.title}
                    className="p-0 text-muted-foreground"
                />
                <H1>{comparison.title}</H1>
            </header>

            <section>
                <ProductGallery products={comparison.products} />
            </section>

            <section>
                <QuickVerdict content={comparison.veredictoRapido} />
            </section>

            <section className="space-y-4">
                <H2 className="border-b border-border pb-2">
                    Análisis visual comparativo
                </H2>
                <ComparisonRadar
                    specs={comparison.especificaciones}
                    products={comparison.products}
                />
            </section>

            <section className="space-y-4">
                <H2 className="border-b border-border pb-2">
                    Especificaciones técnicas
                </H2>
                <ComparisonTable
                    products={comparison.products}
                    specs={comparison.especificaciones}
                />
            </section>

            {comparison.faqItems.length > 0 && (
                <FaqSection items={comparison.faqItems} />
            )}
        </article>
    );
}