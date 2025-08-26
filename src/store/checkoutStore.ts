// src/store/checkoutStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { TShippingAddress } from '../schemas';


type tipoDocumento = 'DNI' | 'RUC' | 'CE';

export type ProfileFormData = {
    userId?: string; // Optional, will be set when the user is logged in
    nombre: string;
    apellidos?: string;
    tipoDocumento: tipoDocumento;
    numeroDocumento: string;
    email: string;
    telefono?: string;
}


interface CheckoutState {
    profile: ProfileFormData | null;
    shipping: TShippingAddress | null;

    setProfile: (data: ProfileFormData) => void;
    setShipping: (data: TShippingAddress) => void;

    clearCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(devtools(persist((set) => ({
    profile: null,
    shipping: null,

    setProfile: (data) => set({ profile: data }),
    setShipping: (data) => set({ shipping: data }),

    clearCheckout: () => set({ profile: null, shipping: null }),

}),
    {
        name: 'checkout-storage_ecom', // unique store in localStorage
    }
)));
