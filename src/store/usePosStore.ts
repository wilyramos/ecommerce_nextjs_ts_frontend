/* File: src/store/usePosStore.ts 
    @Author: whramos 
    @Description: Global POS state management. Zero-Any implementation.
    Fixed: Added missing action definitions for payment and discounts.
*/

import { create } from 'zustand';
import { Product, ProductVariant } from "@/src/schemas/product.schema";

export interface CartItem {
    productId: string;
    variantId?: string;
    nombre: string;
    precio: number;
    costo: number;
    quantity: number;
    discount: number;
    atributos?: Record<string, string>;
    subtotal: number;
}

interface PosState {
    // --- ESTADO ---
    cart: CartItem[];
    subtotal: number;
    totalDiscountAmount: number;
    totalSurchargeAmount: number;
    total: number;
    itemsCount: number;
    paymentMethod: string;

    // --- ACCIONES DEL CARRITO ---
    addToCart: (product: Product, variant?: ProductVariant) => void;
    removeFromCart: (productId: string, variantId?: string) => void;
    updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
    clearCart: () => void;
    
    // --- ACCIONES DE PAGO Y TOTALES (CORREGIDO: Agregadas funciones faltantes) ---
    setPaymentMethod: (method: string) => void;
    setGlobalDiscount: (amount: number) => void;
    setSurcharge: (amount: number) => void;
    
    // Helper interno
    calculateTotals: () => void;
}

export const usePosStore = create<PosState>((set, get) => ({
    cart: [],
    subtotal: 0,
    totalDiscountAmount: 0,
    totalSurchargeAmount: 0,
    total: 0,
    itemsCount: 0,
    paymentMethod: 'CASH',

    addToCart: (product, variant) => {
        const { cart } = get();
        const vId = variant?._id?.toString();
        
        const existingItem = cart.find(item => 
            item.productId === product._id && item.variantId === vId
        );

        let newCart: CartItem[];

        if (existingItem) {
            newCart = cart.map(item => 
                (item.productId === product._id && item.variantId === vId)
                    ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.precio }
                    : item
            );
        } else {
            const newItem: CartItem = {
                productId: product._id as string,
                variantId: vId,
                nombre: variant ? `${product.nombre} (${variant.nombre || 'Var'})` : product.nombre,
                precio: variant?.precio ?? product.precio ?? 0,
                costo: variant?.costo ?? product.costo ?? 0,
                quantity: 1,
                discount: 0,
                atributos: variant?.atributos,
                subtotal: variant?.precio ?? product.precio ?? 0,
            };
            newCart = [...cart, newItem];
        }

        set({ cart: newCart });
        get().calculateTotals();
    },

    removeFromCart: (productId, variantId) => {
        set((state) => ({
            cart: state.cart.filter(item => !(item.productId === productId && item.variantId === variantId))
        }));
        get().calculateTotals();
    },

    updateQuantity: (productId, quantity, variantId) => {
        if (quantity < 1) return;
        set((state) => ({
            cart: state.cart.map(item => 
                (item.productId === productId && item.variantId === variantId)
                    ? { ...item, quantity, subtotal: quantity * item.precio }
                    : item
            )
        }));
        get().calculateTotals();
    },

    clearCart: () => set({ 
        cart: [], 
        subtotal: 0, 
        total: 0, 
        itemsCount: 0, 
        totalDiscountAmount: 0, 
        totalSurchargeAmount: 0,
        paymentMethod: 'CASH' 
    }),

    // --- IMPLEMENTACIÓN DE ACCIONES FALTANTES ---
    setPaymentMethod: (method) => set({ paymentMethod: method }),

    setGlobalDiscount: (amount) => {
        set({ totalDiscountAmount: amount });
        get().calculateTotals();
    },

    setSurcharge: (amount) => {
        set({ totalSurchargeAmount: amount });
        get().calculateTotals();
    },

    calculateTotals: () => {
        const { cart, totalDiscountAmount, totalSurchargeAmount } = get();
        
        const subtotal = cart.reduce((acc, item) => acc + item.subtotal, 0);
        const itemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
        
        // El total final aplica descuentos y recargos
        const totalFinal = subtotal - totalDiscountAmount + totalSurchargeAmount;

        set({ 
            subtotal, 
            total: Math.max(0, totalFinal), 
            itemsCount 
        });
    }
}));