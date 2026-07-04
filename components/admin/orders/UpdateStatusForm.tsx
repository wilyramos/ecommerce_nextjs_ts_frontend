// File: frontend/components/admin/orders/UpdateStatusForm.tsx
"use client";

import React, { useActionState, startTransition } from "react";
import { updateOrderStatusAction, type ActionState } from "@/actions/order-actions";
import { ORDER_STATUS_LABELS, OrderStatus, type OrderResponse } from "@/src/schemas/order.schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
    orderId: string;
    currentStatus: OrderStatus;
}

export default function UpdateStatusForm({ orderId, currentStatus }: Props) {
    const [, action, isPending] = useActionState(
        async (prevState: ActionState<OrderResponse> | undefined, formData: FormData) => {
            const res = await updateOrderStatusAction(prevState, formData);
            if (res.ok) {
                toast.success("Estado de la orden actualizado correctamente");
            } else {
                toast.error(res.error || "Ocurrió un error");
            }
            return res;
        },
        undefined
    );

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(() => {
            action(formData);
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3.5 border-b pb-4 border-border/60">
            <input type="hidden" name="orderId" value={orderId} />
            
            <div className="space-y-1.5">
                <Label htmlFor="status" className="text-[11px] font-bold uppercase text-muted-foreground">Estado Logístico</Label>
                <Select name="status" defaultValue={currentStatus}>
                    <SelectTrigger id="status" className="h-9 text-xs font-semibold">
                        <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value} className="text-xs font-medium">
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="reason" className="text-[11px] font-bold uppercase text-muted-foreground">Motivo del Cambio (Auditoría)</Label>
                <input
                    id="reason"
                    name="reason"
                    required
                    placeholder="Ej: Pago verificado manualmente / En camino a almacén"
                    className="w-full text-xs font-medium px-3 py-2 rounded-md border border-input bg-background placeholder:text-muted-foreground/70 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                />
            </div>

            <Button type="submit" disabled={isPending} className="w-full h-8 text-xs font-bold uppercase tracking-wider">
                {isPending ? "Actualizando..." : "Guardar Estado"}
            </Button>
        </form>
    );
}