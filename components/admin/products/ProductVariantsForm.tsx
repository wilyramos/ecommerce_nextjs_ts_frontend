// File: frontend/components/admin/products/ProductVariantsForm.tsx
"use client";

import { useState, useMemo } from "react";
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
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import Image from "next/image";

import { FormMediaField } from "@/components/form/FormMediaField";

interface CategoryAttr {
    name: string;
    values: string[];
    isVariant?: boolean;
}

interface Props {
    product?: ProductWithCategoryResponse;
    categoryAttributes: CategoryAttr[];
}

export default function ProductVariantsForm({
    product,
    categoryAttributes
}: Props) {
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
                    newErrors.push(`La variante #${index + 1} requiere un valor para "${refAttr}".`);
                }
            });

            const extraAttrs = attrs.filter(a => !referenceAttrs.includes(a));
            if (extraAttrs.length) {
                newErrors.push(`La variante #${index + 1} tiene atributos extra: ${extraAttrs.join(", ")}.`);
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
                return aIncomplete === bIncomplete ? 0 : aIncomplete ? -1 : 1;
            }
            if (method === "alphabetical") {
                const aSummary = variantAttributes.map(attr => a.atributos[attr.name] || "").join("");
                const bSummary = variantAttributes.map(attr => b.atributos[attr.name] || "").join("");
                return aSummary.localeCompare(bSummary);
            }
            if (method === "price") return (a.precio || 0) - (b.precio || 0);
            if (method === "stock") return (a.stock || 0) - (b.stock || 0);
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

    const variantsToSubmit = useMemo(() => variants.map(v => ({
        ...v,
        atributos: Object.fromEntries(
            Object.entries(v.atributos).filter(([key]) =>
                variantAttributes.some(c => c.name === key)
            )
        ),
        imagenes: v.imagenes ?? [],
    })), [variants, variantAttributes]);

    if (!variantAttributes?.length) {
        return (
            <div className="text-xs italic text-muted-foreground/60 font-medium text-center py-4 bg-background-secondary/30 border border-border/40 rounded-sm">
                La categoría seleccionada no tiene atributos configurados para generar variantes.
            </div>
        );
    }

    return (
        <div className="space-y-4 p-0 bg-background text-foreground">
            <div className="flex justify-between items-center border-b border-border/40 pb-3">
                <div className="space-y-0.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Variantes del Producto</h3>
                    <p className="text-[11px] text-muted-foreground font-medium">Gestiona precios, stock y fotos específicas por combinación.</p>
                </div>

                {variants.length > 1 && (
                    <div className="flex items-center gap-1.5">
                        <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground/60" />
                        <Select value={sortMethod} onValueChange={handleSort}>
                            <SelectTrigger className="h-8 w-[150px] text-[10px] uppercase font-bold bg-background border border-border/40 rounded-sm outline-none">
                                <SelectValue placeholder="Ordenar" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border border-border rounded-sm text-foreground">
                                <SelectItem value="default" className="text-xs">Orden original</SelectItem>
                                <SelectItem value="incomplete" className="text-xs">Incompletas primero</SelectItem>
                                <SelectItem value="alphabetical" className="text-xs">Alfabético</SelectItem>
                                <SelectItem value="price" className="text-xs">Menor Precio</SelectItem>
                                <SelectItem value="stock" className="text-xs">Menor Stock</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            {errors.length > 0 && (
                <div className="bg-destructive/5 border border-destructive/10 text-destructive p-3 rounded-sm text-[11px] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold uppercase tracking-wide">
                        <AlertCircle className="w-3.5 h-3.5" /> <span>Errores de configuración:</span>
                    </div>
                    <ul className="list-disc list-inside opacity-90 font-medium pl-0.5">
                        {errors.slice(0, 3).map((err, i) => <li key={i}>{err}</li>)}
                        {errors.length > 3 && <li>... y {errors.length - 3} avisos más.</li>}
                    </ul>
                </div>
            )}

            <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-2">
                {variants.map((variant, index) => {
                    const isIncomplete = variantAttributes.some(attr => !variant.atributos[attr.name]);
                    const summary = variantAttributes
                        .map((attr) => variant.atributos[attr.name])
                        .filter(Boolean)
                        .join(" / ");

                    return (
                        <AccordionItem
                            key={variant._id}
                            value={variant._id!}
                            className={`border rounded-sm px-3 overflow-hidden transition-colors outline-none ${isIncomplete ? "bg-destructive/3 border-destructive/20" : "bg-background border-border/60"}`}
                        >
                            <AccordionTrigger className="hover:no-underline py-3.5 outline-none focus-visible:text-action-cta">
                                <div className="flex w-full items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-sm bg-background-secondary flex items-center justify-center border border-border/40 overflow-hidden relative">
                                            {variant.imagenes?.[0] ? (
                                                <Image src={variant.imagenes[0]} alt="" fill sizes="32px" className="object-contain p-0.5 mix-blend-multiply" priority={false} />
                                            ) : (
                                                <span className="text-[10px] font-bold text-muted-foreground/40">#{(index + 1)}</span>
                                            )}
                                        </div>
                                        <div className="text-start">
                                            <p className={`text-xs font-bold uppercase tracking-wide ${!summary ? 'text-muted-foreground/60 italic' : 'text-foreground'}`}>
                                                {summary || "Variante nueva"}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground font-medium">SKU: {variant.sku || '—'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider pr-2">
                                        <div className="flex flex-col items-end">
                                            <span className="text-muted-foreground/60 font-semibold">Precio</span>
                                            <span className="text-foreground">S/ {variant.precio || '0.00'}</span>
                                        </div>
                                        <div className="flex flex-col items-end border-l border-border/40 pl-4">
                                            <span className="text-muted-foreground/60 font-semibold">Stock</span>
                                            <span className={variant.stock === 0 ? 'text-destructive font-black' : 'text-foreground'}>{variant.stock}</span>
                                        </div>
                                    </div>
                                </div>
                            </AccordionTrigger>

                            <AccordionContent className="pt-2 pb-5 space-y-4 border-t border-border/40">

                                {/* MULTIMEDIA ESPECÍFICA POR VARIANTE */}
                                <div className="p-4 rounded-md border border-[color:var(--color-border)] bg-muted/10 space-y-2">
                                    <FormMediaField
                                        name={`variant_images_${variant._id}`}
                                        label="Imágenes de la Variante"
                                        folder="products"
                                        defaultValue={variant.imagenes || []}
                                        multiple={true}
                                        maxFiles={5}
                                        accept="image"
                                        onChange={(urls) => updateVariant(index, "imagenes", urls)}
                                    />
                                </div>

                                {/* ATRIBUTOS */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {variantAttributes.map((attr) => (
                                        <div key={attr.name} className="space-y-1">
                                            <Label className={`text-[10px] font-bold uppercase tracking-wider ${!variant.atributos[attr.name] ? 'text-destructive' : 'text-muted-foreground'}`}>
                                                {attr.name}
                                            </Label>
                                            <Select
                                                value={variant.atributos[attr.name] || ""}
                                                onValueChange={(val) => updateAttribute(index, attr.name, val === "__none__" ? "" : val)}
                                            >
                                                <SelectTrigger className="h-9 text-xs bg-background-secondary border border-border/40 rounded-sm text-foreground outline-none">
                                                    <SelectValue placeholder="Seleccionar..." />
                                                </SelectTrigger>
                                                <SelectContent className="bg-background border border-border rounded-sm text-foreground">
                                                    <SelectItem value="__none__" className="text-xs italic text-muted-foreground/60">— Ninguno —</SelectItem>
                                                    {attr.values.map((val) => (
                                                        <SelectItem key={val} value={val} className="text-xs">{val}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ))}
                                </div>

                                {/* DATOS COMERCIALES */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Precio Venta</Label>
                                        <Input
                                            type="number"
                                            className="h-9 bg-background-secondary border border-border/40 rounded-sm text-xs text-foreground font-semibold"
                                            value={variant.precio}
                                            onChange={(e) => updateVariant(index, "precio", Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Precio Comparativo</Label>
                                        <Input
                                            type="number"
                                            className="h-9 bg-background-secondary border border-border/40 rounded-sm text-xs text-muted-foreground/80"
                                            value={variant.precioComparativo}
                                            onChange={(e) => updateVariant(index, "precioComparativo", Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Stock Disponible</Label>
                                        <Input
                                            type="number"
                                            className="h-9 bg-background-secondary border border-border/40 rounded-sm text-xs text-foreground font-semibold"
                                            value={variant.stock}
                                            onChange={(e) => updateVariant(index, "stock", Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">SKU Variante</Label>
                                        <Input
                                            className="h-9 bg-background-secondary border border-border/40 rounded-sm uppercase text-xs font-bold tracking-wider text-foreground font-mono"
                                            value={variant.sku}
                                            onChange={(e) => updateVariant(index, "sku", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end border-t border-border/40 pt-3 mt-1">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeVariant(index)}
                                        className="h-8 text-[10px] font-bold uppercase tracking-wide text-destructive hover:bg-destructive/5 rounded-sm outline-none cursor-pointer"
                                    >
                                        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                                        <span>Eliminar Variante</span>
                                    </Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>

            <div className="pt-2 flex gap-3">
                <Button
                    type="button"
                    onClick={addVariant}
                    size="sm"
                    variant="outline"
                    className="flex-1 h-10 gap-1.5 border-dashed border border-border/80 font-bold uppercase text-xs rounded-sm cursor-pointer hover:bg-background-secondary/40"
                >
                    <Plus className="w-4 h-4 text-action-cta" /> <span>Añadir Nueva Variante</span>
                </Button>
            </div>

            <input type="hidden" name="variants" value={errors.length === 0 ? JSON.stringify(variantsToSubmit) : "[]"} />
            <input type="hidden" name="variants_error" value={errors.length > 0 ? "true" : "false"} />
        </div>
    );
}