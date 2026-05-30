// File: components/admin/category/AttributeFields.tsx
// (corregido typo en nombre de archivo: "Fileds" → "Fields")

"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import type { CategoryAttribute } from "@/src/schemas/category.schema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = { defaultAttributes?: CategoryAttribute[] };

export default function AttributeFields({ defaultAttributes }: Props) {
    const [attributes, setAttributes] = useState<CategoryAttribute[]>(
        defaultAttributes ?? []
    );

    // ─── Mutación inmutable con helper ───────────────────────────────────────

    const update = (fn: (draft: CategoryAttribute[]) => void) => {
        const draft = structuredClone(attributes);
        fn(draft);
        setAttributes(draft);
    };

    const handleNameChange = (i: number, val: string) =>
        update((d) => { d[i].name = val; });

    const handleValueChange = (i: number, j: number, val: string) =>
        update((d) => { d[i].values[j] = val; });

    const handleIsVariantChange = (i: number, val: boolean) =>
        update((d) => { d[i].isVariant = val; });

    const addAttribute = () =>
        setAttributes((prev) => [...prev, { name: "", values: [""], isVariant: false }]);

    const removeAttribute = (i: number) =>
        update((d) => { d.splice(i, 1); });

    const addValue = (i: number) =>
        update((d) => { d[i].values.push(""); });

    const removeValue = (i: number, j: number) =>
        update((d) => { d[i].values.splice(j, 1); });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">
                    Atributos
                    {attributes.length > 0 && (
                        <Badge variant="secondary" className="ml-2 font-normal">
                            {attributes.length}
                        </Badge>
                    )}
                </Label>
                <Button type="button" variant="outline" size="sm" onClick={addAttribute}>
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Añadir atributo
                </Button>
            </div>

            {/* Campo oculto que serializa los atributos para el FormData */}
            <input type="hidden" name="attributes" value={JSON.stringify(attributes)} />

            {attributes.length === 0 && (
                <p className="text-sm text-muted-foreground">
                    Sin atributos definidos. Los atributos permiten filtrar productos y definir variantes.
                </p>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
                {attributes.map((attr, i) => (
                    <Card key={i} className="relative">
                        <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                            <CardTitle className="text-sm font-medium">
                                {attr.name || `Atributo ${i + 1}`}
                            </CardTitle>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                onClick={() => removeAttribute(i)}
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span className="sr-only">Eliminar atributo</span>
                            </Button>
                        </CardHeader>

                        <CardContent className="space-y-3 px-4 pb-4">
                            {/* Nombre */}
                            <div className="space-y-1">
                                <Label htmlFor={`attr-name-${i}`} className="text-xs text-muted-foreground">
                                    Nombre del atributo
                                </Label>
                                <Input
                                    id={`attr-name-${i}`}
                                    value={attr.name}
                                    onChange={(e) => handleNameChange(i, e.target.value)}
                                    placeholder="Ej: Color, Talla..."
                                    className="h-8 text-sm"
                                />
                            </div>

                            {/* Valores */}
                            <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">Valores</Label>
                                {attr.values.map((val, j) => (
                                    <div key={j} className="flex gap-1.5">
                                        <Input
                                            value={val}
                                            onChange={(e) => handleValueChange(i, j, e.target.value)}
                                            placeholder="Ej: Rojo, M..."
                                            className="h-8 text-sm"
                                        />
                                        {attr.values.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                                                onClick={() => removeValue(i, j)}
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs px-2"
                                    onClick={() => addValue(i)}
                                >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Añadir valor
                                </Button>
                            </div>

                            {/* Switch variante */}
                            <div className="flex items-center gap-2 pt-1">
                                <Switch
                                    id={`attr-variant-${i}`}
                                    checked={attr.isVariant ?? false}
                                    onCheckedChange={(v) => handleIsVariantChange(i, v)}
                                />
                                <Label
                                    htmlFor={`attr-variant-${i}`}
                                    className="text-xs cursor-pointer"
                                >
                                    Usar como variante de producto
                                </Label>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}