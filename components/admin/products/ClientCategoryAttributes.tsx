"use client";

import { useState, useEffect } from "react";
import type { CategoriasList } from "@/src/schemas";

type Props = {
    categorias: CategoriasList;
    initialCategoryId?: string;
    currentAttributes?: Record<string, string>;
};

export default function ClientCategoryAttributes({
    categorias,
    initialCategoryId,
    currentAttributes,
}: Props) {
    const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId || "");
    const [categoryAttributes, setCategoryAttributes] = useState<{ name: string; values: string[] }[]>([]);
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

    useEffect(() => {
        const selected = categorias.find(cat => cat._id === selectedCategoryId);

        if (!selected) {
            setCategoryAttributes([]);
            setSelectedAttributes({});
            return;
        }

        const validAttributes = selected.attributes || [];
        setCategoryAttributes(validAttributes);

        // Solo conservar los atributos válidos para la categoría seleccionada
        const filteredAttributes: Record<string, string> = {};
        if (currentAttributes) {
            for (const attr of validAttributes) {
                const value = currentAttributes[attr.name];
                if (value) {
                    filteredAttributes[attr.name] = value;
                }
            }
        }

        setSelectedAttributes(filteredAttributes);
    }, [selectedCategoryId, categorias, currentAttributes]);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategoryId(e.target.value);
    };

    const handleAttributeChange = (name: string, value: string) => {
        setSelectedAttributes(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="space-y-4">
            <div className="py-1">
                <label htmlFor="categoria" className="block font-semibold text-gray-700">Categoría</label>
                <select
                    id="categoria"
                    name="categoria"
                    className="w-full border border-gray-300 rounded-lg p-3"
                    value={selectedCategoryId}
                    onChange={handleCategoryChange}
                >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map(cat => (
                        <option key={cat._id} value={cat._id}>
                            {cat.nombre}
                        </option>
                    ))}
                </select>
            </div>

            {categoryAttributes.length > 0 && (
                <div>
                    <input
                        type="hidden"
                        name="atributos"
                        value={JSON.stringify(selectedAttributes)}
                    />

                    <h4 className="font-semibold text-gray-700 mb-2">Atributos de la categoría</h4>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {categoryAttributes.map(attr => (
                            <div key={attr.name}>
                                <label className="block font-medium text-gray-600 mb-1">{attr.name}</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg p-2"
                                    value={selectedAttributes[attr.name] || ""}
                                    onChange={(e) => handleAttributeChange(attr.name, e.target.value)}
                                >
                                    <option value="">Selecciona un valor</option>
                                    {attr.values.map(value => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
