// File: frontend/components/admin/orders/AssignTrackingForm.tsx
"use client";

import React, { useActionState, startTransition } from "react";
import { assignTrackingAction, type ActionState } from "@/actions/order-actions";
import { type OrderResponse } from "@/src/schemas/order.schema";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
    orderId: string;
    trackingNumber?: string;
}

export default function AssignTrackingForm({ orderId, trackingNumber }: Props) {
    const [, action, isPending] = useActionState(
        async (prevState: ActionState<OrderResponse> | undefined, formData: FormData): Promise<ActionState<OrderResponse>> => {
            const res = await assignTrackingAction(prevState, formData);
            if (res.ok) {
                toast.success("Número de tracking asignado con éxito");
            } else {
                toast.error(res.error || "Error asignando guía");
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
        <form onSubmit={handleSubmit} className="space-y-3.5">
            <input type="hidden" name="orderId" value={orderId} />
            
            <div className="space-y-1.5">
                <Label htmlFor="trackingNumber" className="text-[11px] font-bold uppercase text-muted-foreground">Número de Guía / Tracking</Label>
                <input
                    id="trackingNumber"
                    name="trackingNumber"
                    defaultValue={trackingNumber || ""}
                    placeholder="Ej: OLVA-908231"
                    required
                    className="w-full text-xs font-semibold px-3 py-2 rounded-md border border-input bg-background focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                />
            </div>

            <Button type="submit" disabled={isPending} variant="secondary" className="w-full h-8 text-xs font-bold uppercase tracking-wider">
                {isPending ? "Asignando..." : "Asignar Tracking"}
            </Button>
        </form>
    );
}