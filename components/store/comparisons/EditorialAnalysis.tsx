// File: frontend/components/store/comparisons/EditorialAnalysis.tsx
import { Comparison, PopulatedProduct } from "@/src/schemas/comparison.schema";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface EditorialAnalysisProps {
    items?: Comparison["analisisEditorial"];
    products: Comparison["products"];
}

export default function EditorialAnalysis({ items, products }: EditorialAnalysisProps) {
    if (!items || items.length === 0) return null;

    const entries = items.map((item, idx) => {
        const matched = products[idx] as PopulatedProduct | undefined;
        return {
            idx,
            item,
            nombre: matched?.nombre ?? `Producto ${idx + 1}`,
            imagen: matched?.imagenes?.[0] ?? null,
        };
    });

    return (
        <Tabs defaultValue="product-0" className="w-full">
            <div className="w-full overflow-x-auto pb-2 mb-4">
                <TabsList>
                    {entries.map(({ idx, nombre, imagen }) => (
                        <TabsTrigger
                            key={idx}
                            value={`product-${idx}`}
                            className="min-w-[140px]"
                        >
                            {imagen && (
                                <div className="relative w-5 h-5 flex items-center justify-center bg-muted-neutral rounded border border-border shrink-0">
                                    <Image
                                        src={imagen}
                                        alt={nombre}
                                        width={16}
                                        height={16}
                                        className="object-contain"
                                    />
                                </div>
                            )}
                            <span className="line-clamp-1 font-bold">{nombre}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>

            {entries.map(({ idx, item }) => (
                <TabsContent key={idx} value={`product-${idx}`} className="mt-0 space-y-6 focus-visible:outline-none animate-in fade-in-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tarjeta Pros */}
                        <Card className="border-success/20 bg-success/5">
                            <CardHeader className="py-3 px-4 border-b border-success/10">
                                <span className="text-xs font-bold text-success uppercase tracking-wider block">
                                    Puntos Fuertes
                                </span>
                            </CardHeader>
                            <CardContent className="p-4">
                                <ul className="space-y-2.5">
                                    {item.pros.map((pro, pIdx) => (
                                        <li key={pIdx} className="text-sm text-muted-foreground flex items-start gap-2 leading-relaxed">
                                            <span className="text-success font-bold shrink-0 text-base leading-none">•</span>
                                            <span>{pro}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Tarjeta Contras */}
                        <Card className="border-destructive/10 bg-destructive/5">
                            <CardHeader className="py-3 px-4 border-b border-destructive/10">
                                <span className="text-xs font-bold text-destructive uppercase tracking-wider block">
                                    Puntos Débiles
                                </span>
                            </CardHeader>
                            <CardContent className="p-4">
                                <ul className="space-y-2.5">
                                    {item.contras.map((contra, cIdx) => (
                                        <li key={cIdx} className="text-sm text-muted-foreground flex items-start gap-2 leading-relaxed">
                                            <span className="text-destructive font-bold shrink-0 text-base leading-none">•</span>
                                            <span>{contra}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            ))}
        </Tabs>
    );
}