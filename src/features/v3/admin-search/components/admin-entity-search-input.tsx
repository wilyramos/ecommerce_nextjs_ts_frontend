//File: admin/src/features/v3/admin-search/components/admin-entity-search-input.tsx// frontend/src/features/v3/admin-search/components/admin-entity-search-input.tsx
"use client";

import React, { useState } from "react";
import { Search, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminEntitySearchModal } from "./admin-entity-search-modal";
import type { ActionState } from "@/actions/product-actions-v3";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface AdminEntitySearchInputProps<T> {
    // Configuración del modal
    title?: string;
    placeholder?: string;
    buttonLabel?: string;
    searchAction: (query: string, limit?: number) => Promise<ActionState<T[]>>;
    keyExtractor: (item: T) => string;
    
    // Configuración de renderizado de la fila en el modal
    renderItem: (item: T, isSelected: boolean) => React.ReactNode;
    
    // Configuración de renderizado de la tarjeta seleccionada en el formulario
    renderSelectedCard: (item: T) => {
        title: string;
        subtitle?: string;
        imageUrl?: string;
    };

    // Selección
    multiple?: boolean;
    selectedItems: T[];
    onChange: (items: T[]) => void;
    
    // Estilos
    className?: string;
    emptyMessage?: string;
}

export function AdminEntitySearchInput<T>({
    title = "Buscar elemento",
    placeholder = "Buscar...",
    buttonLabel = "Buscar",
    searchAction,
    keyExtractor,
    renderItem,
    renderSelectedCard,
    multiple = false,
    selectedItems,
    onChange,
    className,
    emptyMessage = "No hay elementos seleccionados.",
}: AdminEntitySearchInputProps<T>) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRemove = (itemToRemove: T) => {
        const keyToRemove = keyExtractor(itemToRemove);
        onChange(selectedItems.filter((item) => keyExtractor(item) !== keyToRemove));
    };

    return (
        <div className={cn("space-y-3", className)}>
            {/* Cabecera / Botón de Acción */}
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-900">
                    Seleccionados ({selectedItems.length})
                </span>
                <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsModalOpen(true)}
                >
                    <Search className="w-4 h-4 mr-2" />
                    {buttonLabel}
                </Button>
            </div>

            {/* Lista de Seleccionados */}
            {selectedItems.length === 0 ? (
                <div className="text-sm text-zinc-400 text-center py-6 bg-zinc-50 border border-dashed border-zinc-200 rounded-lg">
                    {emptyMessage}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedItems.map((item) => {
                        const cardData = renderSelectedCard(item);
                        return (
                            <div 
                                key={keyExtractor(item)} 
                                className="flex items-center gap-3 bg-white border border-zinc-200 p-2 rounded-lg pr-3 group"
                            >
                                {/* Imagen Miniatura */}
                                <div className="h-10 w-10 flex-shrink-0 bg-zinc-100 rounded border border-zinc-200 overflow-hidden flex items-center justify-center">
                                    {cardData.imageUrl ? (
                                        <Image 
                                            src={cardData.imageUrl} 
                                            alt={cardData.title} 
                                            className="h-full w-full object-cover"
                                            width={40}
                                            height={40}
                                            unoptimized
                                        />
                                    ) : (
                                        <ImageIcon className="w-4 h-4 text-zinc-300" />
                                    )}
                                </div>
                                
                                {/* Info */}
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <span className="truncate text-sm font-medium text-zinc-900 leading-tight">
                                        {cardData.title}
                                    </span>
                                    {cardData.subtitle && (
                                        <span className="truncate text-xs text-zinc-500 mt-0.5">
                                            {cardData.subtitle}
                                        </span>
                                    )}
                                </div>

                                {/* Eliminar */}
                                <button 
                                    type="button" 
                                    onClick={() => handleRemove(item)} 
                                    className="text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Instancia del Modal (No se muestra hasta que isModalOpen sea true) */}
            <AdminEntitySearchModal<T>
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={title}
                placeholder={placeholder}
                multiple={multiple}
                searchAction={searchAction}
                keyExtractor={keyExtractor}
                initialSelectedItems={selectedItems}
                onSelectMultiple={(items) => onChange(items)} // Solo se llama si multiple={true}
                onSelect={(item) => onChange([item])}         // Solo se llama si multiple={false}
                renderItem={renderItem}
            />
        </div>
    );
}