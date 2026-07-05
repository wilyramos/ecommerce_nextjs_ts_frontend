// File: frontend/components/admin/orders/RefundOrderForm.tsx
"use client";

import React, { useActionState, startTransition, useState } from "react";
import { refundOrderAction, type ActionState } from "@/actions/order-actions";
import { type OrderResponse, type OrderStatus } from "@/src/schemas/order.schema";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { RotateCcw, AlertTriangle } from "lucide-react";

interface Props {
    orderId: string;
    orderStatus: OrderStatus;
    paymentStatus?: string;
}

export default function RefundOrderForm({ orderId, orderStatus, paymentStatus }: Props) {
    const [open, setOpen] = useState(false);

    const [, action, isPending] = useActionState(
        async (prevState: ActionState<OrderResponse> | undefined, formData: FormData): Promise<ActionState<OrderResponse>> => {
            const res = await refundOrderAction(prevState, formData);
            if (res.ok) {
                toast.success("Orden reembolsada y stock restituido con éxito");
                setOpen(false); // Cierra el modal ante éxito
            } else {
                toast.error(res.error || "Error al procesar el reembolso");
            }
            return res;
        },
        undefined
    );

    const isEligible = paymentStatus === "approved" && orderStatus !== "delivered" && orderStatus !== "canceled";

    if (!isEligible) return null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(() => {
            action(formData);
        });
    };

    return (
        <div className="pt-4 border-t border-border/60">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full h-8 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                        <RotateCcw className="w-3 h-3" />
                        Gestionar Reembolso
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="hidden" name="orderId" value={orderId} />
                        
                        <DialogHeader>
                            <DialogTitle className="text-sm font-black uppercase tracking-wider text-destructive flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" /> Confirmar Acción Crítica
                            </DialogTitle>
                            <DialogDescription className="text-xs pt-1 leading-normal text-muted-foreground font-medium">
                                Al procesar esta solicitud, la pasarela marcará la transacción como <strong className="text-foreground">REEMBOLSADA</strong>, se restituirá de forma inmediata el stock físico al inventario de almacén y la orden pasará a estado terminal.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-1.5">
                            <Label htmlFor="refundReason" className="text-[11px] font-bold uppercase text-muted-foreground">
                                Motivo del Reembolso (Obligatorio para Auditoría)
                            </Label>
                            <input
                                id="refundReason"
                                name="reason"
                                required
                                placeholder="Ej: Desistimiento antes del envío / Quiebre de stock físico"
                                className="w-full text-xs font-medium px-3 py-2 rounded-md border border-input bg-background placeholder:text-muted-foreground/70 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                            />
                        </div>

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isPending} className="h-8 text-xs font-bold uppercase">
                                Cancelar
                            </Button>
                            <Button type="submit" variant="destructive" disabled={isPending} className="h-8 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                <RotateCcw className="w-3 h-3" />
                                {isPending ? "Procesando..." : "Confirmar Reembolso"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}