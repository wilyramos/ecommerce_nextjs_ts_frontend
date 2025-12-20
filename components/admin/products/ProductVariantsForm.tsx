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
import { Trash2, Plus, AlertCircle } from "lucide-react";
import UploadVariantImageDialog from "./UploadVariantImageDialog";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";


interface CategoryAttr {
    name: string;
    values: string[];
    isVariant?: boolean;
}

interface Props {
    product?: ProductWithCategoryResponse;
    categoryAttributes: CategoryAttr[];
    globalImages: string[]; // <--- NUEVA PROP
}

export default function ProductVariantsForm({ product, categoryAttributes, globalImages }: Props) {
    // 1. Filtramos atributos obligatorios para variantes
    const variantAttributes = categoryAttributes.filter((attr) => attr.isVariant);

    const [variants, setVariants] = useState<TApiVariant[]>(product?.variants ?? []);
    const [errors, setErrors] = useState<string[]>([]);
    const [openItems, setOpenItems] = useState<string[]>([]);


    // Función auxiliar pura para obtener errores de una lista de variantes
    const getValidationErrors = (currentVariants: TApiVariant[]) => {
        const newErrors: string[] = [];

        if (!variantAttributes.length) return newErrors;

        // Obtener qué atributos se están usando en cada variante (los que tengan valor)
        const usedAttrsPerVariant = currentVariants.map((variant) => {
            return Object.entries(variant.atributos)
                .filter(([, val]) => val && val.trim() !== "")
                .map(([key]) => key);
        });

        // Referencia: los atributos usados por la primera variante que tenga al menos uno
        const referenceAttrs = usedAttrsPerVariant.find(attrs => attrs.length > 0) ?? [];

        // Validar que cada variante tenga al menos un valor por cada atributo que esté en referencia
        usedAttrsPerVariant.forEach((attrs, index) => {
            referenceAttrs.forEach((refAttr) => {
                if (!attrs.includes(refAttr)) {
                    newErrors.push(
                        `La variante #${index + 1} requiere un valor para "${refAttr}".`
                    );
                }
            });

            // Validación extra: no permitir atributos adicionales que no estén en referencia
            const extraAttrs = attrs.filter(a => !referenceAttrs.includes(a));
            if (extraAttrs.length) {
                newErrors.push(
                    `La variante #${index + 1} tiene atributos extra: ${extraAttrs.join(", ")}. Debe usar solo los mismos que las demás.`
                );
            }
        });
        return newErrors;
    };

    const addVariant = (event: React.FormEvent) => {
        event.preventDefault();

        const attributes: Record<string, string> = {};
        variantAttributes.forEach((attr) => (attributes[attr.name] = ""));

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

        const nextVariants = [...variants, newVariant];
        setVariants(nextVariants);
        // Validamos automáticamente al agregar (bloqueará el submit hasta que se llene)
        setErrors(getValidationErrors(nextVariants));
        setOpenItems((prev) => [...prev, newVariant._id!]);
    };

    const updateVariant = <K extends keyof TApiVariant>(index: number, key: K, value: TApiVariant[K]) => {
        const nextVariants = [...variants];
        nextVariants[index] = { ...nextVariants[index], [key]: value };

        setVariants(nextVariants);
        setErrors(getValidationErrors(nextVariants)); // Validación automática en tiempo real
    };

    const updateAttribute = (index: number, attrName: string, value: string) => {
        const nextVariants = [...variants];
        nextVariants[index] = {
            ...nextVariants[index],
            atributos: { ...nextVariants[index].atributos, [attrName]: value },
        };

        setVariants(nextVariants);
        setErrors(getValidationErrors(nextVariants)); // Validación automática en tiempo real
    };

    const removeVariant = (index: number) => {
        const nextVariants = variants.filter((_, i) => i !== index);
        setVariants(nextVariants);
        setErrors(getValidationErrors(nextVariants)); // Re-validar al eliminar
    };

    // Preparamos datos limpios para el input hidden
    const variantsToSubmit = variants.map(v => ({
        ...v,
        atributos: Object.fromEntries(
            Object.entries(v.atributos).filter(([key]) =>
                variantAttributes.some(c => c.name === key)
            )
        ),
        imagenes: v.imagenes ?? [],
    }));

    if (!variantAttributes?.length) {
        return (
            <div className="mt-6 p-4 border rounded-lg bg-gray-50 text-sm text-gray-500">
                La categoría seleccionada no tiene atributos para variantes.
            </div>
        );
    }

    return (
        <div className="space-y-4 my-4 border-2 p-4 rounded-lg bg-white">
            <div className="flex justify-between items-center">
                <h3 className="text-base font-semibold">Variantes del producto:</h3>
            </div>

            {/* Mostramos errores de validación automáticamente */}
            {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm space-y-1">
                    <div className="flex items-center gap-2 font-bold">
                        <AlertCircle className="w-4 h-4" /> Faltan datos requeridos:
                    </div>
                    <ul className="list-disc list-inside pl-1">
                        {errors.slice(0, 3).map((err, i) => <li key={i}>{err}</li>)}
                        {errors.length > 3 && <li>... y {errors.length - 3} errores más.</li>}
                    </ul>
                </div>
            )}

            <div className="space-y-4 ">
                <Accordion
                    type="multiple"
                    value={openItems}
                    onValueChange={setOpenItems}
                    className="space-y-2">
                    {variants.map((variant, index) => {
                        const isIncomplete = variantAttributes.some(
                            (attr) => !variant.atributos[attr.name]
                        );

                        const summary = variantAttributes
                            .map((attr) => variant.atributos[attr.name])
                            .filter(Boolean)
                            .join(" / ");

                        return (
                            <AccordionItem
                                key={variant._id}
                                value={variant._id!}
                                className={` border-2  ${isIncomplete ? "border-red-300" : ""
                                    }`}
                            >
                                {/* Header compacto */}
                                <AccordionTrigger className="px-3 py-2 text-sm hover:no-underline">
                                    <div className="flex w-full items-center justify-between gap-3">
                                        <div className="truncate uppercase font-medium text-xs ">
                                            {summary || "Variante sin atributos"}
                                        </div>

                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span>s/{variant.precio || 0}</span>
                                            <span>Stock: {variant.stock}</span>
                                        </div>
                                    </div>
                                </AccordionTrigger>

                                {/* Contenido completo */}
                                <AccordionContent className="px-3 pb-4 pt-2 space-y-4">
                                    {/* ATRIBUTOS */}
                                    <div className="flex flex-wrap gap-3">
                                        {variantAttributes.map((attr) => {
                                            const isEmpty = !variant.atributos[attr.name];
                                            return (
                                                <div key={attr.name} className="w-[140px] space-y-1">

                                                    <label
                                                        className={`text-xs font-medium ${isEmpty ? "text-red-500" : "text-muted-foreground"
                                                            }`}
                                                    >
                                                        {attr.name}
                                                    </label>
                                                    <Select
                                                        value={variant.atributos[attr.name] || ""}
                                                        onValueChange={(val) =>
                                                            updateAttribute(
                                                                index,
                                                                attr.name,
                                                                val === "__none__" ? "" : val
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="h-8">
                                                            <SelectValue placeholder="—" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="__none__">— Ninguno —</SelectItem>
                                                            {attr.values.map((val) => (
                                                                <SelectItem key={val} value={val}>
                                                                    {val}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* DATOS NUMÉRICOS */}


                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium">Precio</label>
                                            <Input
                                                type="number"
                                                placeholder="Precio"
                                                value={variant.precio}
                                                onChange={(e) =>
                                                    updateVariant(index, "precio", Number(e.target.value))
                                                }
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium">Precio Comp.</label>
                                            <Input
                                                type="number"
                                                value={variant.precioComparativo}
                                                onChange={(e) => updateVariant(index, "precioComparativo", Number(e.target.value))}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium">Stock</label>
                                            <Input
                                                className="h-9"
                                                value={variant.stock}
                                                onChange={(e) => updateVariant(index, "stock", Number(e.target.value))}
                                            />
                                        </div>
                                        <div className="space-y-1 col-span-2 md:col-span-1">
                                            <label className="text-xs font-medium">SKU</label>
                                            <Input
                                                className="h-9"
                                                value={variant.sku}
                                                onChange={(e) => updateVariant(index, "sku", e.target.value)}

                                            />
                                        </div>



                                    </div>

                                    {/* IMÁGENES */}
                                    {/* Dentro del mapeo de variants en AccordionContent */}
<UploadVariantImageDialog
                 images={variant.imagenes ?? []}
                 globalImages={globalImages} // <--- Pasamos las globales al dialog
                 setImages={(fn) => {
                     const next = [...variants];
                     next[index].imagenes = fn(next[index].imagenes ?? []);
                     setVariants(next);
                     // Si tienes validación en tiempo real, llámala aquí también
                 }}
             />

                                    {/* DELETE */}
                                    <div className="flex justify-end">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeVariant(index)}
                                            className="text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Eliminar variante
                                        </Button>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </Accordion>

            </div>

            {/* Input oculto: Se vacía si hay errores, impidiendo el envío del formulario padre */}
            <input
                type="hidden"
                name="variants"
                value={errors.length === 0 && variants.length > 0 ? JSON.stringify(variantsToSubmit) : ""}
            />

            <div className="flex gap-2">
                <Button onClick={addVariant} size="sm" variant="outline" className="gap-2 border-dashed border-2">
                    <Plus className="w-4 h-4" /> Añadir variante
                </Button>
            </div>
        </div>
    );
}