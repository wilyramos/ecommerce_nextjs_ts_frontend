// File: src/components/cash-shift/CashStoreSync.tsx
"use client";

import { useEffect } from "react";
import { useCashStore } from "@/src/store/useCashStore";

interface Props {
    isOpen: boolean;
    shiftId: string | null;
}

export function CashStoreSync({ isOpen, shiftId }: Props) {
    const setOpen = useCashStore((state) => state.setOpen);

    useEffect(() => {
        // Forzamos al store de cliente a sincronizarse con el servidor
        setOpen(isOpen, shiftId);
    }, [isOpen, shiftId, setOpen]);

    return null; // No renderiza nada, es solo lógica
}