"use client";

import { useState } from "react";
import { Comparison, ComparisonFormValues, ComparisonSpec } from "@/src/schemas/comparison.schema";
import Alert from "@/components/ui/Alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

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
    
    // Tipamos estrictamente el estado del array de especificaciones técnicas
    const [specs, setSpecs] = useState<ComparisonSpec[]>(() => {
        if (fields?.especificaciones) return fields.especificaciones as ComparisonSpec[];
        if (initialData?.especificaciones) return initialData.especificaciones as ComparisonSpec[];
        return [{ key: "", values: ["", ""], category: "General", isKeyDifference: false }];
    });

    const addSpecRow = () => {
        setSpecs([...specs, { key: "", values: ["", ""], category: "General", isKeyDifference: false }]);
    };

    const removeSpecRow = (index: number) => {
        setSpecs(specs.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            {generalError && (
                <Alert variant="error" mode="banner">{generalError}</Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-6">
                    
                    {/* Información Básica */}
                    <div className="p-6 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Información Básica</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[var(--color-text-primary)]">Título de la Comparativa</label>
                                <Input
                                    name="title"
                                    defaultValue={fields?.title ?? initialData?.title ?? ""}
                                    className={fieldErrors?.title ? "border-red-500 focus-visible:ring-red-500" : ""}
                                />
                                {fieldErrors?.title && (
                                    <p className="text-xs font-medium text-red-500">{fieldErrors.title[0]}</p>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-[var(--color-text-primary)]">Slug personalizado (Opcional)</label>
                                <Input
                                    name="slug"
                                    defaultValue={fields?.slug ?? initialData?.slug ?? ""}
                                    placeholder="auto-generado si se deja vacío"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contenido Editorial */}
                    <div className="p-6 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Secciones de Texto (SEO)</h3>
                        
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[var(--color-text-primary)]">Introducción</label>
                            <Textarea
                                name="introduccion"
                                rows={4}
                                defaultValue={fields?.introduccion ?? initialData?.introduccion ?? ""}
                                className={fieldErrors?.introduccion ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {fieldErrors?.introduccion && (
                                <p className="text-xs font-medium text-red-500">{fieldErrors.introduccion[0]}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[var(--color-text-primary)]">Veredicto Rápido</label>
                            <Textarea
                                name="veredictoRapido"
                                rows={2}
                                defaultValue={fields?.veredictoRapido ?? initialData?.veredictoRapido ?? ""}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[var(--color-text-primary)]">Conclusión</label>
                            <Textarea
                                name="conclusion"
                                rows={4}
                                defaultValue={fields?.conclusion ?? initialData?.conclusion ?? ""}
                                className={fieldErrors?.conclusion ? "border-red-500 focus-visible:ring-red-500" : ""}
                            />
                            {fieldErrors?.conclusion && (
                                <p className="text-xs font-medium text-red-500">{fieldErrors.conclusion[0]}</p>
                            )}
                        </div>
                    </div>

                    {/* Matriz Técnica */}
                    <div className="p-6 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Especificaciones Técnicas</h3>
                            <Button type="button" variant="outline" size="sm" onClick={addSpecRow}>
                                + Añadir Fila
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {specs.map((spec, idx) => (
                                <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-lg border bg-[var(--color-bg-secondary)] items-end">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-[var(--color-text-tertiary)]">Característica (Key)</label>
                                        <Input
                                            name={`especificaciones[${idx}][key]`}
                                            defaultValue={spec.key}
                                            placeholder="Ej: Batería"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-[var(--color-text-tertiary)]">Valor Producto 1</label>
                                        <Input
                                            name={`especificaciones[${idx}][values][0]`}
                                            defaultValue={spec.values?.[0] ?? ""}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-[var(--color-text-tertiary)]">Valor Producto 2</label>
                                        <Input
                                            name={`especificaciones[${idx}][values][1]`}
                                            defaultValue={spec.values?.[1] ?? ""}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between h-10 pb-1">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                name={`especificaciones[${idx}][isKeyDifference]`}
                                                defaultChecked={spec.isKeyDifference}
                                                value="true"
                                            />
                                            <span className="text-xs font-medium text-[var(--color-text-secondary)]">¿Diferencia Clave?</span>
                                        </div>
                                        {specs.length > 1 && (
                                            <Button type="button" variant="destructive" size="sm" onClick={() => removeSpecRow(idx)}>
                                                Remover
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <aside className="space-y-6">
                    <div className="p-6 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">Visibilidad</h3>
                        
                        <div className="flex items-center justify-between p-2 rounded-lg border bg-[var(--color-bg-secondary)]">
                            <span className="text-xs font-semibold text-[var(--color-text-primary)]">Publicar en tienda</span>
                            <Switch
                                name="isActive"
                                defaultChecked={fields?.isActive ?? initialData?.isActive ?? true}
                                value="true"
                            />
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-lg border bg-[var(--color-bg-secondary)]">
                            <span className="text-xs font-semibold text-[var(--color-text-primary)]">Comparativa Destacada</span>
                            <Switch
                                name="isFeatured"
                                defaultChecked={fields?.isFeatured ?? initialData?.isFeatured ?? false}
                                value="true"
                            />
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}