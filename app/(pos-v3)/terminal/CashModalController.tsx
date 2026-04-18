"use client";

import { useState, useEffect } from "react";
import { useCashStore } from "@/src/store/useCashStore";
import { CashOpeningModal } from "@/src/components/pos/CashOpeningModal";

interface Props {
    userId: string;
    isCashOpen: boolean; // Estado inicial que viene del servidor
}

export const CashModalController = ({ userId, isCashOpen }: Props) => {
    // 1. Escuchamos el trigger del Header desde el Store
    const { isModalOpen, toggleModal, isOpen: storeIsOpen } = useCashStore();
    
    // 2. Estado local para cuando el usuario cierra el modal con "X" para navegar
    const [isDismissed, setIsDismissed] = useState(false);

    // Si la caja se abre con éxito, reseteamos el estado de descarte
    useEffect(() => {
        if (storeIsOpen) setIsDismissed(false);
    }, [storeIsOpen]);

    /**
     * LÓGICA DE VISIBILIDAD:
     * El modal se muestra si:
     * (La caja está cerrada SEGÚN SERVIDOR Y no ha sido descartada manualmente)
     * O
     * (Se ha activado manualmente desde el botón del Header)
     */
    const shouldShow = (!isCashOpen && !isDismissed) || isModalOpen;

    if (!shouldShow) return null;

    return (
        <CashOpeningModal 
            userId={userId} 
            onClose={() => {
                setIsDismissed(true); // Permite navegar sin el modal encima
                toggleModal(false);   // Resetea el estado del Store para el Header
            }} 
        />
    );
};