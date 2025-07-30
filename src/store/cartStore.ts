import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { CartItem, ProductWithCategoryResponse } from '@/src/schemas';
import { saveCartToDB } from '@/lib/api/cart';


interface Store {
    cart: CartItem[];
    isCartOpen: boolean;
    setCartOpen: (isOpen: boolean) => void; 

    total: number;
    dni: string | null;

    addToCart: (item: ProductWithCategoryResponse) => void;
    updateQuantity: (id: string, quantity: number) => void;
    removeFromCart: (id: string) => void;

    clearCart: () => void;
    saveCart: () => Promise<void>;
    calculateTotal: () => void;

    setDni: (dni: string) => void;
    clearDni: () => void;
}

const initialState = {
    cart: [],
    isCartOpen: false,
    setCartOpen: () => {}, // Función para abrir/cerrar el carrito

    total: 0,
    dni: null,

    addToCart: () => { },
    updateQuantity: () => { },
    removeFromCart: () => { },

    calculateTotal: () => { },
    clearCart: () => { },
    saveCart: async () => { },

    setDni: () => { },
    clearDni: () => { },
};

export const useCartStore = create<Store>()(devtools(persist((set, get) => ({

    ...initialState,
    setCartOpen: (isOpen) => {
        set({ isCartOpen: isOpen });
    },

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
                    precio: item.precio ? item.precio : 0,
                    cantidad: 1,
                    subtotal: item.precio ? item.precio : 0,
                    imagenes: item.imagenes || [],
                    stock: item.stock ? item.stock : 0
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

    removeFromCart: (id) => {
        const cart = get().cart
        const productInCart = cart.find((cartItem) => cartItem._id === id)

        if (productInCart) {
            set({
                cart: cart.filter((cartItem) => cartItem._id !== id),
            })
        }

        get().calculateTotal()
    },

    calculateTotal: () => {
        const total = get().cart.reduce((acc, item) => acc + item.subtotal, 0);
        set({ total });
    },

    clearCart: () => {
        set({ cart: [], total: 0 });
    },
    // TODO: Implementar la función para guardar el carrito en la base de datos

    saveCart: async () => {
        const cart = get().cart
        await saveCartToDB(cart)
    },

    setDni: (dni) => {
        set({ dni });
    },
    clearDni: () => {
        set({ dni: null });
    },

}),
    {
        name: 'cart-storage-ecomm', // unique store in localStorage
    }
)));
