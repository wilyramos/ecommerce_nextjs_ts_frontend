"use client";

import { useState } from "react";
import { Package, Settings2, Ruler } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LabelWithTooltip } from "@/components/utils/LabelWithTooltip";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import type { TApiProduct } from "@/src/schemas";

interface ShippingDimensionsProps {
    product?: TApiProduct;
}

export default function ShippingDimensions({ product }: ShippingDimensionsProps) {
    const [dims, setDims] = useState({
        length: product?.dimensions?.length?.toString() || "",
        width:  product?.dimensions?.width?.toString()  || "",
        height: product?.dimensions?.height?.toString() || "",
        weight: product?.weight?.toString() || ""
    });

    const hasData = dims.weight || dims.length || dims.width || dims.height;

    return (
        <div className="border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] p-4 space-y-3">
            <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[var(--color-text-secondary)]" />
                <span className="text-[11px] font-bold text-[var(--color-text-primary)]">
                    Logística y Envío
                </span>
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <button
                        type="button"
                        className="w-full flex items-center justify-between px-3 py-2 border border-[var(--color-border-default)] hover:bg-[var(--color-bg-secondary)] transition-all group"
                    >
                        <div className="text-left">
                            <p className="text-[10px] font-bold text-[var(--color-text-primary)] uppercase">
                                {hasData ? "Configurado" : "Sin definir"}
                            </p>
                            <p className="text-[10px] text-[var(--color-text-secondary)]">
                                {dims.weight ? `${dims.weight}kg` : "0kg"} • {dims.length || 0}x{dims.width || 0}x{dims.height || 0}cm
                            </p>
                        </div>
                        <Settings2 className="w-3.5 h-3.5 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-accent-warm)]" />
                    </button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                            <Ruler className="w-4 h-4" /> Dimensiones de Envío
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Establece las medidas físicas para el cálculo de tarifas de transporte.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        {/* Peso — SIN name, solo visual */}
                        <div className="space-y-2">
                            <LabelWithTooltip
                                htmlFor="weight-visual"
                                label="Peso del Paquete (kg)"
                                tooltip="Peso total incluyendo empaque."
                            />
                            <Input
                                type="number"
                                id="weight-visual"
                                step="0.01"
                                value={dims.weight}
                                onChange={(e) => setDims(prev => ({ ...prev, weight: e.target.value }))}
                            />
                        </div>

                        {/* Dimensiones — SIN name, solo visuales */}
                        <div className="space-y-3">
                            <Label className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                                Medidas de la caja (cm)
                            </Label>
                            <div className="grid grid-cols-3 gap-3">
                                {(["length", "width", "height"] as const).map((key) => (
                                    <div key={key} className="space-y-1">
                                        <Label htmlFor={`dim-visual-${key}`} className="text-[10px] capitalize text-[var(--color-text-secondary)]">
                                            {key === 'length' ? 'Largo' : key === 'width' ? 'Ancho' : 'Alto'}
                                        </Label>
                                        <Input
                                            type="number"
                                            id={`dim-visual-${key}`}
                                            value={dims[key]}
                                            onChange={(e) => setDims(prev => ({ ...prev, [key]: e.target.value }))}
                                            className="text-xs"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Únicos inputs que envían datos al FormData */}
            <input type="hidden" name="weight"              value={dims.weight} />
            <input type="hidden" name="dimensions.length"   value={dims.length} />
            <input type="hidden" name="dimensions.width"    value={dims.width} />
            <input type="hidden" name="dimensions.height"   value={dims.height} />
        </div>
    );
}