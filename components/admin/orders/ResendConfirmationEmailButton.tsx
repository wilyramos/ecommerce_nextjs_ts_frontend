// File: components/admin/orders/ResendConfirmationEmailButton.tsx
"use client";

import { useState, useTransition } from "react";
import { resendOrderConfirmationAction } from "@/actions/order-actions";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

interface Props {
    orderId: string;
    customerEmail: string;
}

export default function ResendConfirmationEmailButton({ orderId, customerEmail }: Props) {
    const [isPending, startTransition] = useTransition();
    const [sent, setSent] = useState(false);

    const handleResend = () => {
        startTransition(async () => {
            const res = await resendOrderConfirmationAction(orderId);
            if (res.ok) {
                toast.success(`Correo reenviado a ${customerEmail}`);
                setSent(true);
                setTimeout(() => setSent(false), 4000);
            } else {
                toast.error(res.error || "Error al reenviar el correo de confirmación");
            }
        });
    };

    return (
        <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResend}
            disabled={isPending}
            className="w-full text-xs font-semibold h-8"
        >
            {isPending ? (
                <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    Enviando...
                </>
            ) : sent ? (
                <>
                    <Check className="w-3.5 h-3.5 text-emerald-500 mr-1.5" />
                    ¡Correo Reenviado!
                </>
            ) : (
                <>
                    <Mail className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                    Reenviar Email de Confirmación
                </>
            )}
        </Button>
    );
}