// File: frontend/app/(store)/comparativas/page.tsx

import { Metadata } from "next";
import Link from "next/link";
import { ComparisonService } from "@/src/services/comparison-service";
import { Comparison } from "@/src/schemas/comparison.schema";
import { H1, H2, P } from "@/components/ui/Typography";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/badge";

// ─────────────────────────────────────────────────────────────
// METADATA (SEO)
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
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
        <main className="min-h-screen bg-background text-foreground antialiased max-w-screen-2xl mx-auto px-4 md:px-8 py-12 space-y-10">
            {/* Cabecera de la sección */}
            <header className="space-y-4">
                <Breadcrumbs
                    items={breadcrumbItems}
                    current="Comparativas"
                    className="p-0 text-muted-foreground"
                />

                <div className="space-y-2">
                    <span className="text-xs font-bold tracking-widest text-action-cta uppercase block">
                        Centro de Análisis
                    </span>
                    <H1 className="text-primary">
                        Comparativas a fondo
                    </H1>
                </div>

                <P className="text-muted-foreground">
                    Evaluamos minuciosamente el hardware, rendimiento y valor comercial de cada dispositivo para asistirte en una elección precisa y transparente.
                </P>
            </header>

            <hr className="border-border" />

            {/* Listado de comparativas en Tarjetas Planas Editoriales */}
            {comparisons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {comparisons.map((item) => (
                        <Link
                            key={item._id}
                            href={`/comparativas/${item.slug}`}
                            className="group flex flex-col justify-between p-6 rounded-xl border border-border bg-card hover:border-border-hover transition-colors duration-300 outline-none"
                        >
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    {item.isFeatured && (
                                        <Badge variant="secondary" className="bg-action-cta text-white hover:bg-action-cta-hover border-none">
                                            Destacado
                                        </Badge>
                                    )}
                                    <H2 className="text-xl font-bold tracking-tight text-primary">
                                        {item.title}
                                    </H2>
                                </div>
                            </div>

                            <div className="text-xs font-bold tracking-wide text-primary mt-6 pt-4 border-t border-border group-hover:text-action-cta transition-colors">
                                Ver análisis técnico
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-2 rounded-xl border border-dashed border-border bg-muted-neutral">
                    <p className="text-sm font-bold text-foreground">No se encontraron comparativas</p>
                    <p className="text-xs text-muted-foreground">Estamos preparando nuevos análisis técnicos. Regresa pronto.</p>
                </div>
            )}
        </main>
    );
}