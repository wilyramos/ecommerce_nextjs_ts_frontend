/* File: src/store/useCheckoutStore.ts 
    @Description: State manager for checkout and proformas.
*/
import { create } from 'zustand';
import { createSaleAction, createQuoteAction } from '../actions/sale-actions';
import { CreateSalePayload, Sale } from '@/src/schemas/sale.schema';
import { CartItem } from './usePosStore';

interface CheckoutState {
    isPending: boolean;
    lastResult: Sale | null;
    employeeId: string;
    cashShiftId: string;
    setSession: (employeeId: string, cashShiftId: string) => void;
    // Acción para venta real
    executeCheckout: (
        cart: CartItem[], 
        totals: { subtotal: number; total: number; discount: number; surcharge: number },
        method: "CASH" | "CARD"
    ) => Promise<{ success: boolean; message: string }>;
    // Nueva acción para Proforma
    executeQuote: (
        cart: CartItem[],
        totals: { subtotal: number; total: number; discount: number; surcharge: number }
    ) => Promise<{ success: boolean; message: string }>;
}

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
    isPending: false,
    lastResult: null,
    employeeId: "",
    cashShiftId: "",

    setSession: (employeeId, cashShiftId) => set({ employeeId, cashShiftId }),

    executeCheckout: async (cart, totals, method) => {
        const { employeeId, cashShiftId } = get();
        if (!employeeId || !cashShiftId) return { success: false, message: "Falta sesión de caja" };

        set({ isPending: true });
        const payload: CreateSalePayload = {
            status: "COMPLETED",
            employee: employeeId,
            cashShiftId: cashShiftId,
            items: cart.map(item => ({
                product: item.productId,
                quantity: item.quantity,
                price: item.precio,
                cost: item.costo,
                variantId: item.variantId,
                discount: item.discount || 0
            })),
            subtotal: totals.subtotal,
            totalDiscountAmount: totals.discount,
            totalSurchargeAmount: totals.surcharge,
            totalPrice: totals.total,
            paymentMethod: method,
            paymentStatus: "approved",
            deliveryMethod: "PICKUP",
            isQuote: false,
            receiptType: "TICKET",
        };

        const result = await createSaleAction({ success: false, message: "" }, payload);
        set({ isPending: false, lastResult: result.success ? result.data : null });
        return { success: result.success, message: result.message };
    },

    executeQuote: async (cart, totals) => {
        const { employeeId, cashShiftId } = get();
        if (!employeeId || !cashShiftId) return { success: false, message: "Falta sesión de caja" };

        set({ isPending: true });
        const payload: CreateSalePayload = {
            status: "QUOTE", // Estado inicial de proforma
            employee: employeeId,
            cashShiftId: cashShiftId,
            items: cart.map(item => ({
                product: item.productId,
                quantity: item.quantity,
                price: item.precio,
                cost: item.costo,
                variantId: item.variantId,
                discount: item.discount || 0
            })),
            subtotal: totals.subtotal,
            totalDiscountAmount: totals.discount,
            totalSurchargeAmount: totals.surcharge,
            totalPrice: totals.total,
            paymentMethod: "CASH", // Default para proforma
            paymentStatus: "pending",
            deliveryMethod: "PICKUP",
            isQuote: true,
            receiptType: "TICKET",
        };

        const result = await createQuoteAction({ success: false, message: "" }, payload);
        set({ isPending: false, lastResult: result.success ? result.data : null });
        return { success: result.success, message: result.message };
    }
}));