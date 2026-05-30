"use client";

import { useState } from "react";
import { Search, Globe, ChevronRight, Edit3 } from "lucide-react";

// UI Components
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LabelWithTooltip } from "@/components/utils/LabelWithTooltip";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Tipos
import type { ProductWithCategoryResponse } from "@/src/schemas";

interface SEOProductProps {
    product?: ProductWithCategoryResponse;
}

export default function SEOProduct({ product }: SEOProductProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [metaTitle, setMetaTitle] = useState(product?.metaTitle ?? "");
    const [metaDescription, setMetaDescription] = useState(product?.metaDescription ?? "");

    const titleLen = metaTitle.length;
    const descLen = metaDescription.length;

    const getCounterColor = (len: number, max: number) => {
        if (len === 0) return "text-muted-foreground";
        return len <= max ? "text-green-600" : "text-destructive";
    };

    const plainDescription = product?.descripcion?.replace(/<[^>]*>/g, "") || "";

    return (
        <div className="p-4 border border-border/60 bg-background rounded-sm space-y-4">
            
            <input type="hidden" name="metaTitle" value={metaTitle} />
            <input type="hidden" name="metaDescription" value={metaDescription} />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-muted-foreground/80" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                        SEO & Metadatos
                    </span>
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <button 
                            type="button"
                            className="flex items-center gap-1.5 text-xs font-bold text-action-cta hover:opacity-80 transition-opacity outline-none"
                        >
                            <Edit3 className="w-3 h-3" />
                            Editar
                        </button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-2xl bg-background border border-border rounded-sm shadow-xs outline-none">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground">
                                <Search className="w-4 h-4" /> Optimización SEO
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            {/* Vista Previa */}
                            <div className="border border-border/40 bg-background-secondary/30 p-4 rounded-sm space-y-0.5">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                                    Vista previa en buscadores
                                </p>
                                <p className="text-lg font-medium text-blue-700 truncate leading-tight">
                                    {metaTitle || product?.nombre || "Título del producto | GoPhone"}
                                </p>
                                <p className="text-xs text-green-700 flex items-center gap-1 font-medium">
                                    https://gophone.pe <ChevronRight className="w-3 h-3 text-muted-foreground" /> {product?.slug ?? "producto"}
                                </p>
                                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed pt-0.5">
                                    {metaDescription || plainDescription || "Optimiza tu presencia en Google con una descripción atractiva..."}
                                </p>
                            </div>

                            {/* Inputs */}
                            <div className="space-y-5">
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <LabelWithTooltip 
                                            htmlFor="metaTitle"
                                            label="Meta Title" 
                                            tooltip="Aparece como el título azul en Google." 
                                        />
                                        <span className={`text-[10px] font-bold ${getCounterColor(titleLen, 60)}`}>
                                            {titleLen} / 60
                                        </span>
                                    </div>
                                    <Input 
                                        value={metaTitle}
                                        onChange={(e) => setMetaTitle(e.target.value)}
                                        placeholder="Ej: iPhone 15 Pro Max Titanium | GoPhone"
                                        className="bg-background-secondary border-border/40 rounded-sm text-xs"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <LabelWithTooltip 
                                            label="Meta Description" 
                                            tooltip="El texto que convence al usuario de hacer clic."
                                            htmlFor="metaDescription"
                                        />
                                        <span className={`text-[10px] font-bold ${getCounterColor(descLen, 160)}`}>
                                            {descLen} / 160
                                        </span>
                                    </div>
                                    <Textarea 
                                        value={metaDescription}
                                        onChange={(e) => setMetaDescription(e.target.value)}
                                        rows={4}
                                        placeholder="Escribe un resumen atractivo del producto..."
                                        className="bg-background-secondary border-border/40 rounded-sm text-xs resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="border-t border-border/40 pt-4">
                            <Button 
                                className="w-full sm:w-auto text-xs font-bold rounded-sm px-6"
                                onClick={() => setIsOpen(false)}
                            >
                                Confirmar Cambios
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Preview Simplificada */}
            <div className="p-3 rounded-sm bg-background-secondary/30 border border-border/40 space-y-0.5">
                <p className="text-xs font-bold text-blue-700 truncate">
                    {metaTitle || product?.nombre || "Sin título definido"}
                </p>
                <p className="text-[10px] text-muted-foreground line-clamp-1">
                    {metaDescription || plainDescription || "Sin descripción meta..."}
                </p>
            </div>

            <p className="text-[10px] text-muted-foreground italic leading-tight">
                * Los metadatos optimizados mejoran el ranking en buscadores y el CTR de tus productos.
            </p>
        </div>
    );
}