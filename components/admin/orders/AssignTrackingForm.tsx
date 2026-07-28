// File: frontend/components/admin/orders/AssignTrackingForm.tsx
"use client";

import React, { useActionState, startTransition, useState } from "react";
import { assignTrackingAction, type ActionState } from "@/actions/order-actions";
import { type OrderResponse } from "@/src/schemas/order.schema";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Props {
    orderId: string;
    trackingNumber?: string;
}

const COURIER_OPTIONS = [
    { value: "OLVA", label: "Olva Courier" },
    { value: "SHALOM", label: "Shalom" },
    { value: "MARVISUR", label: "Marvisur" },
    { value: "URBANO", label: "Urbano Express" },
    { value: "CUSTOM", label: "Otro / Personalizado" },
];

/**
 * Parsea un tracking con formato "COURIER: CODIGO" en sus partes individuales
 */
function parseTrackingInitial(rawTracking?: string) {
    if (!rawTracking) return { courier: "OLVA", code: "" };
    
    if (rawTracking.includes(":")) {
        const [courierPart, ...codeParts] = rawTracking.split(":");
        const prefix = courierPart.trim().toUpperCase();
        const code = codeParts.join(":").trim();

        const match = COURIER_OPTIONS.find(c => c.value === prefix);
        if (match) {
            return { courier: match.value, code };
        }
    }
    
    return { courier: "OLVA", code: rawTracking };
}

export default function AssignTrackingForm({ orderId, trackingNumber }: Props) {
    const initial = parseTrackingInitial(trackingNumber);
    const [courier, setCourier] = useState<string>(initial.courier);
    const [code, setCode] = useState<string>(initial.code);

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
        
        if (!code.trim()) {
            toast.error("Ingresa el código o número de guía");
            return;
        }

        const formData = new FormData();
        formData.append("orderId", orderId);
        
        // Enviamos el tracking normalizado con formato "COURIER: CODIGO"
        const formattedTracking = `${courier}:${code.trim().toUpperCase()}`;
        formData.append("trackingNumber", formattedTracking);

        startTransition(() => {
            action(formData);
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase text-muted-foreground">
                    Empresa de Transporte / Courier
                </Label>
                <Select value={courier} onValueChange={setCourier}>
                    <SelectTrigger className="w-full h-8 text-xs font-semibold bg-background">
                        <SelectValue placeholder="Seleccionar Courier" />
                    </SelectTrigger>
                    <SelectContent>
                        {COURIER_OPTIONS.map((item) => (
                            <SelectItem key={item.value} value={item.value} className="text-xs font-medium">
                                {item.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="trackingCode" className="text-[11px] font-bold uppercase text-muted-foreground">
                    Número de Guía / Tracking
                </Label>
                <input
                    id="trackingCode"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Ej: 48920192 o 001-92381"
                    required
                    className="w-full text-xs font-mono font-bold px-3 py-2 rounded-md border border-input bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
            </div>

            <Button 
                type="submit" 
                disabled={isPending} 
                variant="secondary" 
                className="w-full h-8 text-xs font-bold uppercase tracking-wider"
            >
                {isPending ? "Asignando..." : "Asignar Tracking"}
            </Button>
        </form>
    );
}