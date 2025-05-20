import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
// import { persist } from 'zustand/middleware';

interface Store {
    cart: any[];
    addToCart: (item: any) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
}

const initialState = {
    cart: [],
}

export const useCartStore = create<Store>()(devtools((set, get) => ({
    ...initialState,
    addToCart: (item) => {
        set((state) => ({ cart: [...state.cart, item] }));
        console.log("Item added to cart:", item);
    },
    removeFromCart: (id) => {
        const cart = get().cart;
        set({ cart: cart.filter((item) => item.id !== id) });
    },
    clearCart: () => set(initialState),


})));
