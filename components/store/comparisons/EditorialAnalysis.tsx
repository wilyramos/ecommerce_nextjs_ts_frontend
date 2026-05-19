// File: frontend/components/store/comparisons/EditorialAnalysis.tsx

import { Comparison, PopulatedProduct } from "@/src/schemas/comparison.schema";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
            {/* Selector de producto minimalista */}
            <TabsList className="w-full justify-start h-auto bg-transparent border-b border-border rounded-none p-0 mb-8 gap-6 overflow-x-auto whitespace-nowrap">
                {entries.map(({ idx, nombre, imagen }) => (
                    <TabsTrigger
                        key={idx}
                        value={`product-${idx}`}
                        className="flex items-center gap-2 px-1 pb-3 pt-0 rounded-none border-b-2 border-transparent text-sm font-medium text-muted-foreground data-[state=active]:border-action-cta data-[state=active]:text-foreground bg-transparent transition-all"
                    >
                        {imagen && (
                            <div className="relative w-5 h-5 flex items-center justify-center bg-background-secondary rounded p-0.5 border border-border/40 shrink-0">
                                <Image
                                    src={imagen}
                                    alt={nombre}
                                    width={16}
                                    height={16}
                                    className="object-contain w-full h-full"
                                />
                            </div>
                        )}
                        <span className="line-clamp-1 max-w-[160px]">{nombre}</span>
                    </TabsTrigger>
                ))}
            </TabsList>

            {entries.map(({ idx, item }) => (
                <TabsContent key={idx} value={`product-${idx}`} className="mt-0 space-y-8 focus-visible:outline-none">
                    {/* Perfil de uso */}
                    <div className="space-y-1.5">
                        <span className="text-xs font-bold uppercase tracking-widest text-action-cta block">
                            ¿Para quién es ideal?
                        </span>
                        <p className="text-base md:text-lg text-foreground/90 leading-relaxed font-semibold">
                            {item.resumenIdoneidad}
                        </p>
                    </div>

                    {/* Pros y Contras Estilo Editorial */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 pt-2">
                        {/* Pros */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground border-b border-border pb-1.5">
                                A favor
                            </h4>
                            <ul className="space-y-3">
                                {item.pros.map((pro, pIdx) => (
                                    <li key={pIdx} className="text-sm text-muted-foreground flex items-start gap-2.5 leading-relaxed">
                                        <span className="text-action-cta font-bold shrink-0 select-none text-base md:text-lg leading-none">
                                            •
                                        </span>
                                        <span>{pro}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contras */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1.5">
                                En contra
                            </h4>
                            <ul className="space-y-3">
                                {item.contras.map((contra, cIdx) => (
                                    <li key={cIdx} className="text-sm text-muted-foreground flex items-start gap-2.5 leading-relaxed">
                                        <span className="text-muted-foreground/60 font-bold shrink-0 select-none text-base md:text-lg leading-none">
                                            •
                                        </span>
                                        <span>{contra}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </TabsContent>
            ))}
        </Tabs>
    );
}