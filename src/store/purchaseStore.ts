import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type PurchaseItem = {
    productId: string;
    nombre: string;
    costo: number;
    cantidad: number;
    imagen: string;
    total: number;
};

interface Store {
    items: PurchaseItem[];
    addItem: (item: Omit<PurchaseItem, 'total'>) => boolean; // retorna true si se agregó
    updateItem: (id: string, quantity: number, cost: number) => void;
    removeItem: (id: string) => void;
    clearItems: () => void;
    getTotalAmount: () => number;
}

export const usePurchaseStore = create<Store>()(
    devtools(
        persist(
            (set, get) => ({
                items: [],

                addItem: (item) => {
                    const exists = get().items.some((i) => i.productId === item.productId);
                    if (exists) {
                        // No permitir duplicados
                        return false;
                    }

                    set((state) => ({
                        items: [
                            ...state.items,
                            {
                                ...item,
                                total: item.cantidad * item.costo,
                            },
                        ],
                    }));
                    return true;
                },

                updateItem: (id, quantity, newCosto) =>
                    set((state) => ({
                        items: state.items.map((item) =>
                            item.productId === id
                                ? {
                                      ...item,
                                      cantidad: quantity,
                                      costo: newCosto,
                                      total: quantity * newCosto,
                                  }
                                : item
                        ),
                    })),

                removeItem: (id) =>
                    set((state) => ({
                        items: state.items.filter((i) => i.productId !== id),
                    })),

                clearItems: () => set({ items: [] }),

                getTotalAmount: () =>
                    get().items.reduce((acc, item) => acc + item.total, 0),
            }),
            {
                name: 'purchase-storage-ecomm',
            }
        )
    )
);
