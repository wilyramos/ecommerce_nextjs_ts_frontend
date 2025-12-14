"use client";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import type { KeyboardEvent, ClipboardEvent, ChangeEvent } from "react";

type SpecItem = { key: string; value: string };

type Props = {
    initial?: SpecItem[];
};

export default function SpecificationsSection({ initial = [] }: Props) {
    const [items, setItems] = useState<SpecItem[]>(
        initial.length ? initial : [{ key: "", value: "" }]
    );

    const jsonString = JSON.stringify(items.filter((item) => item.key.trim() !== ""));

    const updateItem = (idx: number, field: "key" | "value", value: string) => {
        const newItems = [...items];
        newItems[idx] = { ...newItems[idx], [field]: value };
        setItems(newItems);
    };

    const addRow = (atIndex?: number) => {
        const newItems = [...items];
        const newRow = { key: "", value: "" };
        if (atIndex !== undefined) newItems.splice(atIndex + 1, 0, newRow);
        else newItems.push(newRow);
        setItems(newItems);
    };

    const removeRow = (idx: number) => setItems(items.filter((_, i) => i !== idx));

    // --- Manejo de pegado desde tabla o texto con ":" ---
    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text");
        const lines = pasteData.split("\n").filter((line) => line.trim() !== "");

        const newItems: SpecItem[] = lines
            .map((line) => {
                let key = "";
                let value = "";

                if (line.includes("|")) {
                    const parts = line.split("|").map((p) => p.trim()).filter(Boolean);
                    if (parts.length >= 2) {
                        key = parts[0];
                        value = parts[1];
                    }
                } else if (line.includes("\t")) {
                    const parts = line.split("\t");
                    if (parts.length >= 2) {
                        key = parts[0].trim();
                        value = parts[1].trim();
                    }
                } else if (line.includes(":")) {
                    const [k, ...v] = line.split(":");
                    key = k.trim();
                    value = v.join(":").trim();
                }

                if (key.toLowerCase() === "característica" && value.toLowerCase() === "especificación")
                    return null;

                return { key, value };
            })
            .filter((item): item is SpecItem => item !== null && item.key.trim() !== "");

        if (newItems.length > 0) setItems([...items, ...newItems]);
    };

    // --- Manejo de Enter para nueva fila ---
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addRow(index);
        }
    };

    // --- Manejo automático del ":" al escribir ---
    const handleChange = (e: ChangeEvent<HTMLInputElement>, idx: number, field: "key" | "value") => {
        const value = e.target.value;

        // Si el usuario está escribiendo en "key" y pone ":", dividimos automáticamente
        if (field === "key" && value.includes(":")) {
            const [k, ...v] = value.split(":");
            const key = k.trim();
            const val = v.join(":").trim();
            const newItems = [...items];
            newItems[idx] = { key, value: val };
            setItems(newItems);
        } else {
            updateItem(idx, field, value);
        }
    };

    return (
        <div className="py-2 border p-2">
            <Label className="mb-2">Especificaciones: </Label>

            {items.map((item, i) => (
                <div key={i} className="flex ">
                    <input
                        type="text"
                        placeholder="Clave"
                        className="border-2  p-2 w-1/2 font-bold text-gray-600"
                        value={item.key}
                        onChange={(e) => handleChange(e, i, "key")}
                        onPaste={handlePaste}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                    />
                    <input
                        type="text"
                        placeholder="Valor"
                        className="border-2  p-2 w-1/2 "
                        value={item.value}
                        onChange={(e) => handleChange(e, i, "value")}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                    />
                    <button
                        type="button"
                        onClick={() => removeRow(i)}
                        className="text-red-500 font-bold px-2"
                    >
                        ×
                    </button>
                </div>
            ))}

            <input type="hidden" name="especificaciones" value={jsonString} />
        </div>
    );
}
