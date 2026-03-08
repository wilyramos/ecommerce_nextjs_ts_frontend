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
import { Trash2, Plus, AlertCircle, ArrowUpDown } from "lucide-react";
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
    globalImages: string[];
}

export default function ProductVariantsForm({ product, categoryAttributes, globalImages }: Props) {
    const variantAttributes = categoryAttributes.filter((attr) => attr.isVariant);

    const [variants, setVariants] = useState<TApiVariant[]>(product?.variants ?? []);
    const [errors, setErrors] = useState<string[]>([]);
    const [openItems, setOpenItems] = useState<string[]>([]);
    const [sortMethod, setSortMethod] = useState<string>("default");

    const getValidationErrors = (currentVariants: TApiVariant[]) => {
        const newErrors: string[] = [];

        if (!variantAttributes.length) return newErrors;

        const usedAttrsPerVariant = currentVariants.map((variant) => {
            return Object.entries(variant.atributos)
                .filter(([, val]) => val && val.trim() !== "")
                .map(([key]) => key);
        });

        const referenceAttrs = usedAttrsPerVariant.find(attrs => attrs.length > 0) ?? [];

        usedAttrsPerVariant.forEach((attrs, index) => {
            referenceAttrs.forEach((refAttr) => {
                if (!attrs.includes(refAttr)) {
                    newErrors.push(
                        `La variante #${index + 1} requiere un valor para "${refAttr}".`
                    );
                }
            });

            const extraAttrs = attrs.filter(a => !referenceAttrs.includes(a));
            if (extraAttrs.length) {
                newErrors.push(
                    `La variante #${index + 1} tiene atributos extra: ${extraAttrs.join(", ")}. Debe usar solo los mismos que las demás.`
                );
            }
        });
        return newErrors;
    };

    const handleSort = (method: string) => {
        setSortMethod(method);
        if (method === "default") return;

        const sorted = [...variants].sort((a, b) => {
            if (method === "incomplete") {
                const aIncomplete = variantAttributes.some(attr => !a.atributos[attr.name]);
                const bIncomplete = variantAttributes.some(attr => !b.atributos[attr.name]);
                if (aIncomplete && !bIncomplete) return -1;
                if (!aIncomplete && bIncomplete) return 1;
                return 0;
            }
            if (method === "alphabetical") {
                const aSummary = variantAttributes.map(attr => a.atributos[attr.name] || "").join("");
                const bSummary = variantAttributes.map(attr => b.atributos[attr.name] || "").join("");
                return aSummary.localeCompare(bSummary);
            }
            if (method === "price") {
                return (a.precio || 0) - (b.precio || 0);
            }
            if (method === "stock") {
                return (a.stock || 0) - (b.stock || 0);
            }
            return 0;
        });

        setVariants(sorted);
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
        setErrors(getValidationErrors(nextVariants));
        setOpenItems((prev) => [...prev, newVariant._id!]);
        setSortMethod("default"); 
    };

    const updateVariant = <K extends keyof TApiVariant>(index: number, key: K, value: TApiVariant[K]) => {
        const nextVariants = [...variants];
        nextVariants[index] = { ...nextVariants[index], [key]: value };

        setVariants(nextVariants);
        setErrors(getValidationErrors(nextVariants));
    };

    const updateAttribute = (index: number, attrName: string, value: string) => {
        const nextVariants = [...variants];
        nextVariants[index] = {
            ...nextVariants[index],
            atributos: { ...nextVariants[index].atributos, [attrName]: value },
        };

        setVariants(nextVariants);
        setErrors(getValidationErrors(nextVariants));
    };

    const removeVariant = (index: number) => {
        const nextVariants = variants.filter((_, i) => i !== index);
        setVariants(nextVariants);
        setErrors(getValidationErrors(nextVariants));
    };

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
                <h3 className="text-base font-semibold">Variantes del producto ({variants.length}):</h3>
                
                {variants.length > 1 && (
                    <div className="flex items-center gap-2">
                        <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                        <Select value={sortMethod} onValueChange={handleSort}>
                            <SelectTrigger className="h-8 w-[180px] text-xs">
                                <SelectValue placeholder="Ordenar por..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="default">Orden original</SelectItem>
                                <SelectItem value="incomplete">Incompletas primero</SelectItem>
                                <SelectItem value="alphabetical">Alfabético (Atributos)</SelectItem>
                                <SelectItem value="price">Menor a mayor precio</SelectItem>
                                <SelectItem value="stock">Menor a mayor stock</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

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

                                <AccordionContent className="px-3 pb-4 pt-2 space-y-4">
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
                                                type="number"
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

                                    <UploadVariantImageDialog
                                        images={variant.imagenes ?? []}
                                        globalImages={globalImages}
                                        setImages={(fn) => {
                                            const next = [...variants];
                                            next[index].imagenes = fn(next[index].imagenes ?? []);
                                            setVariants(next);
                                        }}
                                    />

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

            <input
                type="hidden"
                name="variants"
                value={errors.length === 0 ? JSON.stringify(variantsToSubmit) : "[]"}
            />

            <input
                type="hidden"
                name="variants_error"
                value={errors.length > 0 ? "true" : "false"}
            />

            <div className="flex gap-2">
                <Button onClick={addVariant} size="sm" variant="outline" className="gap-2 border-dashed border-2">
                    <Plus className="w-4 h-4" /> Añadir variante
                </Button>
            </div>
        </div>
    );
}