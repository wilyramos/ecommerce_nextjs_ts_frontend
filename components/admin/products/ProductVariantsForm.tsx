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
    // ✅ Estado tipado correctamente
    const [variants, setVariants] = useState<TApiVariant[]>(product?.variants ?? []);

    const addVariant = (event: React.FormEvent) => {
        // Prevent default behavior
        event.preventDefault();
        // ✅ Construimos atributos con tipo seguro
        const attributes: Record<string, string> = {};
        categoryAttributes.forEach((attr) => {
            attributes[attr.name] = "";
        });

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

    // ✅ Updating variante completo sin any
    const updateVariant = <K extends keyof TApiVariant>(
        index: number,
        key: K,
        value: TApiVariant[K]
    ) => {
        setVariants((prev) => {
            const newArr = [...prev];
            newArr[index] = { ...newArr[index], [key]: value };
            return newArr;
        });
    };

    // ✅ Updating atributo tipado
    const updateAttribute = (index: number, attrName: string, value: string) => {
        setVariants((prev) => {
            const newArr = [...prev];
            newArr[index] = {
                ...newArr[index],
                atributos: {
                    ...newArr[index].atributos,
                    [attrName]: value,
                },
            };
            return newArr;
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
        <div className="space-y-3 mt-6">
            <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold">Variantes</h3>
            </div>

            <div className="rounded-xl border bg-card shadow-sm overflow-x-auto">
                <table className="w-full text-sm min-w-[950px]">
                    <thead className="bg-muted/30">
                        <tr>
                            {categoryAttributes.map((attr) => (
                                <th key={attr.name} className="p-2 text-left font-medium">
                                    {attr.name}
                                </th>
                            ))}

                            <th className="p-2 font-medium text-left">Precio</th>
                            <th className="p-2 font-medium text-left">Precio Comp.</th>
                            <th className="p-2 font-medium text-left">Stock</th>
                            <th className="p-2 font-medium text-left">SKU</th>
                            <th className="p-2 font-medium text-left">Barcode</th>
                            <th className="p-2" />
                        </tr>
                    </thead>

                    <tbody>
                        {variants.map((variant, index) => (
                            <tr key={variant._id} className="border-t hover:bg-muted/20 transition">
                                {categoryAttributes.map((attr) => (
                                    <td key={attr.name} className="p-2">
                                        <Select
                                            value={variant.atributos[attr.name] ?? ""}
                                            onValueChange={(val) => updateAttribute(index, attr.name, val)}
                                        >
                                            <SelectTrigger className="h-9">
                                                <SelectValue placeholder={`Elegir`} />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {attr.values.map((val) => (
                                                    <SelectItem key={val} value={val}>
                                                        {val}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </td>
                                ))}

                                <td className="p-2">
                                    <Input
                                        className="h-9"
                                        type="number"
                                        value={variant.precio}
                                        onChange={(e) =>
                                            updateVariant(index, "precio", Number(e.target.value))
                                        }
                                    />
                                </td>

                                <td className="p-2">
                                    <Input
                                        className="h-9"
                                        type="number"
                                        value={variant.precioComparativo}
                                        onChange={(e) =>
                                            updateVariant(index, "precioComparativo", Number(e.target.value))
                                        }
                                    />
                                </td>

                                <td className="p-2">
                                    <Input
                                        className="h-9"
                                        type="number"
                                        value={variant.stock}
                                        onChange={(e) =>
                                            updateVariant(index, "stock", Number(e.target.value))
                                        }
                                    />
                                </td>

                                <td className="p-2">
                                    <Input
                                        className="h-9"
                                        value={variant.sku}
                                        onChange={(e) => updateVariant(index, "sku", e.target.value)}
                                    />
                                </td>

                                <td className="p-2">
                                    <Input
                                        className="h-9"
                                        value={variant.barcode}
                                        onChange={(e) => updateVariant(index, "barcode", e.target.value)}
                                    />
                                </td>

                                <td className="p-2 text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeVariant(index)}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <input
                type="hidden"
                name="variants"
                value={JSON.stringify(variants)}
            />

            <Button onClick={addVariant} size="sm" className="gap-1">
                <Plus className="w-4 h-4" /> Añadir variante
            </Button>
        </div>
    );
}
