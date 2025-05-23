// src/store/shippingStore.ts
import { create } from 'zustand';

export type ShippingFormData = {
    direccion: string;
    ciudad: string;
    telefono: string;
};

interface ShippingState {
    data: ShippingFormData | null;
    setShippingData: (data: ShippingFormData) => void;
    clearShippingData: () => void;
}

export const useShippingStore = create<ShippingState>((set) => ({
    data: null,
    setShippingData: (data) => set({ data }),
    clearShippingData: () => set({ data: null }),
}));
