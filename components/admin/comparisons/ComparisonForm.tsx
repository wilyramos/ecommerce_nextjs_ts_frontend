// File: frontend/src/components/admin/ComparisonForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Comparison, ComparisonFormValues, ComparisonSpec, ProductEditorial, ComparisonFAQ, ComparisonCTA, ProductScore } from "@/src/schemas/comparison.schema";
import { LabelWithTooltip } from "@/components/utils/LabelWithTooltip";
import ProductReferenceSelector from "@/components/admin/shared/ProductReferenceSelector";
import { Small } from "@/components/ui/Typography";
import Alert from "@/components/ui/Alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Trash2, Layers, FileText, Settings, HelpCircle, Sparkles, BarChart3, Target } from "lucide-react";

interface ComparisonFormProps {
    initialData?: Comparison;
    fields?: Partial<ComparisonFormValues>;
    fieldErrors?: Record<string, string[]>;
    generalError?: string;
}

export default function ComparisonForm({
    initialData,
    fields,
    fieldErrors,
    generalError,
}: ComparisonFormProps) {
    const [isActive, setIsActive] = useState<boolean>(() => fields?.isActive ?? initialData?.isActive ?? true);
    const [isFeatured, setIsFeatured] = useState<boolean>(() => fields?.isFeatured ?? initialData?.isFeatured ?? false);

    const [products, setProducts] = useState<string[]>(() => {
        if (fields?.products) return fields.products as string[];
        if (initialData?.products) {
            return initialData.products.map(p => typeof p === "string" ? p : p._id) as string[];
        }
        return ["", ""];
    });

    const [productNames, setProductNames] = useState<Record<number, string>>(() => {
        const initialMap: Record<number, string> = {};
        if (initialData?.products) {
            initialData.products.forEach((p, idx) => {
                if (p && typeof p === "object" && p.nombre) {
                    initialMap[idx] = p.nombre;
                }
            });
        }
        return initialMap;
    });

    const [specs, setSpecs] = useState<ComparisonSpec[]>(() => {
        if (fields?.especificaciones) return fields.especificaciones as ComparisonSpec[];
        if (initialData?.especificaciones) return initialData.especificaciones as ComparisonSpec[];
        return [{ key: "", values: ["", ""], category: "General", isKeyDifference: false }];
    });

    const [editorials, setEditorials] = useState<ProductEditorial[]>(() => {
        if (fields?.analisisEditorial) return fields.analisisEditorial as ProductEditorial[];
        if (initialData?.analisisEditorial) {
            return initialData.analisisEditorial.map(e => ({
                product: typeof e.product === "string" ? e.product : e.product?._id ? e.product._id : "",
                pros: e.pros,
                contras: e.contras,
                winnerBadge: e.winnerBadge || "",
                scores: e.scores || [
                    { criterion: "Rendimiento", score: 80 },
                    { criterion: "Cámara", score: 80 },
                    { criterion: "Batería", score: 80 }
                ]
            })) as ProductEditorial[];
        }
        return [
            { product: "", pros: [""], contras: [""], winnerBadge: "", scores: [{ criterion: "Rendimiento", score: 80 }, { criterion: "Cámara", score: 80 }, { criterion: "Batería", score: 80 }] },
            { product: "", pros: [""], contras: [""], winnerBadge: "", scores: [{ criterion: "Rendimiento", score: 80 }, { criterion: "Cámara", score: 80 }, { criterion: "Batería", score: 80 }] }
        ];
    });

    const [ctaConfig, setCtaConfig] = useState<ComparisonCTA>(() => {
        if (fields?.ctaConfig) return fields.ctaConfig as ComparisonCTA;
        if (initialData?.ctaConfig) return initialData.ctaConfig as ComparisonCTA;
        return { buttonText: "Solicitar Cotización Inmediata", targetUrl: "", leadFormActive: true };
    });

    const [faqs, setFaqs] = useState<ComparisonFAQ[]>(() => {
        if (fields?.faqItems) return fields.faqItems as ComparisonFAQ[];
        if (initialData?.faqItems) return initialData.faqItems as ComparisonFAQ[];
        return [];
    });

    useEffect(() => {
        if (!fields) return;
        if (fields.products) setProducts(fields.products as string[]);
        if (fields.especificaciones) setSpecs(fields.especificaciones as ComparisonSpec[]);
        if (fields.analisisEditorial) setEditorials(fields.analisisEditorial as ProductEditorial[]);
        if (fields.faqItems) setFaqs(fields.faqItems as ComparisonFAQ[]);
        if (fields.ctaConfig) setCtaConfig(fields.ctaConfig as ComparisonCTA);
    }, [fields]);

    useEffect(() => {
        setSpecs(prev => prev.map(spec => {
            const newValues = [...spec.values];
            while (newValues.length < products.length) newValues.push("");
            if (newValues.length > products.length) newValues.length = products.length;
            return { ...spec, values: newValues };
        }));

        setEditorials(prev => {
            const newEditorials = [...prev];
            while (newEditorials.length < products.length) {
                newEditorials.push({
                    product: "",
                    pros: [""],
                    contras: [""],
                    winnerBadge: "",
                    scores: [
                        { criterion: "Rendimiento", score: 80 },
                        { criterion: "Cámara", score: 80 },
                        { criterion: "Batería", score: 80 }
                    ]
                });
            }
            if (newEditorials.length > products.length) newEditorials.length = products.length;
            return newEditorials;
        });
    }, [products.length]);

    const addProduct = () => setProducts([...products, ""]);
    const removeProduct = (idx: number) => {
        if (products.length <= 2) return;
        setProducts(products.filter((_, i) => i !== idx));
        setEditorials(editorials.filter((_, i) => i !== idx));

        const updatedNames = { ...productNames };
        delete updatedNames[idx];
        const reindexedNames: Record<number, string> = {};
        products.filter((_, i) => i !== idx).forEach((_, newIdx) => {
            const oldIdx = newIdx >= idx ? newIdx + 1 : newIdx;
            if (updatedNames[oldIdx]) reindexedNames[newIdx] = updatedNames[oldIdx];
        });
        setProductNames(reindexedNames);
    };

    const addSpecRow = () => {
        setSpecs([...specs, { key: "", values: Array(products.length).fill(""), category: "General", isKeyDifference: false }]);
    };
    const removeSpecRow = (idx: number) => setSpecs(specs.filter((_, i) => i !== idx));

    const updateSpecIsKeyDifference = (idx: number, checked: boolean) => {
        const updated = [...specs];
        updated[idx].isKeyDifference = checked;
        setSpecs(updated);
    };

    const updateEditorialScore = (eIdx: number, sIdx: number, field: keyof ProductScore, value: string | number) => {
        const updated = [...editorials];
        if (!updated[eIdx].scores) updated[eIdx].scores = [];
        updated[eIdx].scores[sIdx] = {
            ...updated[eIdx].scores[sIdx],
            [field]: value
        };
        setEditorials(updated);
    };

    const addPro = (eIdx: number) => {
        const updated = [...editorials];
        updated[eIdx].pros.push("");
        setEditorials(updated);
    };
    const addContra = (eIdx: number) => {
        const updated = [...editorials];
        updated[eIdx].contras.push("");
        setEditorials(updated);
    };

    const addFaq = () => setFaqs([...faqs, { pregunta: "", respuesta: "" }]);
    const removeFaq = (idx: number) => setFaqs(faqs.filter((_, i) => i !== idx));

    return (
        <div className="space-y-8">
            {generalError && <Alert variant="error" mode="banner">{generalError}</Alert>}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* COLUMNA PRINCIPAL (AGRUPACIÓN EN ACORDEONES COLAPSABLES) */}
                <div className="lg:col-span-3">
                    <Accordion type="multiple" defaultValue={["sec-products", "sec-general"]} className="space-y-4">

                        {/* 1. SELECCIÓN DE PRODUCTOS */}
                        <AccordionItem value="sec-products" className="border rounded-xl bg-card px-6 py-2 shadow-sm">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-3 text-left">
                                    <FileText className="w-5 h-5 text-primary" />
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">1. Selección de Productos</h3>
                                        <p className="text-xs text-muted-foreground font-normal">Define los modelos del catálogo que se van a contrastar.</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 pb-4 border-t space-y-4">
                                <div className="flex justify-end">
                                    <Button type="button" variant="outline" size="sm" onClick={addProduct} className="gap-1.5 text-xs">
                                        <Plus className="w-3.5 h-3.5" /> Vincular Producto
                                    </Button>
                                </div>
                                {fieldErrors?.products && <Alert variant="error">{fieldErrors.products[0]}</Alert>}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {products.map((prod, idx) => {
                                        const rawProduct = initialData?.products?.[idx];
                                        const initialProductObject = rawProduct && typeof rawProduct === "object" ? {
                                            _id: rawProduct._id,
                                            nombre: rawProduct.nombre || "",
                                            precio: typeof rawProduct.precio === "string" ? parseFloat(rawProduct.precio) : (rawProduct.precio || 0),
                                            imagenes: rawProduct.imagenes || []
                                        } : null;

                                        return (
                                            <div key={idx} className="flex items-start gap-3 border p-4 rounded-xl bg-secondary/20 relative">
                                                <div className="flex-1 space-y-1">
                                                    <span className="text-xs font-bold uppercase block mb-1 text-primary truncate max-w-[240px]">
                                                        {productNames[idx] || `Modelo de Referencia`}
                                                    </span>
                                                    <input type="hidden" name={`products[${idx}]`} value={prod} />
                                                    <ProductReferenceSelector
                                                        label=""
                                                        initialId={typeof rawProduct === "string" ? rawProduct : prod}
                                                        initialProduct={initialProductObject}
                                                        onProductData={(productObj) => {
                                                            if (productObj) {
                                                                setProductNames(prev => ({ ...prev, [idx]: productObj.nombre }));
                                                            }
                                                        }}
                                                        onSelect={(id) => {
                                                            const updated = [...products];
                                                            updated[idx] = id;
                                                            setProducts(updated);

                                                            const updatedEd = [...editorials];
                                                            if (!updatedEd[idx]) updatedEd[idx] = { product: "", pros: [""], contras: [""], winnerBadge: "", scores: [] };
                                                            updatedEd[idx].product = id;
                                                            setEditorials(updatedEd);

                                                            if (!id) {
                                                                setProductNames(prev => {
                                                                    const copy = { ...prev };
                                                                    delete copy[idx];
                                                                    return copy;
                                                                });
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                {products.length > 2 && (
                                                    <Button type="button" variant="destructive" size="icon" className="mt-2 shrink-0 h-8 w-8 rounded-lg" onClick={() => removeProduct(idx)}>
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* 2. ENCABEZADOS GENERALES */}
                        <AccordionItem value="sec-general" className="border rounded-xl bg-card px-6 py-2 shadow-sm">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-3 text-left">
                                    <Layers className="w-5 h-5 text-primary" />
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">2. Títulos e Identificadores</h3>
                                        <p className="text-xs text-muted-foreground font-normal">Configura el título principal y la URL limpia.</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 pb-4 border-t space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <LabelWithTooltip htmlFor="title" label="Título Principal" required tooltip="Título indexable óptimo de 20 a 100 caracteres." />
                                        <Input id="title" name="title" defaultValue={fields?.title ?? initialData?.title ?? ""} className={fieldErrors?.title ? "border-destructive h-9" : "h-9"} placeholder="Ej: Comparativa Avanzada..." />
                                        {fieldErrors?.title && <Small className="text-destructive font-medium block">{fieldErrors.title[0]}</Small>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <LabelWithTooltip htmlFor="slug" label="Slug de URL" tooltip="Dejar vacío para cálculo automático." />
                                        <Input id="slug" name="slug" defaultValue={fields?.slug ?? initialData?.slug ?? ""} placeholder="slug-automatico" className="font-mono text-sm h-9" />
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* 3. PARÁMETROS PARA GRÁFICOS */}
                        <AccordionItem value="sec-charts" className="border rounded-xl bg-card px-6 py-2 shadow-sm">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-3 text-left">
                                    <BarChart3 className="w-5 h-5 text-primary" />
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">3. Puntuaciones Cuantitativas para Gráficos</h3>
                                        <p className="text-xs text-muted-foreground font-normal">Valores limpios (0 - 100) para alimentar los gráficos de barras o radar.</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 pb-4 border-t space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {products.map((_, idx) => {
                                        const ed = editorials[idx] || { winnerBadge: "", scores: [] };
                                        return (
                                            <div key={idx} className="p-4 border rounded-lg bg-muted/20 space-y-3">
                                                <span className="text-xs font-bold text-primary block border-b pb-1 truncate">
                                                    {productNames[idx] || `(Falta elegir producto)`}
                                                </span>
                                                <div className="space-y-1.5">
                                                    <label className="text-[11px] font-medium text-muted-foreground">Insignia Visual Destacada (Badge)</label>
                                                    <Input name={`analisisEditorial[${idx}][winnerBadge]`} defaultValue={ed.winnerBadge} placeholder="Ej: Calidad/Precio" className="h-8 text-xs" />
                                                </div>
                                                <div className="space-y-2 pt-1">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Criterios Cuantitativos</span>
                                                    <div className="space-y-2">
                                                        {[0, 1, 2].map((sIdx) => {
                                                            const scoreItem = ed.scores?.[sIdx] || { criterion: "", score: 80 };
                                                            return (
                                                                <div key={sIdx} className="grid grid-cols-3 gap-2 items-center">
                                                                    <Input className="h-7 text-xs col-span-2" value={scoreItem.criterion} placeholder="Criterio (Ej: Cámara)" onChange={(e) => updateEditorialScore(idx, sIdx, "criterion", e.target.value)} />
                                                                    <input type="hidden" name={`analisisEditorial[${idx}][scores][${sIdx}][criterion]`} value={scoreItem.criterion} />
                                                                    <Input type="number" className="h-7 text-xs" value={scoreItem.score} min={0} max={100} onChange={(e) => updateEditorialScore(idx, sIdx, "score", parseInt(e.target.value, 10) || 0)} />
                                                                    <input type="hidden" name={`analisisEditorial[${idx}][scores][${sIdx}][score]`} value={scoreItem.score} />
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* 4. MATRIZ TÉCNICA */}
                        <AccordionItem value="sec-specs" className="border rounded-xl bg-card px-6 py-2 shadow-sm">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-3 text-left">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">4. Matriz de Especificaciones</h3>
                                        <p className="text-xs text-muted-foreground font-normal">Filas de atributos puros para alimentar la tabla comparativa visual.</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 pb-4 border-t space-y-4">
                                <div className="flex justify-end">
                                    <Button type="button" variant="outline" size="sm" onClick={addSpecRow} className="gap-1.5 text-xs">
                                        <Plus className="w-3.5 h-3.5" /> Añadir Atributo
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                    {specs.map((spec, idx) => (
                                        <div key={idx} className="p-4 border rounded-xl bg-secondary/10 space-y-3 relative shadow-sm">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                                                <div className="space-y-1">
                                                    <label className="text-[11px] font-medium text-muted-foreground">Atributo</label>
                                                    <Input name={`especificaciones[${idx}][key]`} defaultValue={spec.key} placeholder="Ej: Memoria RAM" className="h-8 text-xs" required />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[11px] font-medium text-muted-foreground">Categoría de Bloque</label>
                                                    <Input name={`especificaciones[${idx}][category]`} defaultValue={spec.category ?? "General"} placeholder="Ej: Hardware" className="h-8 text-xs" />
                                                </div>
                                                <div className="flex items-center gap-2 h-8 px-2 border rounded bg-background justify-between">
                                                    <span className="text-[10px] font-bold text-muted-foreground">¿Resaltar Diferencia?</span>
                                                    <input type="hidden" name={`especificaciones[${idx}][isKeyDifference]`} value={String(spec.isKeyDifference)} />
                                                    <Switch checked={spec.isKeyDifference} onCheckedChange={(checked) => updateSpecIsKeyDifference(idx, checked)} className="scale-75" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                                {products.map((_, pIdx) => (
                                                    <div key={pIdx} className="bg-background p-2 rounded border space-y-1">
                                                        <span className="text-[10px] font-semibold text-muted-foreground block truncate">
                                                            Valor para: {productNames[pIdx] || `(Falta producto)`}
                                                        </span>
                                                        <Input name={`especificaciones[${idx}][values][${pIdx}]`} defaultValue={spec.values?.[pIdx] ?? ""} placeholder="Ej: 12 GB LPDDR5X" required className="h-7 text-xs" />
                                                    </div>
                                                ))}
                                            </div>

                                            {specs.length > 1 && (
                                                <Button type="button" variant="ghost" size="icon" onClick={() => removeSpecRow(idx)} className="absolute top-2 right-2 h-6 w-6 text-destructive hover:bg-destructive/10">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* 5. CIERRE Y CAPTACIÓN COMERCIAL */}
                        <AccordionItem value="sec-conversion" className="border rounded-xl bg-card px-6 py-2 shadow-sm border-emerald-500/20">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-3 text-left">
                                    <Target className="text-emerald-600 w-5 h-5" />
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-800">5. Conversión y Captación de Leads</h3>
                                        <p className="text-xs text-emerald-600 font-normal">Disparadores comerciales de llamadas a la acción y veredictos ejecutivos.</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 pb-4 border-t space-y-4">
                                <div className="flex items-center justify-between border border-emerald-100 bg-emerald-50/20 p-3 rounded-lg">
                                    <div className="space-y-0.5">
                                        <span className="text-xs font-bold text-emerald-900 block">Formulario de Asesoría Incrustado</span>
                                        <span className="text-[11px] text-muted-foreground block">Activa una caja de captura inmediata para clientes potenciales con dudas.</span>
                                    </div>
                                    <input type="hidden" name="ctaConfig[leadFormActive]" value={String(ctaConfig.leadFormActive)} />
                                    <Switch checked={ctaConfig.leadFormActive} onCheckedChange={(val) => setCtaConfig({ ...ctaConfig, leadFormActive: val })} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium">Texto del Botón Principal (CTA)</label>
                                        <Input name="ctaConfig[buttonText]" value={ctaConfig.buttonText} onChange={(e) => setCtaConfig({ ...ctaConfig, buttonText: e.target.value })} className="h-9 text-sm" required />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium">Enlace de Redirección Alternativo</label>
                                        <Input name="ctaConfig[targetUrl]" value={ctaConfig.targetUrl || ""} onChange={(e) => setCtaConfig({ ...ctaConfig, targetUrl: e.target.value })} className="h-9 text-sm" placeholder="Ej: /checkout" />
                                    </div>
                                </div>
                                <div className="space-y-3 pt-2">
                                    <div className="space-y-1">
                                        <LabelWithTooltip htmlFor="veredictoRapido" label="Veredicto Comercial Rápido" tooltip="El único block de texto corto superior para guiar la intención inmediata de compra." />
                                        <Textarea id="veredictoRapido" name="veredictoRapido" rows={3} defaultValue={fields?.veredictoRapido ?? initialData?.veredictoRapido ?? ""} className="text-sm" placeholder="Ej: Compra el Modelo A si priorizas autonomía..." />
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* 6. PUNTOS CUALITATIVOS EDITORIALES */}
                        <AccordionItem value="sec-editorial" className="border rounded-xl bg-card px-6 py-2 shadow-sm">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-3 text-left">
                                    <FileText className="w-5 h-5 text-primary" />
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">6. Puntos Editorial Clave (Pros y Contras)</h3>
                                        <p className="text-xs text-muted-foreground font-normal">Listas cortas de viñetas que el usuario lee de un vistazo rápido.</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 pb-4 border-t space-y-4">
                                <div className="space-y-4">
                                    {products.map((_, idx) => {
                                        const ed = editorials[idx] || { pros: [""], contras: [""] };
                                        return (
                                            <div key={idx} className="p-4 border rounded-xl bg-secondary/10 space-y-3">
                                                <span className="text-xs font-bold text-primary block bg-background px-2 py-1 rounded border w-fit max-w-full truncate">
                                                    {productNames[idx] || `(Falta producto)`}
                                                </span>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                                                    <div className="p-3 bg-emerald-50/20 border border-emerald-500/10 rounded-lg space-y-2">
                                                        <div className="flex items-center justify-between border-b border-emerald-500/10 pb-1">
                                                            <span className="text-[10px] font-bold text-emerald-700 uppercase">A Favor (Pros)</span>
                                                            <Button type="button" variant="ghost" size="sm" onClick={() => addPro(idx)} className="h-5 text-[10px] text-emerald-700 px-1">Añadir</Button>
                                                        </div>
                                                        {ed.pros.map((pro, pIdx) => (
                                                            <Input key={pIdx} name={`analisisEditorial[${idx}][pros][${pIdx}]`} defaultValue={pro} placeholder="Ventaja" className="h-7 text-xs bg-background" />
                                                        ))}
                                                    </div>
                                                    <div className="p-3 bg-destructive/5 border border-destructive/10 rounded-lg space-y-2">
                                                        <div className="flex items-center justify-between border-b border-destructive/10 pb-1">
                                                            <span className="text-[10px] font-bold text-destructive uppercase">En Contra (Contras)</span>
                                                            <Button type="button" variant="ghost" size="sm" onClick={() => addContra(idx)} className="h-5 text-[10px] text-destructive px-1">Añadir</Button>
                                                        </div>
                                                        {ed.contras.map((contra, cIdx) => (
                                                            <Input key={cIdx} name={`analisisEditorial[${idx}][contras][${cIdx}]`} defaultValue={contra} placeholder="Desventaja" className="h-7 text-xs bg-background" />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* 7. PREGUNTAS FRECUENTES */}
                        <AccordionItem value="sec-faqs" className="border rounded-xl bg-card px-6 py-2 shadow-sm">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-3 text-left">
                                    <HelpCircle className="w-5 h-5 text-primary" />
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">7. Módulo FAQ (Estructura de Datos)</h3>
                                        <p className="text-xs text-muted-foreground font-normal">Preguntas típicas cortas y directas para captura de clics en Google.</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 pb-4 border-t space-y-4">
                                <div className="flex justify-end">
                                    <Button type="button" variant="outline" size="sm" onClick={addFaq} className="gap-1.5 text-xs">
                                        <Plus className="w-3.5 h-3.5" /> Nueva Pregunta
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    {faqs.map((faq, idx) => (
                                        <div key={idx} className="p-4 border bg-secondary/30 rounded-xl space-y-3 relative">
                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-muted-foreground">Pregunta</label>
                                                <Input name={`faqItems[${idx}][pregunta]`} defaultValue={faq.pregunta} placeholder="¿Cuál tiene mejor batería?" className="h-8 text-xs bg-background" required />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-muted-foreground">Respuesta Directa</label>
                                                <Textarea name={`faqItems[${idx}][respuesta]`} defaultValue={faq.respuesta} rows={2} placeholder="El modelo A rinde más debido a..." className="text-xs bg-background" required />
                                            </div>
                                            <Button type="button" variant="ghost" size="sm" onClick={() => removeFaq(idx)} className="text-[10px] text-destructive h-6 font-semibold ml-auto block hover:bg-destructive/10">
                                                Remover Bloque
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                    </Accordion>
                </div>

                {/* SIDEBAR DERECHO CONTROLES (PANEL COMPACTO FLOTANTE STICKY) */}
                <aside className="space-y-6 lg:sticky lg:top-6 self-start">
                    <Card>
                        <CardHeader className="pb-3 border-b">
                            <div className="flex items-center gap-2">
                                <Settings className="w-4 h-4 text-muted-foreground" />
                                <CardTitle className="text-xs uppercase tracking-wider">Visibilidad</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4">
                            <div className="flex items-center justify-between p-3 border rounded-xl bg-secondary/40 shadow-inner">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold">Publicar en tienda</span>
                                    <span className="text-[10px] text-muted-foreground font-medium">Visible a usuarios</span>
                                </div>
                                <input type="hidden" name="isActive" value={String(isActive)} />
                                <Switch checked={isActive} onCheckedChange={setIsActive} className="scale-90" />
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-xl bg-secondary/40 shadow-inner">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold">Destacar comparativa</span>
                                    <span className="text-[10px] text-muted-foreground font-medium">Home y carruseles</span>
                                </div>
                                <input type="hidden" name="isFeatured" value={String(isFeatured)} />
                                <Switch checked={isFeatured} onCheckedChange={setIsFeatured} className="scale-90" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3 border-b">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-muted-foreground" />
                                <CardTitle className="text-xs uppercase tracking-wider">SEO Meta-Tags</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4">
                            <div className="space-y-1.5">
                                <LabelWithTooltip htmlFor="metaTitle" label="Meta Title" tooltip="Título específico para la pestaña de búsqueda (Máx 60 carac.)." />
                                <Input id="metaTitle" name="metaTitle" maxLength={60} defaultValue={fields?.metaTitle ?? initialData?.metaTitle ?? ""} className="text-xs h-8" placeholder="Título SEO sugerido" />
                            </div>
                            <div className="space-y-1.5">
                                <LabelWithTooltip htmlFor="metaDescription" label="Meta Description" tooltip="Resumen corto que indexará Google en las búsquedas (Máx 160 carac.)." />
                                <Textarea id="metaDescription" name="metaDescription" maxLength={160} rows={3} defaultValue={fields?.metaDescription ?? initialData?.metaDescription ?? ""} className="text-xs resize-none" placeholder="Descripción resumida..." />
                            </div>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
}