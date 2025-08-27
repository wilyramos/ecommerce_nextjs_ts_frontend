import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';


export type PurchaseItem = {
    _id: string;
    nombre: string;
    precio: number;
    cantidad: number;
    imagen: string;
};

interface Store {
    items: PurchaseItem[];
    addItem: (item: PurchaseItem) => void;
    updateItem: (id: string, quantity: number) => void;
    removeItem: (id: string) => void;
    clearItems: () => void;
}

export const usePurchaseStore = create<Store>()(
    devtools(
        persist(
            (set, get) => ({
                items: [],

                // Agregar un producto (si ya existe, no lo duplica)
                addItem: (item) => set((state) => {
                    const exists = state.items.find((i) => i._id === item._id);
                    if (exists) return state;
                    return { items: [...state.items, item] };
                }),

                // Actualizar cantidad y precio de un producto
                updateItem: (id, quantity) =>
                    set((state) => ({
                        items: state.items.map((i) =>
                            i._id === id ? { ...i, cantidad: quantity } : i
                        ),
                    })),

                // Eliminar un producto
                removeItem: (id) =>
                    set((state) => ({
                        items: state.items.filter((i) => i._id !== id),
                    })),

                // Limpiar todos los productos
                clearItems: () => set({ items: [] }),
            }),
            {
                name: 'purchase-storage-ecomm', // unique store in localStorage
            }
        )
    )
);
