// File: frontend/app/(store)/comparativas/[slug]/page.tsx

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";

import { comparisonService } from "@/src/services/comparison-service";
import type { ProductSearchResult } from "@/src/schemas/product-v3.schema";
import ComparisonRadarChart from "@/components/store/comparisons/ComparisonRadarChart";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { 
    H1, H2, H3, P, Muted, Small, Price, BadgeText, 
    Table, Tr, Th, Td 
} from "@/components/ui/TypographyStore";

const CHART_COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4"];

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    try {
        const comparison = await comparisonService.getBySlug(slug);
        return {
            title: `${comparison.title} | Comparativa Frente a Frente`,
            description: comparison.metaDescription || comparison.veredictoRapido.slice(0, 155),
        };
    } catch {
        return {
            title: "Comparativa de Productos",
            description: "Análisis comparativo de productos.",
        };
    }
}

export default async function StoreComparisonDetailPage({ params }: PageProps) {
    const { slug } = await params;

    let comparison;
    try {
        comparison = await comparisonService.getBySlug(slug);
    } catch {
        notFound();
    }

    if (!comparison || !comparison.isActive) {
        notFound();
    }

    const products: ProductSearchResult[] = comparison.products.filter(
        (p): p is ProductSearchResult => typeof p === "object" && p !== null
    );

    return (
        <article className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-16">
            
            <nav className="mb-8">
                <Link href="/comparativas" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" /> 
                    <Small>Volver a Comparativas</Small>
                </Link>
            </nav>

            <header className="max-w-3xl space-y-4">
                <BadgeText className="text-primary">Comparativa Oficial</BadgeText>
                <H1>{comparison.title}</H1>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((product, idx) => {
                    const productThemeColor = CHART_COLORS[idx % CHART_COLORS.length];
                    
                    return (
                        <Card 
                            key={product._id || idx} 
                            style={{ borderTopColor: productThemeColor, borderTopWidth: '4px' }}
                        >
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <Badge variant="secondary">
                                        <BadgeText>Candidato {idx + 1}</BadgeText>
                                    </Badge>
                                    {product.stock && product.stock > 0 ? (
                                        <Small className="text-emerald-600">En Stock</Small>
                                    ) : (
                                        <Small>Consultar stock</Small>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                                    <figure className="relative h-32 w-32 border border-border p-2 rounded-lg shrink-0">
                                        {product.imagenes?.[0] ? (
                                            <Image
                                                src={product.imagenes[0]}
                                                alt={product.nombre}
                                                fill
                                                className="object-contain p-2"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                                            </div>
                                        )}
                                    </figure>

                                    <div className="space-y-4 flex-1 text-center sm:text-left">
                                        <div>
                                            <H3>{product.nombre}</H3>
                                            <Muted>SKU: {product.sku || "N/A"}</Muted>
                                        </div>
                                        <Price className="text-xl block">
                                            S/ {product.precio?.toFixed(2) || "0.00"}
                                        </Price>
                                        <Button asChild size="sm" variant="outline" className="w-full sm:w-auto">
                                            <Link href={`/producto/${product.slug}`}>Ver Producto</Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </section>

            <section className="bg-muted/30 border border-border rounded-lg p-6 sm:p-8">
                <H3 className="mb-4">Veredicto Rápido</H3>
                <P>{comparison.veredictoRapido}</P>
            </section>

            {(products.length >= 2 || comparison.especificaciones.length > 0) && (
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    
                    {products.length >= 2 && comparison.especificaciones.length > 0 && (
                        <div className="sticky top-8 space-y-6">
                            <div>
                                <H2>Análisis de Rendimiento</H2>
                            </div>
                            <div className="border border-border rounded-lg p-4 bg-card">
                                <ComparisonRadarChart
                                    products={products}
                                    especificaciones={comparison.especificaciones}
                                    colors={CHART_COLORS}
                                />
                            </div>
                        </div>
                    )}

                    {comparison.especificaciones.length > 0 && (
                        <div className="space-y-6">
                            <H2>Especificaciones Técnicas</H2>
                            <Table>
                                <thead>
                                    <Tr>
                                        <Th>Característica</Th>
                                        {products.map((product, idx) => (
                                            <Th key={product._id}>
                                                <div className="flex items-center gap-2">
                                                    <span 
                                                        className="w-2 h-2 rounded-full" 
                                                        style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }} 
                                                    />
                                                    {product.nombre}
                                                </div>
                                            </Th>
                                        ))}
                                    </Tr>
                                </thead>
                                <tbody>
                                    {comparison.especificaciones.map((spec, sIdx) => (
                                        <Tr key={sIdx}>
                                            <Td>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-medium">{spec.key}</span>
                                                    {spec.isKeyDifference && (
                                                        <BadgeText className="text-amber-600">Diferencia Clave</BadgeText>
                                                    )}
                                                </div>
                                            </Td>
                                            {products.map((_, pIdx) => (
                                                <Td key={pIdx}>
                                                    <div className="space-y-1">
                                                        <P className="m-0">{spec.values?.[pIdx] || "-"}</P>
                                                        {spec.scores?.[pIdx] !== undefined && (
                                                            <Muted>{spec.scores[pIdx]} pts</Muted>
                                                        )}
                                                    </div>
                                                </Td>
                                            ))}
                                        </Tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </section>
            )}

            {comparison.faqItems.length > 0 && (
                <section className="max-w-3xl space-y-6 pt-8 border-t border-border">
                    <H2>Preguntas Frecuentes</H2>
                    <Accordion type="single" collapsible className="w-full">
                        {comparison.faqItems.map((faq, fIdx) => (
                            <AccordionItem key={fIdx} value={`faq-${fIdx}`}>
                                <AccordionTrigger>
                                    <H3 className="m-0 text-left">{faq.pregunta}</H3>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <P>{faq.respuesta}</P>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </section>
            )}
        </article>
    );
}