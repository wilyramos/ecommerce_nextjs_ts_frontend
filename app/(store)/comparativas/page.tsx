// File: frontend/app/(store)/comparativas/page.tsx

import { Metadata } from "next";
import Link from "next/link";
import { ComparisonService } from "@/src/services/comparison-service";
import { Comparison } from "@/src/schemas/comparison.schema";
import { H1, H3, P, Small, BadgeText, Hr } from "@/components/ui/TypographyStore";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
    title: "Comparativas de Smartphones y Gadgets | GoPhone",
    description: "Compara especificaciones técnicas, ventajas, desventajas y veredictos editoriales de los últimos dispositivos del mercado para tomar la mejor decisión de compra.",
    openGraph: {
        title: "Comparativas de Smartphones y Gadgets | GoPhone",
        description: "Análisis técnicos y comparativas a fondo de los mejores teléfonos móviles.",
        url: "/comparativas",
        type: "website",
    },
};

export default async function ComparisonsPage() {
    let comparisons: Comparison[] = [];

    try {
        const res = await ComparisonService.getAll({ isActive: true, limit: 24 });
        comparisons = (res?.data || []) as Comparison[];
    } catch (error) {
        console.error("Error al cargar el catálogo de comparativas:", error);
    }

    const breadcrumbItems: { label: string; href: string }[] = [];

    return (
        <main className="min-h-screen bg-background text-foreground antialiased max-w-screen-2xl mx-auto px-4 md:px-8 py-12 space-y-8">
            <header className="space-y-3">
                <Breadcrumbs
                    items={breadcrumbItems}
                    current="Comparativas"
                    className="p-0 text-muted-foreground"
                />

                <div className="space-y-1">
                    <BadgeText className="text-action-cta font-semibold">
                        Centro de Análisis
                    </BadgeText>
                    <H1>Comparativas a fondo</H1>
                </div>

                <P className="text-muted-foreground">
                    Evaluamos minuciosamente el hardware, rendimiento y valor comercial de cada dispositivo para asistirte en una elección precisa y transparente.
                </P>
            </header>

            <Hr className="my-0" />

            {comparisons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {comparisons.map((item) => (
                        <Link
                            key={item._id}
                            href={`/comparativas/${item.slug}`}
                            className="group flex flex-col justify-between p-6 border border-border bg-card hover:border-border-hover transition-colors duration-200 outline-none"
                        >
                            <div className="space-y-3">
                                {item.isFeatured && (
                                    <BadgeText className="bg-action-cta text-action-cta-foreground px-2 py-0.5">
                                        Destacado
                                    </BadgeText>
                                )}
                                <H3>{item.title}</H3>
                            </div>

                            <div className="mt-6 pt-4 border-t border-border/60">
                                <Small className="font-semibold text-foreground group-hover:text-action-cta transition-colors">
                                    Ver análisis técnico →
                                </Small>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-1 border border-dashed border-border bg-muted/20 p-8">
                    <P className="font-medium text-foreground">No se encontraron comparativas</P>
                    <Small className="text-muted-foreground">Estamos preparando nuevos análisis técnicos. Regresa pronto.</Small>
                </div>
            )}
        </main>
    );
}