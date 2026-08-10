// frontend/src/features/v3/admin-search/types/admin-search.types.ts
import { ReactNode } from "react";
import type { ActionState } from "@/actions/product-actions-v3";

export interface AdminEntitySearchModalProps<T> {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    placeholder?: string;
    searchAction: (query: string, limit?: number) => Promise<ActionState<T[]>>;
    renderItem: (item: T, isSelected: boolean) => ReactNode;
    keyExtractor: (item: T) => string;
    
    /** Modo de selección múltiple (Estilo Resource Picker de Shopify) */
    multiple?: boolean;
    
    /** Callback para selección múltiple */
    onSelectMultiple?: (items: T[]) => void;
    
    /** Callback para selección única (si multiple es false) */
    onSelect?: (item: T) => void;
    
    /** Ítems pre-seleccionados para marcar los checkboxes de origen */
    initialSelectedItems?: T[];
}