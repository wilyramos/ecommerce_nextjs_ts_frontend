"use client";

import { useState, useEffect } from "react";
import { Comparison, ComparisonFormValues, ComparisonSpec, ProductEditorial, ComparisonFAQ } from "@/src/schemas/comparison.schema";
import { LabelWithTooltip } from "@/components/utils/LabelWithTooltip";
import ProductReferenceSelector from "@/components/admin/shared/ProductReferenceSelector";
import { H4, Small } from "@/components/ui/Typography";
import Alert from "@/components/ui/Alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Layers, FileText, Settings, HelpCircle, Sparkles } from "lucide-react";

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

    const [specs, setSpecs] = useState<ComparisonSpec[]>(() => {
        if (fields?.especificaciones) return fields.especificaciones as ComparisonSpec[];
        if (initialData?.especificaciones) return initialData.especificaciones as ComparisonSpec[];
        return [{ key: "", values: ["", ""], category: "General", explanation: "", isKeyDifference: false }];
    });

    const [editorials, setEditorials] = useState<ProductEditorial[]>(() => {
        if (fields?.analisisEditorial) return fields.analisisEditorial as ProductEditorial[];
        if (initialData?.analisisEditorial) {
            return initialData.analisisEditorial.map(e => ({
                product: typeof e.product === "string" ? e.product : e.product._id,
                resumenIdoneidad: e.resumenIdoneidad,
                pros: e.pros,
                contras: e.contras
            })) as ProductEditorial[];
        }
        return [
            { product: "", resumenIdoneidad: "", pros: [""], contras: [""] },
            { product: "", resumenIdoneidad: "", pros: [""], contras: [""] }
        ];
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
    }, [fields]);

    useEffect(() => {
        setSpecs(prev => prev.map(spec => {
            const newValues = [...spec.values];
            while (newValues.length < products.length) newValues.push("");
            if (newValues.length > products.length) newValues.length = products.length;
            return { ...spec, values: newValues };
        }));
    }, [products.length]);

    const addProduct = () => setProducts([...products, ""]);
    const removeProduct = (idx: number) => {
        if (products.length <= 2) return;
        setProducts(products.filter((_, i) => i !== idx));
        setEditorials(editorials.filter((_, i) => i !== idx));
    };

    const addSpecRow = () => {
        setSpecs([...specs, { key: "", values: Array(products.length).fill(""), category: "General", explanation: "", isKeyDifference: false }]);
    };
    const removeSpecRow = (idx: number) => setSpecs(specs.filter((_, i) => i !== idx));

    const updateSpecIsKeyDifference = (idx: number, checked: boolean) => {
        const updated = [...specs];
        updated[idx].isKeyDifference = checked;
        setSpecs(updated);
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

    const addFaq = () => setFaqs([...faqs, { pregunta: "", respuesta: "", keywords: [] }]);
    const removeFaq = (idx: number) => setFaqs(faqs.filter((_, i) => i !== idx));

    return (
        <div className="space-y-8">
            {generalError && <Alert variant="error" mode="banner" >{generalError}</Alert>}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-8">

                    {/* Sección 1: Información Básica */}
                    <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-5">
                        <div className="flex items-center gap-2 border-b pb-3 border-border">
                            <Layers className="w-5 h-5 text-muted-foreground" />
                            <H4 className="text-sm font-bold uppercase tracking-wider text-foreground">Información Básica</H4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <LabelWithTooltip
                                    htmlFor="title"
                                    label="Título Principal"
                                    required
                                    tooltip="Título semántico e indexable por Google. Longitud óptima de 20 a 100 caracteres."
                                />
                                <Input id="title" name="title" defaultValue={fields?.title ?? initialData?.title ?? ""} className={fieldErrors?.title ? "border-destructive focus-visible:ring-destructive" : "focus-visible:ring-2"} placeholder="Ej: Comparativa iPhone 15 Pro Max vs Samsung Galaxy S24 Ultra" />
                                {fieldErrors?.title && <Small className="text-destructive font-medium block">{fieldErrors.title[0]}</Small>}
                            </div>
                            <div className="space-y-1.5">
                                <LabelWithTooltip
                                    htmlFor="slug"
                                    label="Slug de URL"
                                    tooltip="URL limpia de la comparativa. Si se deja en blanco, se genera automáticamente basado en el título."
                                />
                                <Input id="slug" name="slug" defaultValue={fields?.slug ?? initialData?.slug ?? ""} placeholder="auto-generado-si-se-deja-vacio" className="font-mono text-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Sección 2: Productos Implicados */}
                    <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-5">
                        <div className="flex items-center justify-between border-b pb-3 border-border">
                            <div className="flex items-center gap-2">
                                <Plus className="w-5 h-5 text-muted-foreground" />
                                <H4 className="text-sm font-bold uppercase tracking-wider text-foreground">Productos Implicados</H4>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={addProduct} className="gap-1.5 font-medium hover:bg-muted-neutral">
                                <Plus className="w-4 h-4" /> Añadir Producto al Catálogo
                            </Button>
                        </div>
                        {fieldErrors?.products && <Small className="text-destructive font-semibold block">{fieldErrors.products[0]}</Small>}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {products.map((prod, idx) => {
                                const rawProduct = initialData?.products?.[idx];
                                const initialProductObject = rawProduct && typeof rawProduct === "object" ? {
                                    _id: rawProduct._id,
                                    nombre: rawProduct.nombre || "",
                                    precio: typeof rawProduct.precio === "string" ? parseFloat(rawProduct.precio) : (rawProduct.precio || 0), // Conversión explícita
                                    imagenes: rawProduct.imagenes || []
                                } : null;

                                return (
                                    <div key={idx} className="flex items-start gap-3 border border-border p-4 rounded-xl bg-secondary/40 transition-all hover:border-border-hover">
                                        <div className="flex-1 space-y-1">
                                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Posición {idx + 1}</span>
                                            <input type="hidden" name={`products[${idx}]`} value={prod} />
                                            <ProductReferenceSelector
                                                label={`Buscar y Enlazar Producto ${idx + 1}`}
                                                initialId={typeof rawProduct === "string" ? rawProduct : prod}
                                                initialProduct={initialProductObject}
                                                onSelect={(id) => {
                                                    const updated = [...products];
                                                    updated[idx] = id;
                                                    setProducts(updated);

                                                    const updatedEd = [...editorials];
                                                    if (!updatedEd[idx]) updatedEd[idx] = { product: "", resumenIdoneidad: "", pros: [""], contras: [""] };
                                                    updatedEd[idx].product = id;
                                                    setEditorials(updatedEd);
                                                }}
                                            />
                                        </div>
                                        {products.length > 2 && (
                                            <Button type="button" variant="destructive" size="icon" className="mt-7 shrink-0 h-9 w-9 rounded-lg" onClick={() => removeProduct(idx)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sección 3: Contenido Estructura (SEO) */}
                    <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-5">
                        <div className="flex items-center gap-2 border-b pb-3 border-border">
                            <FileText className="w-5 h-5 text-muted-foreground" />
                            <H4 className="text-sm font-bold uppercase tracking-wider text-foreground">Contenido de la Estructura (SEO)</H4>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <LabelWithTooltip
                                    htmlFor="introduccion"
                                    label="Introducción Semántica"
                                    required
                                    tooltip="Texto introductorio optimizado para SEO semántico. Mínimo 150 caracteres."
                                />
                                <Textarea id="introduccion" name="introduccion" rows={4} defaultValue={fields?.introduccion ?? initialData?.introduccion ?? ""} className={fieldErrors?.introduccion ? "border-destructive focus-visible:ring-destructive" : ""} placeholder="Escribe un bloque introductorio robusto que enganche al usuario y contextualice la comparativa..." />
                                {fieldErrors?.introduccion && <Small className="text-destructive font-medium block">{fieldErrors.introduccion[0]}</Small>}
                            </div>
                            <div className="space-y-1.5">
                                <LabelWithTooltip
                                    htmlFor="veredictoRapido"
                                    label="Veredicto Rápido (Snippet Reutilizable)"
                                    tooltip="Resumen ejecutivo muy breve de la comparativa ideal para destacar al inicio o en bloques destacados."
                                />
                                <Textarea id="veredictoRapido" name="veredictoRapido" rows={2} defaultValue={fields?.veredictoRapido ?? initialData?.veredictoRapido ?? ""} placeholder="Ej: El iPhone destaca en video y ecosistema, mientras que el Galaxy ofrece mayor versatilidad fotográfica y autonomía." />
                            </div>
                            <div className="space-y-1.5">
                                <LabelWithTooltip
                                    htmlFor="conclusion"
                                    label="Conclusión Final Detallada"
                                    required
                                    tooltip="Cierre editorial detallado del análisis. Mínimo 150 caracteres."
                                />
                                <Textarea id="conclusion" name="conclusion" rows={4} defaultValue={fields?.conclusion ?? initialData?.conclusion ?? ""} className={fieldErrors?.conclusion ? "border-destructive focus-visible:ring-destructive" : ""} placeholder="Escribe la evaluación final, balance y recomendaciones de compra ponderando calidades y precios..." />
                                {fieldErrors?.conclusion && <Small className="text-destructive font-medium block">{fieldErrors.conclusion[0]}</Small>}
                            </div>
                        </div>
                    </div>

                    {/* Sección 4: Matriz de Especificaciones */}
                    <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-5">
                        <div className="flex items-center justify-between border-b pb-3 border-border">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-muted-foreground" />
                                <H4 className="text-sm font-bold uppercase tracking-wider text-foreground">Matriz Técnica de Especificaciones</H4>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={addSpecRow} className="gap-1.5 font-medium hover:bg-muted-neutral">
                                <Plus className="w-4 h-4" /> Añadir Fila Técnica
                            </Button>
                        </div>

                        <div className="space-y-5">
                            {specs.map((spec, idx) => (
                                <div key={idx} className="p-5 rounded-xl border bg-secondary/40 border-border space-y-4 shadow-inner">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                        <div className="space-y-1.5">
                                            <LabelWithTooltip
                                                htmlFor={`spec-key-${idx}`}
                                                label="Característica / Especificación"
                                                required
                                                tooltip="Característica técnica a evaluar (Ej: Memoria RAM, Amperaje Batería)."
                                            />
                                            <Input id={`spec-key-${idx}`} name={`especificaciones[${idx}][key]`} defaultValue={spec.key} placeholder="Ej: Pantalla Principal" required />
                                        </div>
                                        <div className="space-y-1.5">
                                            <LabelWithTooltip
                                                htmlFor={`spec-cat-${idx}`}
                                                label="Categoría de Agrupación"
                                                tooltip="Agrupación visual para el diseño web (Ej: Pantalla, Rendimiento, Cámaras)."
                                            />
                                            <Input id={`spec-cat-${idx}`} name={`especificaciones[${idx}][category]`} defaultValue={spec.category ?? "General"} placeholder="Ej: Hardware" />
                                        </div>
                                        <div className="flex items-center justify-between h-10 px-3 rounded-lg border border-input bg-background">
                                            <div className="flex items-center gap-2">
                                                <input type="hidden" name={`especificaciones[${idx}][isKeyDifference]`} value={String(spec.isKeyDifference)} />
                                                <Switch checked={spec.isKeyDifference} onCheckedChange={(checked) => updateSpecIsKeyDifference(idx, checked)} id={`spec-diff-${idx}`} />
                                                <label htmlFor={`spec-diff-${idx}`} className="text-xs font-bold text-muted-foreground cursor-pointer select-none">¿Diferencia Crítica / Clave?</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-dashed pt-4 border-border">
                                        {products.map((_, pIdx) => (
                                            <div key={pIdx} className="space-y-1.5 bg-background p-3 rounded-lg border border-border">
                                                <label className="text-xs font-bold text-muted-foreground block">
                                                    Valor Exacto para el <span className="text-foreground">Producto {pIdx + 1}</span>
                                                </label>
                                                <Input id={`spec-val-${idx}-${pIdx}`} name={`especificaciones[${idx}][values][${pIdx}]`} defaultValue={spec.values?.[pIdx] ?? ""} placeholder="Ej: 6.7 pulgadas, AMOLED, 120Hz" required className="h-9 text-sm" />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-1.5">
                                        <LabelWithTooltip
                                            htmlFor={`spec-exp-${idx}`}
                                            label="Explicación Diferencial Editorial"
                                            tooltip="Explica brevemente por qué importa este dato en el día a día para el lector."
                                        />
                                        <Textarea id={`spec-exp-${idx}`} name={`especificaciones[${idx}][explanation]`} defaultValue={spec.explanation ?? ""} rows={2} placeholder="Justificación contextualizada de la diferencia técnica..." className="text-sm shadow-inner" />
                                    </div>

                                    {specs.length > 1 && (
                                        <div className="flex justify-end border-t pt-3 border-border">
                                            <Button type="button" variant="ghost" size="sm" onClick={() => removeSpecRow(idx)} className="text-destructive hover:bg-destructive/10 hover:text-destructive gap-1 text-xs font-semibold">
                                                <Trash2 className="w-3.5 h-3.5" /> Eliminar Característica
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sección 5: Análisis Editorial por Producto */}
                    <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-5">
                        <div className="flex items-center gap-2 border-b pb-3 border-border">
                            <FileText className="w-5 h-5 text-muted-foreground" />
                            <H4 className="text-sm font-bold uppercase tracking-wider text-foreground">Análisis Editorial por Producto</H4>
                        </div>
                        {fieldErrors?.analisisEditorial && <Small className="text-destructive font-semibold block">{fieldErrors.analisisEditorial[0]}</Small>}

                        <div className="space-y-6">
                            {products.map((prodId, idx) => {
                                const ed = editorials[idx] || { resumenIdoneidad: "", pros: [""], contras: [""] };
                                return (
                                    <div key={idx} className="p-5 rounded-xl border border-border bg-secondary/40 space-y-4">
                                        <div className="flex items-center justify-between border-b pb-2 border-border">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-primary text-primary-foreground font-bold text-xs px-2.5 py-1 rounded-md shadow-sm">
                                                    Módulo Editorial {idx + 1}
                                                </div>
                                                <span className="text-xs font-mono font-medium text-muted-foreground max-w-[250px] truncate">
                                                    ID: {prodId || "Pendiente asignar"}
                                                </span>
                                            </div>
                                            <input type="hidden" name={`analisisEditorial[${idx}][product]`} value={prodId} />
                                        </div>

                                        <div className="space-y-1.5">
                                            <LabelWithTooltip
                                                htmlFor={`editorial-resumen-${idx}`}
                                                label="Resumen de Idoneidad / Target"
                                                required
                                                tooltip="Síntesis que describe a qué tipo de usuario o perfil le conviene más adquirir este producto."
                                            />
                                            <Textarea id={`editorial-resumen-${idx}`} name={`analisisEditorial[${idx}][resumenIdoneidad]`} defaultValue={ed.resumenIdoneidad} rows={2} required placeholder="Ej: Es la opción ideal para fotógrafos móviles exigentes y creadores de contenido que priorizan el ecosistema Apple..." />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            {/* Columna de Pros */}
                                            <div className="p-4 rounded-xl border border-success/30 bg-emerald-50/40 space-y-3">
                                                <div className="flex items-center justify-between border-b border-success/20 pb-1.5">
                                                    <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase block">Puntos a Favor (Pros)</span>
                                                    <Button type="button" variant="ghost" size="sm" onClick={() => addPro(idx)} className="h-7 text-xs font-bold text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 gap-1">
                                                        <Plus className="w-3.5 h-3.5" /> Añadir
                                                    </Button>
                                                </div>
                                                <div className="space-y-2">
                                                    {ed.pros.map((pro, pIdx) => (
                                                        <Input key={`pro-${idx}-${pIdx}`} name={`analisisEditorial[${idx}][pros][${pIdx}]`} defaultValue={pro} placeholder="Ej: Brillo máximo de pantalla excelente en exteriores" required className="bg-background border-emerald-200/60 text-sm h-9 focus-visible:ring-success" />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Columna de Contras */}
                                            <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5 space-y-3">
                                                <div className="flex items-center justify-between border-b border-destructive/10 pb-1.5">
                                                    <span className="text-xs font-bold text-destructive tracking-wider uppercase block">Contras / Desventajas</span>
                                                    <Button type="button" variant="ghost" size="sm" onClick={() => addContra(idx)} className="h-7 text-xs font-bold text-destructive hover:bg-destructive/10 gap-1">
                                                        <Plus className="w-3.5 h-3.5" /> Añadir
                                                    </Button>
                                                </div>
                                                <div className="space-y-2">
                                                    {ed.contras.map((contra, cIdx) => (
                                                        <Input key={`contra-${idx}-${cIdx}`} name={`analisisEditorial[${idx}][contras][${cIdx}]`} defaultValue={contra} placeholder="Ej: Carga rápida estancada en 25W" required className="bg-background border-destructive/20 text-sm h-9 focus-visible:ring-destructive" />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sección 6: Preguntas Frecuentes */}
                    <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-5">
                        <div className="flex items-center justify-between border-b pb-3 border-border">
                            <div className="flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-muted-foreground" />
                                <H4 className="text-sm font-bold uppercase tracking-wider text-foreground">Preguntas Frecuentes (FAQ Schema)</H4>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={addFaq} className="gap-1.5 font-medium hover:bg-muted-neutral">
                                <Plus className="w-4 h-4" /> Añadir FAQ
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="p-4 rounded-xl border bg-secondary/40 border-border space-y-3 transition-all">
                                    <div className="space-y-1.5">
                                        <LabelWithTooltip
                                            htmlFor={`faq-q-${idx}`} label="Pregunta Frecuente" required
                                            tooltip="Pregunta típica con alto volumen de búsqueda en Google. Mínimo 10 caracteres."
                                        />
                                        <Input id={`faq-q-${idx}`} name={`faqItems[${idx}][pregunta]`} defaultValue={faq.pregunta} required placeholder="Ej: ¿Cuál de los dos teléfonos tiene mejor batería?" className="bg-background text-sm" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <LabelWithTooltip htmlFor={`faq-a-${idx}`} label="Respuesta Estructurada" required
                                            tooltip="Resuesta directa, clara y rica en palabras clave. Mínimo 20 caracteres."
                                        />
                                        <Textarea id={`faq-a-${idx}`} name={`faqItems[${idx}][respuesta]`} defaultValue={faq.respuesta} rows={2} required placeholder="Escribe la respuesta optimizada que aparecerá enriquecida en las SERPs..." className="bg-background text-sm" />
                                    </div>
                                    <div className="flex justify-end border-t pt-2 border-border/60">
                                        <Button type="button" variant="ghost" size="sm" onClick={() => removeFaq(idx)} className="text-destructive hover:bg-destructive/10 text-xs font-semibold gap-1">
                                            <Trash2 className="w-3.5 h-3.5" /> Remover Bloque FAQ
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ASIDE BAR / SIDEBAR CONFIG */}
                <aside className="space-y-6 lg:sticky lg:top-6 self-start">
                    {/* Tarjeta de Visibilidad */}
                    <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 border-border">
                            <Settings className="w-4 h-4 text-muted-foreground" />
                            <H4 className="text-xs font-bold uppercase tracking-wider text-foreground">Publicación y Visibilidad</H4>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-secondary/40 shadow-inner">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-foreground">Publicar en tienda</span>
                                <span className="text-[10px] text-muted-foreground font-medium">Visible a usuarios</span>
                            </div>
                            <input type="hidden" name="isActive" value={String(isActive)} />
                            <Switch checked={isActive} onCheckedChange={setIsActive} />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-secondary/40 shadow-inner">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-foreground">Destacar comparativa</span>
                                <span className="text-[10px] text-muted-foreground font-medium">Home y destacados</span>
                            </div>
                            <input type="hidden" name="isFeatured" value={String(isFeatured)} />
                            <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
                        </div>
                    </div>

                    {/* Tarjeta de SEO Metatags */}
                    <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 border-border">
                            <Sparkles className="w-4 h-4 text-muted-foreground" />
                            <H4 className="text-xs font-bold uppercase tracking-wider text-foreground">SEO Meta-configuración</H4>
                        </div>
                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <LabelWithTooltip
                                    htmlFor="metaTitle" label="Meta Title"
                                    tooltip="Título específico para la etiqueta <title> en motores de búsqueda. Máx 60 caracteres."
                                />
                                <Input id="metaTitle" name="metaTitle" maxLength={60} placeholder="Título de la pestaña SEO" defaultValue={fields?.metaTitle ?? initialData?.metaTitle ?? ""} className="text-xs" />
                            </div>
                            <div className="space-y-1.5">
                                <LabelWithTooltip htmlFor="metaDescription" label="Meta Description"
                                    tooltip="Descripción resumen que indexará Google en el buscador. Máx 160 caracteres."
                                />
                                <Textarea id="metaDescription" name="metaDescription" maxLength={160} rows={3} placeholder="Descripción de los resultados de búsqueda..." defaultValue={fields?.metaDescription ?? initialData?.metaDescription ?? ""} className="text-xs resize-none" />
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}