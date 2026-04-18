"use client";

import { useEffect } from "react";
import { useCashStore } from "@/src/store/useCashStore";

export const CashStateSync = ({ isOpen, shiftId }: { isOpen: boolean; shiftId?: string }) => {
    const setOpen = useCashStore((state) => state.setOpen);

    useEffect(() => {
        setOpen(isOpen, shiftId);
    }, [isOpen, shiftId, setOpen]);

    return null;
};