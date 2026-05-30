"use client";

import { useState, useEffect } from "react";
import { Settings2, Tag } from "lucide-react";
import type { CategoryListResponse } from "@/src/schemas/category.schema";

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

type Props = {
    categorias: CategoryListResponse;
    initialCategoryId?: string;
    currentAttributes?: Record<string, string>;
    onCategoryChange?: (categoryId: string) => void;
};

export default function ClientCategoryAttributes({
    categorias,
    initialCategoryId,
    currentAttributes,
    onCategoryChange,
}: Props) {
    const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId || "");
    const [categoryDefinitions, setCategoryDefinitions] = useState<{ name: string; values: string[] }[]>([]);
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(currentAttributes || {});
    const [isOpen, setIsOpen] = useState(false);

    const handleCategorySelect = (id: string) => {
        setSelectedCategoryId(id);
        if (onCategoryChange) onCategoryChange(id);
    };

    useEffect(() => {
        const selected = categorias.find((cat) => cat._id === selectedCategoryId);
        if (!selected) {
            setCategoryDefinitions([]);
            return;
        }
        const validDefinitions = selected.attributes || [];
        setCategoryDefinitions(validDefinitions);

        setSelectedAttributes((prev) => {
            const merged = { ...prev };
            if (currentAttributes) {
                validDefinitions.forEach((def) => {
                    if (prev[def.name] === undefined && currentAttributes[def.name]) {
                        merged[def.name] = currentAttributes[def.name];
                    }
                });
            }
            return merged;
        });
    }, [selectedCategoryId, categorias, currentAttributes]);

    const handleAttributeChange = (name: string, value: string) => {
        setSelectedAttributes((prev) => {
            const updated = { ...prev };
            if (value === "_none") delete updated[name];
            else updated[name] = value;
            return updated;
        });
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
                <label className="text-xs font-bold text-foreground">
                    Categoría <span className="text-destructive">*</span>
                </label>

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

            {/* --- VISTA PREVIA Y ACCIÓN (Solo si hay categoría) --- */}
            {selectedCategoryId && categoryDefinitions.length > 0 && (
                <div className="pt-4 border-t border-border/40 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">
                            Atributos Seleccionados
                        </span>

                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <button
                                    type="button"
                                    className="flex items-center gap-1.5 text-xs font-bold text-action-cta hover:opacity-80 transition-opacity cursor-pointer outline-none"
                                >
                                    <Settings2 className="w-3.5 h-3.5" />
                                    <span>Configurar</span>
                                </button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-xl bg-background border border-border rounded-sm shadow-xs outline-none">
                                <DialogHeader>
                                    <DialogTitle className="text-sm font-bold tracking-tight text-foreground uppercase">
                                        Atributos de <span className="text-action-cta font-black">{selectedCategory?.nombre}</span>
                                    </DialogTitle>
                                </DialogHeader>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                                    {categoryDefinitions.map((attr) => (
                                        <div key={attr.name} className="space-y-1">
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                                {attr.name}
                                            </label>
                                            <Select
                                                value={selectedAttributes[attr.name] || "_none"}
                                                onValueChange={(val) => handleAttributeChange(attr.name, val)}
                                            >
                                                <SelectTrigger className="h-10 bg-background-secondary border border-border/40 rounded-sm text-xs text-foreground outline-none">
                                                    <SelectValue placeholder="No definido" />
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
                                    ))}
                                </div>

                                <DialogFooter>
                                    <Button
                                        className="w-full sm:w-auto bg-foreground text-background text-xs font-bold px-6 py-2.5 rounded-full hover:bg-action-cta hover:text-primary-foreground transition-colors outline-none cursor-pointer"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Guardar Atributos
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* --- RESUMEN VISIBLE --- */}
                    <div className="flex flex-wrap gap-2">
                        {activeEntries.length > 0 ? (
                            activeEntries.map(([key, value]) => (
                                <div
                                    key={key}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-background-secondary border border-border/40 text-foreground text-xs font-medium"
                                >
                                    <Tag className="w-3 h-3 text-muted-foreground/60" />
                                    <span className="text-muted-foreground font-semibold">{key}:</span>
                                    <span className="font-bold text-action-cta">{value}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs italic text-muted-foreground/60 font-medium py-1">
                                No se han configurado atributos específicos todavía.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}