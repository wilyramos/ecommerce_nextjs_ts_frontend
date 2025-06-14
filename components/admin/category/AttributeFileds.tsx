"use client";

import { useState } from "react";
import type { Attribute } from "@/src/schemas";

type Props = {
    defaultAttributes?: Attribute[];
};

export default function AttributeFields({ defaultAttributes = [] }: Props) {
    const [attributes, setAttributes] = useState<Attribute[]>(
        defaultAttributes.map(attr =>
            attr.tipo === "select"
                ? { ...attr, opciones: attr.opciones ?? [""] }
                : attr
        )
    );

    const updateAttribute = (index: number, field: keyof Attribute, value: string | string[]) => {
        setAttributes(prev =>
            prev.map((attr, i) =>
                i === index ? { ...attr, [field]: value } : attr
            )
        );
    };

    const updateOption = (attrIndex: number, optIndex: number, value: string) => {
        const newOptions = [...(attributes[attrIndex].opciones || [])];
        newOptions[optIndex] = value;
        updateAttribute(attrIndex, "opciones", newOptions);
    };

    const addOption = (attrIndex: number) => {
        const newOptions = [...(attributes[attrIndex].opciones || []), ""];
        updateAttribute(attrIndex, "opciones", newOptions);
    };

    const removeOption = (attrIndex: number, optIndex: number) => {
        const newOptions = (attributes[attrIndex].opciones || []).filter((_, i) => i !== optIndex);
        updateAttribute(attrIndex, "opciones", newOptions);
    };

    const addAttribute = () => {
        setAttributes([...attributes, { nombre: "", tipo: "string" }]);
    };

    const removeAttribute = (index: number) => {
        setAttributes(attributes.filter((_, i) => i !== index));
    };

    return (
        <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-gray-700">Atributos</legend>

            {attributes.map((attr, index) => (
                <div key={index} className="space-y-2 border border-gray-300 rounded-lg p-3">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            name={`atributos[${index}].nombre`}
                            placeholder="Nombre"
                            value={attr.nombre}
                            onChange={(e) => updateAttribute(index, "nombre", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2"
                        />

                        <select
                            name={`atributos[${index}].tipo`}
                            value={attr.tipo}
                            onChange={(e) =>
                                updateAttribute(
                                    index,
                                    "tipo",
                                    e.target.value as Attribute["tipo"]
                                )
                            }
                            className="border border-gray-300 rounded-lg p-2"
                        >
                            <option value="string">Texto</option>
                            <option value="number">Número</option>
                            <option value="boolean">Sí/No</option>
                            <option value="select">Lista de opciones</option>
                        </select>
                    </div>

                    {attr.tipo === "select" && (
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">Opciones:</p>
                            {(attr.opciones || []).map((opcion, optIdx) => (
                                <div key={optIdx} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        name={`atributos[${index}].opciones[${optIdx}]`}
                                        value={opcion}
                                        onChange={(e) =>
                                            updateOption(index, optIdx, e.target.value)
                                        }
                                        className="w-full border border-gray-300 rounded p-2"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeOption(index, optIdx)}
                                        className="text-red-600 text-sm hover:underline"
                                    >
                                        Quitar
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => addOption(index)}
                                className="text-blue-600 text-sm hover:underline"
                            >
                                + Añadir opción
                            </button>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => removeAttribute(index)}
                        className="text-red-600 hover:underline text-sm"
                    >
                        Quitar atributo
                    </button>
                </div>
            ))}

            <button
                type="button"
                onClick={addAttribute}
                className="text-blue-600 hover:underline text-sm"
            >
                + Añadir atributo
            </button>
        </fieldset>
    );
}
