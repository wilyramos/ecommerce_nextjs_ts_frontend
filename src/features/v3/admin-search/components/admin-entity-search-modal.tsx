// frontend/src/features/v3/admin-search/components/admin-entity-search-modal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Loader2, Check } from "lucide-react";
import { useAdminSearch } from "../hooks/use-admin-search";
import type { AdminEntitySearchModalProps } from "../types/admin-search.types";
import { cn } from "@/lib/utils";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export function AdminEntitySearchModal<T>({
    isOpen,
    onClose,
    title = "Buscar recurso",
    placeholder = "Buscar...",
    searchAction,
    renderItem,
    keyExtractor,
    multiple = false,
    onSelectMultiple,
    onSelect,
    initialSelectedItems = [],
}: AdminEntitySearchModalProps<T>) {
    const { inputValue, setInputValue, results, isLoading, error } = useAdminSearch<T>(searchAction);

    // Estado interno para las selecciones antes de confirmar
    const [selectedMap, setSelectedMap] = useState<Map<string, T>>(new Map());

    // Sincronizar estado inicial solo cuando el modal se abre
    useEffect(() => {
        if (isOpen) {
            const initialMap = new Map<string, T>();
            initialSelectedItems.forEach((item) => {
                initialMap.set(keyExtractor(item), item);
            });
            setSelectedMap(initialMap);
            setInputValue("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const handleClose = () => {
        onClose();
    };

    const toggleItemSelection = (item: T) => {
        const key = keyExtractor(item);
        setSelectedMap((prev) => {
            const next = new Map(prev);
            if (multiple) {
                if (next.has(key)) next.delete(key);
                else next.set(key, item);
            } else {
                // Modo único: Reemplaza todo con el seleccionado
                next.clear();
                next.set(key, item);
            }
            return next;
        });
    };

    const handleConfirm = () => {
        if (multiple && onSelectMultiple) {
            onSelectMultiple(Array.from(selectedMap.values()));
        } else if (!multiple && onSelect) {
            const selectedItem = Array.from(selectedMap.values())[0];
            if (selectedItem) onSelect(selectedItem);
        }
        handleClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden bg-white rounded-xl shadow-xl border-zinc-200">
                
                {/* Cabecera y Buscador */}
                <DialogHeader className="p-4 border-b border-zinc-100 bg-white">
                    <DialogTitle className="text-base font-semibold text-zinc-900">
                        {title}
                    </DialogTitle>
                    <div className="relative mt-3">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                        <input
                            // Evitamos autoFocus para prevenir bugs de Radix UI
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={placeholder}
                            className="w-full pl-9 pr-9 py-2 bg-zinc-50/50 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
                        />
                        {inputValue && (
                            <button
                                type="button"
                                onClick={() => setInputValue("")}
                                className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-700"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </DialogHeader>

                {/* Área de Resultados */}
                <div className="max-h-[400px] min-h-[300px] overflow-y-auto p-2 bg-zinc-50/30">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
                            <Loader2 className="h-6 w-6 animate-spin mb-3" />
                            <span className="text-sm font-medium">Buscando resultados...</span>
                        </div>
                    )}

                    {!isLoading && error && (
                        <div className="p-8 text-center text-sm text-red-500 font-medium">
                            {error}
                        </div>
                    )}

                    {!isLoading && !error && inputValue && results.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
                            <Search className="h-8 w-8 mb-3 text-zinc-300" />
                            <p className="text-sm">No encontramos coincidencias para</p>
                            <p className="text-sm font-semibold text-zinc-900 mt-1">{inputValue}</p>
                        </div>
                    )}

                    {!isLoading && !error && !inputValue && results.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
                            <p className="text-sm">Empieza a escribir para buscar.</p>
                        </div>
                    )}

                    {!isLoading && results.length > 0 && (
                        <div className="flex flex-col gap-1">
                            {results.map((item) => {
                                const key = keyExtractor(item);
                                const isSelected = selectedMap.has(key);

                                return (
                                    <div
                                        key={key}
                                        onClick={() => {
                                            if (multiple) {
                                                toggleItemSelection(item);
                                            } else {
                                                // Si es único, seleccionamos y cerramos inmediatamente
                                                if (onSelect) onSelect(item);
                                                handleClose();
                                            }
                                        }}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer select-none",
                                            isSelected
                                                ? "bg-zinc-100 border-zinc-300"
                                                : "bg-white border-transparent hover:bg-zinc-50"
                                        )}
                                    >
                                        {/* Solo mostramos el Checkbox visualmente en modo múltiple */}
                                        {multiple && (
                                            <Checkbox
                                                checked={isSelected}
                                                onCheckedChange={() => toggleItemSelection(item)}
                                                onClick={(e) => e.stopPropagation()} 
                                            />
                                        )}
                                        
                                        <div className="flex-1 min-w-0">
                                            {renderItem(item, isSelected)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer (Solo requerido si es Múltiple, ya que el único se guarda al clickear) */}
                {multiple && (
                    <DialogFooter className="p-3 border-t border-zinc-100 bg-white flex items-center justify-between sm:justify-between">
                        <span className="text-sm text-zinc-500 font-medium">
                            {selectedMap.size} seleccionado(s)
                        </span>
                        <div className="flex items-center gap-2">
                            <Button type="button" variant="outline" size="sm" onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                onClick={handleConfirm}
                            >
                                <Check className="w-4 h-4 mr-2" />
                                Confirmar selección
                            </Button>
                        </div>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}