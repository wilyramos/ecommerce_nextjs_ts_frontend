"use client";

import { useEffect, useState } from "react";
import type { Attributes } from "@/src/schemas";


export default function AttributeFields({ defaultAttributes }: { defaultAttributes?: Attributes }) {
    const [attributes, setAttributes] = useState<Attributes>(
        defaultAttributes || [{ name: "", values: [""] }]
    );

    useEffect(() => {
        // Si no hay atributos, asegurarse de que siempre haya al menos uno
        if (attributes.length === 0) {
            setAttributes([{ name: "", values: [""] }]);
        }
    }, [attributes]);

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
        <div className="space-y-4 mt-6">
            <h3 className="text-sm font-semibold text-gray-700">Atributos</h3>

            {/* Campo oculto que será enviado al servidor */}
            <input type="hidden" name="attributes" value={JSON.stringify(attributes)} />

            {attributes.map((attr, i) => (
                <div key={i} className="border border-gray-300 rounded-md p-4 space-y-4 bg-white shadow-sm">
                    <div>
                        <label className="block mb-1">Nombre del atributo</label>
                        <input
                            type="text"
                            value={attr.name}
                            onChange={(e) => handleAttrNameChange(i, e.target.value)}
                            placeholder="Ej: Color, Talla, Material, etc."
                            className="w-full border border-gray-300 rounded-2xl px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Valores</label>
                        <div className="space-y-2">
                            {attr.values.map((val, j) => (
                                <div key={j} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={val}
                                        onChange={(e) => handleAttrValueChange(i, j, e.target.value)}
                                        className="flex-1 border border-gray-300 rounded-full px-3 py-1 text-sm"
                                        placeholder="Ej: Rojo, M, Algodón, etc."
                                    />
                                    {attr.values.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeValue(i, j)}
                                            className="text-red-500 text-xs hover:underline"
                                        >
                                            Eliminar
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addValue(i)}
                                className="text-blue-600 text-xs hover:underline"
                            >
                                + Añadir valor
                            </button>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => removeAttribute(i)}
                        className="text-red-600 text-xs hover:underline"
                    >
                        Eliminar atributo
                    </button>
                </div>
            ))}

            <button
                type="button"
                onClick={addAttribute}
                className="text-blue-600 text-sm hover:underline"
            >
                + Añadir atributo
            </button>
        </div>
    );
}