// File: frontend/app/(store)/checkout-result/verifying/page.tsx
"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Muted } from "@/components/ui/Typography";
import { checkOrderStatusAction } from "@/actions/order-actions";

type Params = Promise<{ orderNumber?: string }>;

export default function VerifyingPaymentPage({ searchParams }: { searchParams: Params }) {
    const { orderNumber } = use(searchParams);
    const router = useRouter();
    const [retries, setRetries] = useState(0);

    useEffect(() => {
        if (!orderNumber) {
            router.replace("/checkout-v2");
            return;
        }

        const verifyStatus = async () => {
            const res = await checkOrderStatusAction(orderNumber);

            if (res.ok) {
                const { status, paymentStatus } = res.data;
                
                // Si la orden ya se encuentra aprobada o procesándose por el Webhook
                if (paymentStatus === "approved" || status === "processing" || status === "shipped") {
                    router.replace(`/checkout-result/success?orderNumber=${orderNumber}`);
                    return;
                }
            }

            // Freno de mano: Máximo 6 reintentos (12 segundos en total) antes de forzar el pase
            if (retries >= 6) {
                router.replace(`/checkout-result/success?orderNumber=${orderNumber}`);
            } else {
                setRetries((prev) => prev + 1);
            }
        };

        const interval = setTimeout(verifyStatus, 2000);
        return () => clearTimeout(interval);
    }, [orderNumber, retries, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 space-y-4 select-none">
            <Loader2 className="w-9 h-9 animate-spin text-orange-600" />
            <h1 className="text-lg font-bold text-foreground">Verificando tu pago</h1>
            <Muted className="text-xs max-w-xs font-semibold leading-relaxed">
                Estamos validando la confirmación de tu pago.
            </Muted>
        </div>
    );
}