"use client";

import { useState, useEffect, useMemo } from "react";
import { ProductWithCategoryResponse, VariantCart } from "@/src/schemas";
import Image from "next/image";
import { useCartStore } from "@/src/store/cartStore";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

interface Props {
    product: ProductWithCategoryResponse;
    open: boolean;
    setOpen: (v: boolean) => void;
}

export default function VariantSelectorModal({ product, open, setOpen }: Props) {
    const addToCart = useCartStore((s) => s.addToCart);

    const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>({});
    const [selectedVariant, setSelectedVariant] = useState<VariantCart | null>(null);

    const attributesMap = useMemo(() => {
        const attrs: Record<string, Set<string>> = {};
        if (!product.variants) return {};

        product.variants.forEach((v) => {
            if (v.stock > 0 && v.atributos) {
                Object.entries(v.atributos).forEach(([k, value]) => {
                    if (!attrs[k]) attrs[k] = new Set();
                    attrs[k].add(value as string);
                });
            }
        });

        return attrs;
    }, [product]);

    useEffect(() => {
        if (!product.variants) return;

        const keys = Object.keys(attributesMap);
        const ready = keys.every((k) => selectedAttrs[k]);

        if (ready) {
            const found = product.variants.find((v) =>
                Object.entries(selectedAttrs).every(
                    ([k, val]) => v.atributos?.[k] === val
                )
            );
            setSelectedVariant((found as VariantCart) || null);
        } else {
            setSelectedVariant(null);
        }
    }, [selectedAttrs, product.variants, attributesMap]);

    useEffect(() => {
        if (open) {
            setSelectedAttrs({});
            setSelectedVariant(null);
        }
    }, [open]);

    const handleAddToCart = () => {
        if (!selectedVariant) return;

        addToCart(product, selectedVariant);

        toast.success(
            `Agregado: ${product.nombre} - ${Object.values(
                selectedVariant.atributos
            ).join("/")}`
        );

        setOpen(false);
    };

    const currentPrice = selectedVariant?.precio ?? product.precio;
    const currentStock = selectedVariant?.stock ?? 0;
    const currentImage = selectedVariant?.imagenes?.[0] ?? product.imagenes?.[0];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md p-0 overflow-hidden">
                <DialogHeader className="p-4 border-b bg-zinc-50">
                    <DialogTitle className="text-zinc-900 font-semibold">
                        Seleccionar Variante
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                    <div className="flex gap-4">
                        <div className="w-20 h-20 bg-zinc-100 rounded border overflow-hidden">
                            {currentImage && (
                                <Image
                                    src={currentImage}
                                    alt="variant"
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>

                        <div>
                            <p className="font-medium text-zinc-900">{product.nombre}</p>
                            <p className="text-xl font-bold text-zinc-900 mt-1">
                                S/ {currentPrice.toFixed(2)}
                            </p>

                            <p className={`text-xs mt-1 ${currentStock > 0 ? "text-green-600" : "text-red-600"}`}>
                                Stock: {selectedVariant ? currentStock : "--"}
                            </p>
                        </div>
                    </div>

                    {Object.keys(attributesMap).map((attr) => (
                        <div key={attr}>
                            <p className="text-sm font-medium text-zinc-700 mb-1 capitalize">
                                {attr}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {Array.from(attributesMap[attr]).map((value) => (
                                    <button
                                        key={value}
                                        onClick={() =>
                                            setSelectedAttrs((prev) => ({
                                                ...prev,
                                                [attr]: value,
                                            }))
                                        }
                                        className={`px-3 py-1.5 text-sm rounded-md border transition ${
                                            selectedAttrs[attr] === value
                                                ? "bg-zinc-900 text-white border-zinc-900 shadow"
                                                : "bg-white text-zinc-700 border-zinc-300 hover:border-zinc-400"
                                        }`}
                                    >
                                        {value}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <DialogFooter className="p-4 border-t bg-zinc-50">
                    <Button
                        onClick={handleAddToCart}
                        disabled={!selectedVariant || currentStock <= 0}
                        className="w-full"
                    >
                        {currentStock <= 0 && selectedVariant ? "Sin stock" : "Agregar a venta"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
