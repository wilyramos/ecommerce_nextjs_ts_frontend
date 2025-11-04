"use client";

import { useState } from "react";
import type { TApiVariant, ProductWithCategoryResponse } from "@/src/schemas";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";

interface CategoryAttr {
    name: string;
    values: string[];
}

interface Props {
    product?: ProductWithCategoryResponse;
    categoryAttributes: CategoryAttr[];
}

export default function ProductVariantsForm({ product, categoryAttributes }: Props) {
    const [variants, setVariants] = useState<TApiVariant[]>(product?.variants ?? []);

    const addVariant = (event: React.FormEvent) => {
        event.preventDefault();

        const attributes: Record<string, string> = {};
        categoryAttributes.forEach((attr) => (attributes[attr.name] = ""));

        const newVariant: TApiVariant = {
            _id: crypto.randomUUID(),
            precio: 0,
            precioComparativo: 0,
            stock: 0,
            sku: "",
            barcode: "",
            atributos: attributes,
            imagenes: [],
        };

        setVariants((prev) => [...prev, newVariant]);
    };

    const updateVariant = <K extends keyof TApiVariant>(
        index: number,
        key: K,
        value: TApiVariant[K]
    ) => {
        setVariants((prev) => {
            const next = [...prev];
            next[index] = { ...next[index], [key]: value };
            return next;
        });
    };

    const updateAttribute = (index: number, attrName: string, value: string) => {
        setVariants((prev) => {
            const next = [...prev];
            next[index] = {
                ...next[index],
                atributos: { ...next[index].atributos, [attrName]: value },
            };
            return next;
        });
    };

    const removeVariant = (index: number) =>
        setVariants((prev) => prev.filter((_, i) => i !== index));

    if (!categoryAttributes?.length) {
        return (
            <p className="text-sm text-muted-foreground">
                Selecciona una categoría con atributos para crear variantes.
            </p>
        );
    }

    return (
        <div className="space-y-4 mt-6">
            <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold">Variantes</h3>
            </div>

            <div className="space-y-4">
                {variants.map((variant, index) => (
                    <div
                        key={variant._id}
                        className="border rounded-xl p-4 bg-card shadow-sm space-y-4"
                    >
                        {/* Primera fila: atributos */}
                        <div className="flex flex-wrap gap-4">
                            {categoryAttributes.map((attr) => (
                                <div key={attr.name} className="space-y-1">
                                    <label className="text-xs font-medium">{attr.name}</label>
                                    <Select
                                        value={variant.atributos[attr.name] ?? ""}
                                        onValueChange={(val) => updateAttribute(index, attr.name, val)}
                                    >
                                        <SelectTrigger className="h-9">
                                            <SelectValue placeholder="Elegir" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {attr.values.map((val) => (
                                                <SelectItem key={val} value={val}>
                                                    {val}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ))}
                        </div>

                        {/* Segunda fila: campos generales */}
                        {/* Segunda fila: campos generales con labels */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-start">

                            <div className="space-y-1">
                                <label className="text-xs font-medium">Precio</label>
                                <Input
                                    className="h-9"
                                    type="number"
                                    value={variant.precio}
                                    onChange={(e) => updateVariant(index, "precio", Number(e.target.value))}
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium">Precio Comparativo</label>
                                <Input
                                    className="h-9"
                                    type="number"
                                    value={variant.precioComparativo}
                                    onChange={(e) =>
                                        updateVariant(index, "precioComparativo", Number(e.target.value))
                                    }
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium">Stock</label>
                                <Input
                                    className="h-9"
                                    type="number"
                                    value={variant.stock}
                                    onChange={(e) => updateVariant(index, "stock", Number(e.target.value))}
                                    placeholder="0"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium">SKU</label>
                                <Input
                                    className="h-9"
                                    value={variant.sku}
                                    onChange={(e) => updateVariant(index, "sku", e.target.value)}
                                    placeholder="SKU"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium">Barcode</label>
                                <Input
                                    className="h-9"
                                    value={variant.barcode}
                                    onChange={(e) => updateVariant(index, "barcode", e.target.value)}
                                    placeholder="Código de barras"
                                />
                            </div>

                            <div className="flex justify-end items-end pb-0.5">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeVariant(index)}
                                    className="text-red-500"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </div>

                        </div>

                    </div>
                ))}
            </div>

            {/* Hidden input para el form */}
            <input type="hidden" name="variants" value={JSON.stringify(variants)} />

            <Button onClick={addVariant} size="sm" className="gap-1">
                <Plus className="w-4 h-4" /> Añadir variante
            </Button>
        </div>
    );
}
