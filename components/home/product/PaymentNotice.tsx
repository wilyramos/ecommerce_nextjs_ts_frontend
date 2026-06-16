"use client";

type Props = {
    price: number;
    installments?: number;
};

export default function PaymentNotice({ price, installments = 6 }: Props) {
    const installmentAmount = (price / installments).toFixed(2);

    return (
        <div className="flex items-center justify-between gap-4 px-4 py-3.5  border border-border bg-card w-full">

            <div className="flex items-center gap-3 min-w-0">
                <div className="w-[34px] h-[34px] bg-gray-950 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-white " aria-hidden="true">
                        <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                </div>
                <div>
                    <p className="text-[13px] font-medium text-foreground leading-snug">
                        Paga en {installments} cuotas
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">
                        Válido con tarjetas de crédito*
                    </p>
                </div>
            </div>

            <div className="flex items-baseline gap-0.5 shrink-0 pl-4 border-l border-border">
                <span className="text-[11px] font-medium text-action-cta ">S/</span>
                <span className="text-[22px] font-medium text-action-cta  leading-none">{installmentAmount}</span>
                <span className="text-[11px] text-muted-foreground ml-0.5">/cuota</span>
            </div>

        </div>
    );
}