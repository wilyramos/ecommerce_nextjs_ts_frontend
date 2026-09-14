// File: frontend/components/home/product/PaymentNotice.tsx
"use client";

import { CreditCard } from "lucide-react";

type Props = {
    price: number;
    installments?: number;
};

export default function PaymentNotice({ price, installments = 6 }: Props) {
    const installmentAmount = (price / installments).toFixed(2);

    return (
        <div className="flex w-full items-center justify-between gap-3 rounded-radius-lg border border-border-primary/80 bg-surface-secondary/40 px-3.5 py-3">
            <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-radius-md border border-border-primary/60 bg-surface-primary shadow-2xs">
                    <CreditCard className="size-4 text-text-primary" />
                </div>
                <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-text-primary">
                        Hasta {installments} cuotas sin tarjeta
                    </p>
                    <p className="truncate text-[10px] text-text-tertiary">
                        Procesado con Cuotealo
                    </p>
                </div>
            </div>

            <div className="flex shrink-0 items-baseline border-l border-border-primary/70 pl-3">
                <span className="text-[10px] font-medium text-text-secondary mr-0.5">S/</span>
                <span className="text-base font-semibold tracking-tight text-text-primary">
                    {installmentAmount}
                </span>
                <span className="ml-0.5 text-[10px] text-text-tertiary">/mes</span>
            </div>
        </div>
    );
}