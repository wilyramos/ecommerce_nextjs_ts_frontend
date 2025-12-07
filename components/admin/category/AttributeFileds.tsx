"use client";

import { useState } from "react";
import type { CategoryAttribute } from "@/src/schemas";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function AttributeFields({
    defaultAttributes,
}: {
    defaultAttributes?: CategoryAttribute[];
}) {
    const [attributes, setAttributes] = useState<CategoryAttribute[]>(
        defaultAttributes || []
    );

    const update = (fn: (draft: CategoryAttribute[]) => void) => {
        const draft = [...attributes];
        fn(draft);
        setAttributes(draft);
    };

    const handleAttrNameChange = (index: number, value: string) =>
        update((d) => {
            d[index].name = value;
        });

    const handleAttrValueChange = (
        attrIndex: number,
        valIndex: number,
        value: string
    ) =>
        update((d) => {
            d[attrIndex].values[valIndex] = value;
        });

    const addAttribute = () =>
        setAttributes([...attributes, { name: "", values: [""] }]);

    const removeAttribute = (index: number) =>
        update((d) => {
            d.splice(index, 1);
        });

    const addValue = (attrIndex: number) =>
        update((d) => {
            d[attrIndex].values.push("");
        });

    const removeValue = (attrIndex: number, valIndex: number) =>
        update((d) => {
            d[attrIndex].values.splice(valIndex, 1);
        });

    const handleIsVariantChange = (index: number, value: boolean) =>
        update((d) => {
            d[index].isVariant = value;
        });

    return (
        <div className="mt-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-800">Atributos</h3>

            <input type="hidden" name="attributes" value={JSON.stringify(attributes)} />

            <div className="grid gap-4 sm:grid-cols-2">
                {attributes.map((attr, i) => (
                    <div
                        key={i}
                        className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                    >
                        <div className="space-y-1">
                            <Label htmlFor={`attr-name-${i}`}>Nombre del atributo</Label>
                            <Input
                                id={`attr-name-${i}`}
                                value={attr.name}
                                onChange={(e) => handleAttrNameChange(i, e.target.value)}
                                placeholder="Ej: Color, Talla, Material..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Valores</Label>

                            {attr.values.map((val, j) => (
                                <div key={j} className="flex items-center gap-2">
                                    <Input
                                        value={val}
                                        onChange={(e) =>
                                            handleAttrValueChange(i, j, e.target.value)
                                        }
                                        placeholder="Ej: Rojo, M, Algodón..."
                                    />
                                    {attr.values.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeValue(i, j)}
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            Eliminar
                                        </Button>
                                    )}
                                </div>
                            ))}

                            <div className="flex items-center space-x-3 pt-2">
                                <Switch
                                    checked={attr.isVariant ?? false}
                                    onCheckedChange={(v) => handleIsVariantChange(i, v)}
                                />
                                <Label className="text-xs">Usar como variante</Label>
                            </div>

                            <Button
                                type="button"
                                variant="link"
                                size="sm"
                                onClick={() => addValue(i)}
                                className="text-blue-600 hover:text-blue-700"
                            >
                                + Añadir valor
                            </Button>
                        </div>

                        <div className="pt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAttribute(i)}
                                className="text-red-600 hover:text-red-700"
                            >
                                Eliminar atributo
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addAttribute}
                className="text-blue-700"
            >
                + Añadir atributo
            </Button>
        </div>
    );
}
