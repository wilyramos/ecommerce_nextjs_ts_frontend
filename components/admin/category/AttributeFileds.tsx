"use client";

import { useState } from "react";
import type { Attributes } from "@/src/schemas";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AttributeFields({
    defaultAttributes,
}: {
    defaultAttributes?: Attributes;
}) {
    const [attributes, setAttributes] = useState<Attributes>(defaultAttributes || []);

    const handleAttrNameChange = (index: number, value: string) => {
        const updated = [...attributes];
        updated[index].name = value;
        setAttributes(updated);
    };

    const handleAttrValueChange = (attrIndex: number, valIndex: number, value: string) => {
        const updated = [...attributes];
        updated[attrIndex].values[valIndex] = value;
        setAttributes(updated);
    };

    const addAttribute = () => {
        setAttributes([...attributes, { name: "", values: [""] }]);
    };

    const removeAttribute = (index: number) => {
        const updated = [...attributes];
        updated.splice(index, 1);
        setAttributes(updated);
    };

    const addValue = (attrIndex: number) => {
        const updated = [...attributes];
        updated[attrIndex].values.push("");
        setAttributes(updated);
    };

    const removeValue = (attrIndex: number, valIndex: number) => {
        const updated = [...attributes];
        updated[attrIndex].values.splice(valIndex, 1);
        setAttributes(updated);
    };

    return (
        <div className="space-y-4 mt-4">
            <h3 className="text-sm font-semibold text-gray-800">Atributos</h3>

            {/* Campo oculto para enviar al servidor */}
            <input type="hidden" name="attributes" value={JSON.stringify(attributes)} />

            <div className="grid gap-4 sm:grid-cols-2">
                {attributes.map((attr, i) => (
                    <div
                        key={i}
                        className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm space-y-4"
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
                                        onChange={(e) => handleAttrValueChange(i, j, e.target.value)}
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
