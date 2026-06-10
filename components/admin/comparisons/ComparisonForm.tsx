// File: frontend/src/components/admin/ComparisonForm.tsx
"use client";

import { useState, useEffect } from "react";
import {
    Comparison,
    ComparisonFormValues,
    ComparisonSpec,
    ComparisonFAQ,
} from "@/src/schemas/comparison.schema";
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
import { Plus, Trash2, Layers, FileText, Settings, HelpCircle, Sparkles, BarChart3 } from "lucide-react";

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

    // ── Estado ────────────────────────────────────────────

    const [isActive, setIsActive] = useState<boolean>(
        () => fields?.isActive ?? initialData?.isActive ?? true
    );
    const [isFeatured, setIsFeatured] = useState<boolean>(
        () => fields?.isFeatured ?? initialData?.isFeatured ?? false
    );

    const [products, setProducts] = useState<string[]>(() => {
        if (fields?.products) return fields.products as string[];
        if (initialData?.products) {
            return initialData.products.map(p =>
                typeof p === "string" ? p : p._id
            ) as string[];
        }
        return ["", ""];
    });

    const [productNames, setProductNames] = useState<Record<number, string>>(() => {
        const map: Record<number, string> = {};
        if (initialData?.products) {
            initialData.products.forEach((p, idx) => {
                if (p && typeof p === "object" && p.nombre) map[idx] = p.nombre;
            });
        }
        return map;
    });

    const [specs, setSpecs] = useState<ComparisonSpec[]>(() => {
        if (fields?.especificaciones) return fields.especificaciones as ComparisonSpec[];
        if (initialData?.especificaciones) return initialData.especificaciones as ComparisonSpec[];
        return [{
            key: "",
            values: ["", ""],
            scores: [80, 80],
            isKeyDifference: false
        }];
    });

    const [faqs, setFaqs] = useState<ComparisonFAQ[]>(() => {
        if (fields?.faqItems) return fields.faqItems as ComparisonFAQ[];
        if (initialData?.faqItems) return initialData.faqItems as ComparisonFAQ[];
        return [];
    });

    // ── Sincronización al cambiar número de productos ─────

    useEffect(() => {
        if (!fields) return;
        if (fields.products)         setProducts(fields.products as string[]);
        if (fields.especificaciones) setSpecs(fields.especificaciones as ComparisonSpec[]);
        if (fields.faqItems)         setFaqs(fields.faqItems as ComparisonFAQ[]);
    }, [fields]);

    useEffect(() => {
        const n = products.length;
        setSpecs(prev => prev.map(spec => {
            const values = [...spec.values];
            const scores = [...spec.scores];
            while (values.length < n) values.push("");
            while (scores.length < n) scores.push(80);
            values.length = n;
            scores.length = n;
            return { ...spec, values, scores };
        }));
    }, [products.length]);

    // ── Handlers: productos ───────────────────────────────

    const addProduct = () => setProducts(p => [...p, ""]);

    const removeProduct = (idx: number) => {
        if (products.length <= 2) return;
        setProducts(p => p.filter((_, i) => i !== idx));
        setProductNames(prev => {
            const copy = { ...prev };
            delete copy[idx];
            const reindexed: Record<number, string> = {};
            Object.entries(copy).forEach(([k, v]) => {
                const ki = Number(k);
                reindexed[ki > idx ? ki - 1 : ki] = v;
            });
            return reindexed;
        });
    };

    // ── Handlers: specs ───────────────────────────────────

    const addSpec = () => setSpecs(prev => [
        ...prev,
        { key: "", values: Array(products.length).fill(""), scores: Array(products.length).fill(80), isKeyDifference: false }
    ]);

    const removeSpec = (idx: number) => setSpecs(prev => prev.filter((_, i) => i !== idx));

    const updateSpecKey = (idx: number, value: string) => {
        setSpecs(prev => prev.map((s, i) => i === idx ? { ...s, key: value } : s));
    };

    const updateSpecValue = (specIdx: number, prodIdx: number, value: string) => {
        setSpecs(prev => prev.map((s, i) => {
            if (i !== specIdx) return s;
            const values = [...s.values];
            values[prodIdx] = value;
            return { ...s, values };
        }));
    };

    const updateSpecScore = (specIdx: number, prodIdx: number, value: number) => {
        setSpecs(prev => prev.map((s, i) => {
            if (i !== specIdx) return s;
            const scores = [...s.scores];
            scores[prodIdx] = Math.min(100, Math.max(0, value));
            return { ...s, scores };
        }));
    };

    const updateSpecIsKeyDifference = (idx: number, checked: boolean) => {
        setSpecs(prev => prev.map((s, i) => i === idx ? { ...s, isKeyDifference: checked } : s));
    };

    // ── Handlers: FAQs ────────────────────────────────────

    const addFaq    = () => setFaqs(prev => [...prev, { pregunta: "", respuesta: "" }]);
    const removeFaq = (idx: number) => setFaqs(prev => prev.filter((_, i) => i !== idx));

    // ── Render ────────────────────────────────────────────

    return (
        <div className="space-y-8">
            {generalError && <Alert variant="error" mode="banner">{generalError}</Alert>}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* ── COLUMNA PRINCIPAL ── */}
                <div className="lg:col-span-3">
                    <Accordion type="multiple" defaultValue={["sec-products", "sec-general"]} className="space-y-4">

                        {/* 1. PRODUCTOS */}
                        <AccordionItem value="sec-products" className="border border-border rounded-xl bg-card px-6 py-2 shadow-sm">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-3 text-left">
                                    <FileText className="w-5 h-5 text-primary" />
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-primary">1. Productos a comparar</h3>
                                        <p className="text-xs text-muted-foreground font-normal">Mínimo 2 productos del catálogo.</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 pb-4 border-t border-border space-y-4">
                                <div className="flex justify-end">
                                    <Button type="button" variant="outline" size="sm" onClick={addProduct} className="gap-1.5 text-xs">
                                        <Plus className="w-3.5 h-3.5" /> Añadir producto
                                    </Button>
                                </div>
                                {fieldErrors?.products && (
                                    <Alert variant="error">{fieldErrors.products[0]}</Alert>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {products.map((prod, idx) => {
                                        const raw = initialData?.products?.[idx];
                                        const initialObj = raw && typeof raw === "object" ? {
                                            _id: raw._id,
                                            nombre: raw.nombre || "",
                                            precio: typeof raw.precio === "string" ? parseFloat(raw.precio) : (raw.precio || 0),
                                            imagenes: raw.imagenes || []
                                        } : null;

                                        return (
                                            <div key={idx} className="flex items-start gap-3 border border-border p-4 rounded-xl bg-muted-neutral relative">
                                                <div className="flex-1 space-y-1">
                                                    <span className="text-xs font-bold text-primary block mb-1 truncate">
                                                        {productNames[idx] || `Producto ${idx + 1}`}
                                                    </span>
                                                    <input type="hidden" name={`products[${idx}]`} value={prod} />
                                                    <ProductReferenceSelector
                                                        label=""
                                                        initialId={typeof raw === "string" ? raw : prod}
                                                        initialProduct={initialObj}
                                                        onProductData={(obj) => {
                                                            if (obj) setProductNames(prev => ({ ...prev, [idx]: obj.nombre }));
                                                        }}
                                                        onSelect={(id) => {
                                                            setProducts(prev => {
                                                                const updated = [...prev];
                                                                updated[idx] = id;
                                                                return updated;
                                                            });
                                                            if (!id) setProductNames(prev => {
                                                                const copy = { ...prev };
                                                                delete copy[idx];
                                                                return copy;
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                {products.length > 2 && (
                                                    <Button type="button" variant="destructive" size="icon"
                                                        className="mt-2 shrink-0 h-8 w-8 rounded-lg"
                                                        onClick={() => removeProduct(idx)}>
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* 2. TÍTULOS */}
                        <AccordionItem value="sec-general" className="border border-border rounded-xl bg-card px-6 py-2 shadow-sm">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-3 text-left">
                                    <Layers className="w-5 h-5 text-primary" />
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-primary">2. Título e identificadores</h3>
                                        <p className="text-xs text-muted-foreground font-normal">Título principal y veredicto rápido.</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 pb-4 border-t border-border space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <LabelWithTooltip htmlFor="title" label="Título principal" required tooltip="Entre 10 y 100 caracteres." />
                                        <Input id="title" name="title"
                                            defaultValue={fields?.title ?? initialData?.title ?? ""}
                                            className="h-9 border-border"
                                            placeholder="Ej: Sony WH-1000XM5 vs Bose QC45" />
                                        {fieldErrors?.title && (
                                            <Small className="text-destructive font-medium block">{fieldErrors.title[0]}</Small>
                                        )}
                                    </div>
                                    <div className="space-y-1.5">
                                        <LabelWithTooltip htmlFor="slug" label="Slug de URL" tooltip="Dejar vacío para generación automática." />
                                        <Input id="slug" name="slug"
                                            defaultValue={fields?.slug ?? initialData?.slug ?? ""}
                                            placeholder="sony-xm5-vs-bose-qc45"
                                            className="font-mono text-sm h-9 border-border" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <LabelWithTooltip htmlFor="veredictoRapido" label="Veredicto rápido" required tooltip="Resumen directo de quién gana y por qué. Máx 300 caracteres." />
                                    <Textarea id="veredictoRapido" name="veredictoRapido" rows={2}
                                        defaultValue={fields?.veredictoRapido ?? initialData?.veredictoRapido ?? ""}
                                        className="text-sm border-border"
                                        placeholder="Ej: Sony lidera en ANC y audio; Bose en comodidad y llamadas." />
                                    {fieldErrors?.veredictoRapido && (
                                        <Small className="text-destructive font-medium block">{fieldErrors.veredictoRapido[0]}</Small>
                                    )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* 3. ESPECIFICACIONES + SCORES */}
                        <AccordionItem value="sec-specs" className="border border-border rounded-xl bg-card px-6 py-2 shadow-sm">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-3 text-left">
                                    <BarChart3 className="w-5 h-5 text-primary" />
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-primary">3. Especificaciones y scores</h3>
                                        <p className="text-xs text-muted-foreground font-normal">Valores para la tabla comparativa y puntuaciones (0–100) para el radar.</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 pb-4 border-t border-border space-y-4">
                                <div className="flex justify-end">
                                    <Button type="button" variant="outline" size="sm" onClick={addSpec} className="gap-1.5 text-xs">
                                        <Plus className="w-3.5 h-3.5" /> Añadir fila
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                    {specs.map((spec, sIdx) => (
                                        <div key={sIdx} className="p-4 border border-border rounded-xl bg-muted-neutral space-y-3 relative shadow-sm">

                                            {/* Cabecera de la fila */}
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 space-y-1">
                                                    <label className="text-[11px] font-medium text-muted-foreground">Característica</label>
                                                    <Input
                                                        name={`especificaciones[${sIdx}][key]`}
                                                        value={spec.key}
                                                        onChange={e => updateSpecKey(sIdx, e.target.value)}
                                                        placeholder="Ej: Batería"
                                                        className="h-8 text-xs border-border"
                                                        required
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2 h-8 px-3 border border-border rounded bg-card mt-5">
                                                    <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">Diferencia clave</span>
                                                    <input type="hidden" name={`especificaciones[${sIdx}][isKeyDifference]`} value={String(spec.isKeyDifference)} />
                                                    <Switch
                                                        checked={spec.isKeyDifference}
                                                        onCheckedChange={checked => updateSpecIsKeyDifference(sIdx, checked)}
                                                        className="scale-75"
                                                    />
                                                </div>
                                                {specs.length > 1 && (
                                                    <Button type="button" variant="ghost" size="icon"
                                                        onClick={() => removeSpec(sIdx)}
                                                        className="mt-5 h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                )}
                                            </div>

                                            {/* Valores y scores por producto */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                                {products.map((_, pIdx) => (
                                                    <div key={pIdx} className="bg-card p-3 rounded border border-border space-y-2">
                                                        <span className="text-[10px] font-semibold text-muted-foreground block truncate">
                                                            {productNames[pIdx] || `Producto ${pIdx + 1}`}
                                                        </span>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] text-muted-foreground">Valor (tabla)</label>
                                                            <Input
                                                                name={`especificaciones[${sIdx}][values][${pIdx}]`}
                                                                value={spec.values[pIdx] ?? ""}
                                                                onChange={e => updateSpecValue(sIdx, pIdx, e.target.value)}
                                                                placeholder="Ej: 30h"
                                                                className="h-7 text-xs border-border"
                                                                required
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] text-muted-foreground">Score radar (0–100)</label>
                                                            <Input
                                                                type="number"
                                                                name={`especificaciones[${sIdx}][scores][${pIdx}]`}
                                                                value={spec.scores[pIdx] ?? 80}
                                                                onChange={e => updateSpecScore(sIdx, pIdx, parseInt(e.target.value, 10) || 0)}
                                                                min={0}
                                                                max={100}
                                                                className="h-7 text-xs border-border"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* 4. FAQs */}
                        <AccordionItem value="sec-faqs" className="border border-border rounded-xl bg-card px-6 py-2 shadow-sm">
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-3 text-left">
                                    <HelpCircle className="w-5 h-5 text-primary" />
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-primary">4. Preguntas frecuentes</h3>
                                        <p className="text-xs text-muted-foreground font-normal">Para SEO y featured snippets en Google.</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 pb-4 border-t border-border space-y-4">
                                <div className="flex justify-end">
                                    <Button type="button" variant="outline" size="sm" onClick={addFaq} className="gap-1.5 text-xs">
                                        <Plus className="w-3.5 h-3.5" /> Nueva pregunta
                                    </Button>
                                </div>
                                {faqs.length === 0 && (
                                    <p className="text-xs text-muted-foreground text-center py-4">
                                        Sin preguntas aún. Añade al menos una para mejorar el SEO.
                                    </p>
                                )}
                                <div className="space-y-3">
                                    {faqs.map((faq, idx) => (
                                        <div key={idx} className="p-4 border border-border bg-muted-neutral rounded-xl space-y-3 relative">
                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-muted-foreground">Pregunta</label>
                                                <Input
                                                    name={`faqItems[${idx}][pregunta]`}
                                                    defaultValue={faq.pregunta}
                                                    placeholder="¿Cuál tiene mejor batería?"
                                                    className="h-8 text-xs bg-card border-border"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-medium text-muted-foreground">Respuesta</label>
                                                <Textarea
                                                    name={`faqItems[${idx}][respuesta]`}
                                                    defaultValue={faq.respuesta}
                                                    rows={2}
                                                    placeholder="El Sony XM5 con 30h supera al Bose QC45..."
                                                    className="text-xs bg-card border-border"
                                                    required
                                                />
                                            </div>
                                            <Button type="button" variant="ghost" size="sm"
                                                onClick={() => removeFaq(idx)}
                                                className="text-[10px] text-destructive h-6 font-semibold ml-auto block hover:bg-destructive/10">
                                                Eliminar
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                    </Accordion>
                </div>

                {/* ── SIDEBAR ── */}
                <aside className="space-y-6 lg:sticky lg:top-6 self-start">

                    <Card className="border-border">
                        <CardHeader className="pb-3 border-b border-border">
                            <div className="flex items-center gap-2">
                                <Settings className="w-4 h-4 text-muted-foreground" />
                                <CardTitle className="text-xs uppercase tracking-wider">Visibilidad</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4">
                            <div className="flex items-center justify-between p-3 border border-border rounded-xl bg-muted-neutral">
                                <div>
                                    <span className="text-xs font-bold block">Publicar</span>
                                    <span className="text-[10px] text-muted-foreground">Visible en tienda</span>
                                </div>
                                <input type="hidden" name="isActive" value={String(isActive)} />
                                <Switch checked={isActive} onCheckedChange={setIsActive} className="scale-90" />
                            </div>
                            <div className="flex items-center justify-between p-3 border border-border rounded-xl bg-muted-neutral">
                                <div>
                                    <span className="text-xs font-bold block">Destacar</span>
                                    <span className="text-[10px] text-muted-foreground">Home y carruseles</span>
                                </div>
                                <input type="hidden" name="isFeatured" value={String(isFeatured)} />
                                <Switch checked={isFeatured} onCheckedChange={setIsFeatured} className="scale-90" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border">
                        <CardHeader className="pb-3 border-b border-border">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-muted-foreground" />
                                <CardTitle className="text-xs uppercase tracking-wider">SEO</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4">
                            <div className="space-y-1.5">
                                <LabelWithTooltip htmlFor="metaDescription" label="Meta description" tooltip="Máx 160 caracteres. Se genera automáticamente si se deja vacío." />
                                <Textarea
                                    id="metaDescription"
                                    name="metaDescription"
                                    maxLength={160}
                                    rows={3}
                                    defaultValue={fields?.metaDescription ?? initialData?.metaDescription ?? ""}
                                    className="text-xs resize-none border-border"
                                    placeholder="Comparativa técnica entre Sony XM5 y Bose QC45..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                </aside>
            </div>
        </div>
    );
}