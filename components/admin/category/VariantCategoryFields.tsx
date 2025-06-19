"use client";

import { useEffect, useState } from "react";
import type { VariantCategory } from "@/src/schemas";

export default function VariantCategoryFields({ defaultVariants }: { defaultVariants?: VariantCategory[] }) {


    const [variants, setVariants] = useState<VariantCategory[]>(
        defaultVariants || []
    );

    const handleVariantNameChange = (index: number, value: string) => {
        const updated = [...variants];
        updated[index].name = value;
        setVariants(updated);
    };

    const handleVariantValueChange = (varIndex: number, valIndex: number, value: string) => {
        const updated = [...variants];
        updated[varIndex].values[valIndex] = value;
        setVariants(updated);
    };

    const addVariantCategory = () => {
        setVariants([...variants, { name: "", values: [""] }]);
    };

    const removeVariantCategory = (index: number) => {
        const updated = [...variants];
        updated.splice(index, 1);
        setVariants(updated);
    };

    const addVariantValue = (varIndex: number) => {
        const updated = [...variants];
        updated[varIndex].values.push("");
        setVariants(updated);
    };

    const removeVariantValue = (varIndex: number, valIndex: number) => {
        const updated = [...variants];
        updated[varIndex].values.splice(valIndex, 1);
        setVariants(updated);
    };

    return (
        <div className="space-y-4 mt-2">
            <h3 className="text-sm font-semibold text-gray-700">Variantes</h3>

            <input type="hidden" name="variants" value={JSON.stringify(variants)} />

            {variants.length > 0 &&
                variants.map((variant, i) => (
                    <div
                        key={i}
                        className="border border-gray-300 rounded-md p-4 space-y-4 bg-white shadow-sm"
                    >
                        <div>
                            <label className="block mb-1">Nombre de la variante</label>
                            <input
                                type="text"
                                value={variant.name}
                                onChange={(e) => handleVariantNameChange(i, e.target.value)}
                                placeholder="Ej: Talla, Color, Material"
                                className="w-full border border-gray-300 rounded-2xl px-3 py-2 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block mb-1">Valores</label>
                            <div className="space-y-2">
                                {variant.values.map((val, j) => (
                                    <div key={j} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={val}
                                            onChange={(e) => handleVariantValueChange(i, j, e.target.value)}
                                            className="flex-1 border border-gray-300 rounded-full px-3 py-1 text-sm"
                                            placeholder="Ej: Rojo, L, 100% algodón"
                                        />
                                        {variant.values.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeVariantValue(i, j)}
                                                className="text-red-500 text-xs hover:underline"
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addVariantValue(i)}
                                    className="text-blue-600 text-xs hover:underline"
                                >
                                    + Añadir valor
                                </button>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => removeVariantCategory(i)}
                            className="text-red-600 text-xs hover:underline"
                        >
                            Eliminar variante
                        </button>
                    </div>
                ))}

            <button
                type="button"
                onClick={addVariantCategory}
                className="text-blue-600 text-sm hover:underline"
            >
                + Añadir variante
            </button>
        </div>
    );
}