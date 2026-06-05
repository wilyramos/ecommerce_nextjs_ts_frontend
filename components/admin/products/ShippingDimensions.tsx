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
import type { ProductWithCategoryResponse } from "@/src/schemas";

interface ShippingDimensionsProps {
    product?: ProductWithCategoryResponse;
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
        <div className="border border-border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span className="text-[10px] font-black text-foreground uppercase tracking-wider">
                    Logística y Envío
                </span>
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <button
                        type="button"
                        className="w-full flex items-center justify-between px-3 py-2 border border-border bg-background hover:bg-background-secondary transition-all group rounded-[var(--radius-sm)]"
                    >
                        <div className="text-left">
                            <p className="text-[10px] font-bold text-foreground uppercase">
                                {hasData ? "Configurado" : "Sin definir"}
                            </p>
                            <p className="text-[10px] text-muted-foreground font-mono">
                                {dims.weight || 0}kg • {dims.length || 0}x{dims.width || 0}x{dims.height || 0}cm
                            </p>
                        </div>
                        <Settings2 className="w-3.5 h-3.5 text-muted-foreground group-hover:text-action-cta transition-colors" />
                    </button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                            <Ruler className="w-4 h-4" /> Dimensiones de Envío
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Establece las medidas físicas para el cálculo de tarifas.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
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

                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                                Medidas de la caja (cm)
                            </Label>
                            <div className="grid grid-cols-3 gap-3">
                                {(["length", "width", "height"] as const).map((key) => (
                                    <div key={key} className="space-y-1">
                                        <Label htmlFor={`dim-visual-${key}`} className="text-[9px] capitalize text-muted-foreground">
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

            <input type="hidden" name="weight"           value={dims.weight} />
            <input type="hidden" name="dimensions.length" value={dims.length} />
            <input type="hidden" name="dimensions.width"  value={dims.width} />
            <input type="hidden" name="dimensions.height" value={dims.height} />
        </div>
    );
}