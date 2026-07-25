"use client";

import { useState, useEffect } from "react";
import { Settings2, Tag } from "lucide-react";
import type { CategoryListResponse } from "@/src/schemas/category.schema";
import type { ProductAttributeDetail } from "@/src/schemas";

// UI Components
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { LabelWithTooltip } from "@/components/utils/LabelWithTooltip";

interface LocalAttributeDefinition {
    name: string;
    values: string[];
    icon?: string | null;
}

type Props = {
    categorias: CategoryListResponse;
    initialCategoryId?: string;
    currentAttributes?: Record<string, string>;
    currentAtributosDetalle: Record<string, ProductAttributeDetail>;
    onAttributeDetailChange: (attrName: string, field: keyof ProductAttributeDetail, value: string | boolean | null | undefined) => void;
    onCategoryChange?: (categoryId: string) => void;
};

export default function ClientCategoryAttributes({
    categorias,
    initialCategoryId,
    currentAttributes,
    currentAtributosDetalle,
    onAttributeDetailChange,
    onCategoryChange,
}: Props) {
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>(initialCategoryId || "");
    const [categoryDefinitions, setCategoryDefinitions] = useState<LocalAttributeDefinition[]>([]);
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(currentAttributes || {});
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleCategorySelect = (id: string) => {
        setSelectedCategoryId(id);
        setSelectedAttributes({});
        if (onCategoryChange) onCategoryChange(id);
    };

    useEffect(() => {
        const selected = categorias.find((cat) => cat._id === selectedCategoryId);
        if (!selected) {
            setCategoryDefinitions([]);
            return;
        }
        
        const validDefinitions: LocalAttributeDefinition[] = (selected.attributes || []).map(attr => ({
            name: attr.name,
            values: attr.values,
            icon: attr.icon || null
        }));
        
        setCategoryDefinitions(validDefinitions);

        if (currentAttributes) {
            setSelectedAttributes((prev) => {
                const merged = { ...prev };
                validDefinitions.forEach((def) => {
                    if (prev[def.name] === undefined && currentAttributes[def.name]) {
                        merged[def.name] = currentAttributes[def.name];
                    }
                });
                return merged;
            });
        }
    }, [selectedCategoryId, categorias, currentAttributes]);

    // ✅ CORRECCIÓN: Separamos el setState del hijo y la notificación al padre
    const handleAttributeChange = (name: string, value: string) => {
        const isNone = value === "_none";
        const finalValue = isNone ? "" : value;

        // 1. Actualizamos el estado del hijo
        setSelectedAttributes((prev) => {
            const updated = { ...prev };
            if (isNone) delete updated[name];
            else updated[name] = value;
            return updated;
        });

        // 2. Notificamos al padre FUERA de la función reductora
        onAttributeDetailChange(name, "value", finalValue);
    };

    const selectedCategory = categorias.find((c) => c._id === selectedCategoryId);
    const activeEntries = Object.entries(selectedAttributes).filter(([key]) =>
        categoryDefinitions.some(def => def.name === key)
    );

    const validAtributosJSON = JSON.stringify(Object.fromEntries(activeEntries));

    return (
        <div className="space-y-4 p-0 bg-background text-foreground">

            {/* --- SELECCIÓN DE CATEGORÍA --- */}
            <div className="space-y-1">
                <LabelWithTooltip 
                    htmlFor="categoria" 
                    label="Categoría" 
                    required 
                    tooltip="Selecciona la categoría del producto. Esto cargará los atributos e íconos globales definidos para dicha categoría." 
                />

                <input type="hidden" name="categoria" value={selectedCategoryId} />
                <input type="hidden" name="atributos" value={validAtributosJSON} />

                <Select value={selectedCategoryId} onValueChange={handleCategorySelect}>
                    <SelectTrigger className="h-10 w-full bg-background-secondary border border-border/40 text-foreground rounded-sm text-xs outline-none">
                        <SelectValue placeholder="Seleccionar categoría..." />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border rounded-sm text-foreground">
                        {categorias.map((cat) => (
                            <SelectItem
                                key={cat._id}
                                value={cat._id}
                                className="cursor-pointer text-xs focus:bg-background-secondary focus:text-foreground"
                            >
                                {cat.nombre}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* --- ATRIBUTOS DINÁMICOS ASOCIADOS --- */}
            {selectedCategoryId && categoryDefinitions.length > 0 && (
                <div className="pt-4 border-t border-border/40 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">
                            Atributos de Especificación
                        </span>

                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <button
                                    type="button"
                                    className="flex items-center gap-1.5 text-xs font-bold text-action-cta hover:opacity-80 transition-opacity cursor-pointer outline-none"
                                >
                                    <Settings2 className="w-3.5 h-3.5" />
                                    <span>Configurar Valores</span>
                                </button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-md bg-background border border-border rounded-sm shadow-xs outline-none max-h-[80vh] flex flex-col">
                                <DialogHeader className="shrink-0">
                                    <DialogTitle className="text-sm font-bold tracking-tight text-foreground uppercase">
                                        Configurar {selectedCategory?.nombre}
                                    </DialogTitle>
                                </DialogHeader>

                                <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-5">
                                    {categoryDefinitions.map((attr) => {
                                        const currentDetail = currentAtributosDetalle[attr.name];
                                        const hasValue = !!selectedAttributes[attr.name];

                                        return (
                                            <div key={attr.name} className="p-4 border border-border/50 rounded-sm space-y-3 bg-muted/10">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {attr.icon && (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img 
                                                                src={attr.icon} 
                                                                alt="" 
                                                                className="w-4 h-4 object-contain opacity-70"
                                                            />
                                                        )}
                                                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                                                            {attr.name}
                                                        </label>
                                                    </div>
                                                    
                                                    <Select
                                                        value={selectedAttributes[attr.name] || "_none"}
                                                        onValueChange={(val) => handleAttributeChange(attr.name, val)}
                                                    >
                                                        <SelectTrigger className="h-10 bg-background-secondary border border-border/40 rounded-sm text-xs text-foreground outline-none">
                                                            <SelectValue placeholder="Sin especificar" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-background border border-border rounded-sm text-foreground">
                                                            <SelectItem value="_none" className="italic text-muted-foreground/60 text-xs">
                                                                Sin especificar
                                                            </SelectItem>
                                                            {attr.values.map((val) => (
                                                                <SelectItem key={val} value={val} className="text-xs">{val}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {hasValue && (
                                                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                                                        <Label 
                                                            className="text-xs font-medium text-muted-foreground cursor-pointer" 
                                                            htmlFor={`featured-${attr.name}`}
                                                        >
                                                            ¿Destacar atributo en el E-commerce?
                                                        </Label>
                                                        <Switch
                                                            id={`featured-${attr.name}`}
                                                            checked={currentDetail?.isFeatured ?? false}
                                                            onCheckedChange={(checked: boolean) => onAttributeDetailChange(attr.name, "isFeatured", checked)}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <DialogFooter className="shrink-0 border-t pt-3">
                                    <Button
                                        className="w-full sm:w-auto bg-foreground text-background text-xs font-bold px-6 py-2.5 rounded-full hover:bg-action-cta hover:text-primary-foreground transition-colors outline-none cursor-pointer"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Aceptar
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* --- RESUMEN DE ATRIBUTOS SELECCIONADOS --- */}
                    <div className="flex flex-wrap gap-2">
                        {activeEntries.length > 0 ? (
                            activeEntries.map(([key, value]) => (
                                <div
                                    key={key}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-background-secondary border border-border/40 text-foreground text-xs font-medium animate-in fade-in duration-200"
                                >
                                    <Tag className="w-3 h-3 text-muted-foreground/60" />
                                    <span className="text-muted-foreground font-semibold">{key}:</span>
                                    <span className="font-bold text-action-cta">{value}</span>
                                    {currentAtributosDetalle[key]?.isFeatured && (
                                        <Badge className="ml-1 text-[9px] px-1.5 py-0 bg-action-cta/10 text-action-cta border-none uppercase tracking-wide font-black">
                                            Destacado
                                        </Badge>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-xs italic text-muted-foreground/60 font-medium py-1">
                                No se han especificado características para la categoría actual.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}