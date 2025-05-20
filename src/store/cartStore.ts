import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { CartItem, Product } from '@/src/schemas';

// import { persist } from 'zustand/middleware';

interface Store {
    cart: CartItem[];
    total: number;
    addToCart: (item: Product) => void;
    updateQuantity: (id: string, quantity: number) => void;
    calculateTotal: () => void;
}

const initialState = {
    cart: [],
    total: 0,
    addToCart: () => { },
    updateQuantity: () => { },
    calculateTotal: () => { },
};

export const useCartStore = create<Store>()(devtools((set, get) => ({

    ...initialState,

    addToCart: (item) => {
        const cart = get().cart
        const productInCart = cart.find((cartItem) => cartItem._id === item._id)

        if (productInCart) {
            set({
                cart: cart.map((cartItem) =>
                    cartItem._id === item._id
                        ? { ...cartItem, cantidad: cartItem.cantidad + 1, subtotal: (cartItem.cantidad + 1) * cartItem.precio }
                        : cartItem
                ),
            })
        } else {
            set({
                cart: [...cart, {
                    _id: item._id,
                    nombre: item.nombre,
                    precio: item.precio,
                    cantidad: 1,
                    subtotal: item.precio,
                    imagenes: item.imagenes,
                }],
            })
        }
        get().calculateTotal()
    },


    updateQuantity: (id, quantity) => {
        const cart = get().cart
        const productInCart = cart.find((cartItem) => cartItem._id === id)

        if (productInCart) {
            set({
                cart: cart.map((cartItem) =>
                    cartItem._id === id
                        ? { ...cartItem, cantidad: quantity, subtotal: quantity * cartItem.precio }
                        : cartItem
                ),
            })
        }
    },

    calculateTotal: () => {
        const cart = get().cart
        const total = cart.reduce((acc, item) => acc + item.subtotal, 0)
        set({ total })
    }

})));
