import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { CartItem, Product } from '@/src/schemas';

// import { persist } from 'zustand/middleware';

interface Store {
    cart: CartItem[];
    total: number;
    addToCart: (item: Product) => void;
    
}

const initialState = {
    cart: [],
    total: 0,
    addToCart: () => {},
};

export const useCartStore = create<Store>()(devtools((set, get) => ({

    ...initialState,

    addToCart: (item) => {
        const cartItem: CartItem = {
            _id: item._id,
            nombre: item.nombre,
            precio: item.precio,
            cantidad: 1,
            subtotal: item.precio,
            imagenes: item.imagenes,
        };



        set(() => ({
            cart: [...get().cart, cartItem],
            total: get().total + cartItem.subtotal,
        }));
    },


})));
