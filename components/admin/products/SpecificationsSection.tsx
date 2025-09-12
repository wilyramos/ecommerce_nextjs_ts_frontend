"use client";
import { useState } from "react";

type SpecItem = { key: string; value: string };

type Props = {
    /** Lista inicial de especificaciones, por ejemplo [{ key:"Color", value:"Rojo" }] */
    initial?: SpecItem[];
};

export default function SpecificationsSection({ initial = [] }: Props) {
    // Estado: arreglo de objetos { key, value }
    const [items, setItems] = useState<SpecItem[]>(
        initial.length ? initial : [{ key: "", value: "" }]
    );

    // Mantener input hidden sincronizado
    const jsonString = JSON.stringify(
        items.filter((item) => item.key.trim() !== "")
    );

    const updateItem = (idx: number, field: "key" | "value", value: string) => {
        const newItems = [...items];
        newItems[idx] = { ...newItems[idx], [field]: value };
        setItems(newItems);
    };

    const addRow = () => setItems([...items, { key: "", value: "" }]);
    const removeRow = (idx: number) =>
        setItems(items.filter((_, i) => i !== idx));

    return (
        <div className="py-2">
            <label className="block font-semibold text-gray-700 mb-1">
                Especificaciones
            </label>

            {items.map((item, i) => (
                <div key={i} className="flex gap-2 mb-2">
                    <input
                        type="text"
                        placeholder="Clave"
                        className="border rounded p-2 w-1/2"
                        value={item.key}
                        onChange={(e) => updateItem(i, "key", e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Valor"
                        className="border rounded p-2 w-1/2"
                        value={item.value}
                        onChange={(e) => updateItem(i, "value", e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => removeRow(i)}
                        className="text-red-500 font-bold"
                    >
                        ×
                    </button>
                </div>
            ))}

            <button
                type="button"
                onClick={addRow}
                className="mt-2 px-3 py-1 bg-gray-200 rounded"
            >
                + Añadir
            </button>

            {/* Campo oculto para enviar en FormData o request */}
            <input type="hidden" name="especificaciones" value={jsonString} />
        </div>
    );
}
