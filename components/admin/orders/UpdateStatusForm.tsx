// File: frontend/components/admin/orders/UpdateStatusForm.tsx
"use client";

import React, { useActionState, startTransition, useState } from "react";
import { updateOrderStatusAction, type ActionState } from "@/actions/order-actions";
import { ORDER_STATUS_LABELS, OrderStatus, type OrderResponse } from "@/src/schemas/order.schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Info } from "lucide-react";

interface Props {
    orderId: string;
    currentStatus: OrderStatus;
}

export default function UpdateStatusForm({ orderId, currentStatus }: Props) {
    const isTerminalStatus = currentStatus === 'delivered' || currentStatus === 'canceled';
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus);

    const [, action, isPending] = useActionState(
        async (prevState: ActionState<OrderResponse> | undefined, formData: FormData): Promise<ActionState<OrderResponse>> => {
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

    const obtenerExplicacionDeEstado = (status: OrderStatus): string => {
        switch (status) {
            case 'awaiting_payment':
                return "La orden se mantiene en espera de fondos. No afecta el inventario físico de productos ni congela stock.";
            case 'processing':
                return "¡Validación de efectivo/transferencia! El sistema verificará y descontará el stock del almacén de forma inmediata y enviará un email de 'Pedido en Preparación' al cliente.";
            case 'shipped':
                return "La orden se marca como despachada. Si no se había cobrado antes, se descuenta el stock ahora. Se envía correo automático con aviso de salida.";
            case 'delivered':
                return "Estado de cierre comercial. Confirma la recepción física por parte del cliente. Bloquea el documento contra cualquier futura modificación accidental.";
            case 'paid_but_out_of_stock':
                return "Registra el pago del dinero pero alerta al equipo sobre un desfase físico en almacén. Envía alerta al cliente para la llamada de soporte.";
            default:
                return "Cambio administrativo de flujo de datos.";
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 border-b pb-5 border-border/60">
            <input type="hidden" name="orderId" value={orderId} />
            
            <div className="space-y-1.5">
                <Label htmlFor="status" className="text-[11px] font-bold uppercase text-muted-foreground">Estado Logístico</Label>
                <Select 
                    name="status" 
                    defaultValue={currentStatus} 
                    disabled={isTerminalStatus || isPending}
                    onValueChange={(val) => setSelectedStatus(val as OrderStatus)}
                >
                    <SelectTrigger id="status" className="h-9 text-xs font-semibold">
                        <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(ORDER_STATUS_LABELS)
                            // Regla de UI: Se remueve el estado 'canceled' para que no sea elegible por error aquí
                            .filter(([value]) => value !== 'canceled')
                            // Si está en espera de pago, no se le permite saltar directo a enviado o entregado sin procesar el stock
                            .filter(([value]) => {
                                if (currentStatus === 'awaiting_payment') {
                                    return value === 'awaiting_payment' || value === 'processing';
                                }
                                return true;
                            })
                            .map(([value, label]) => (
                                <SelectItem key={value} value={value} className="text-xs font-medium">
                                    {label}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>
            </div>

            {!isTerminalStatus && selectedStatus !== currentStatus && (
                <div className="rounded-md bg-blue-500/5 border border-blue-500/20 p-2.5 flex items-start gap-2 text-blue-700 dark:text-blue-400">
                    <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <div className="text-[11px] leading-tight font-medium">
                        <span className="font-bold block mb-0.5">Efecto en Almacén & Clientes:</span>
                        {obtenerExplicacionDeEstado(selectedStatus)}
                    </div>
                </div>
            )}

            <div className="space-y-1.5">
                <Label htmlFor="reason" className="text-[11px] font-bold uppercase text-muted-foreground">Motivo del Cambio (Auditoría)</Label>
                <input
                    id="reason"
                    name="reason"
                    required
                    disabled={isPending || isTerminalStatus}
                    placeholder={isTerminalStatus ? "Flujo cerrado. No requiere auditorías adicionales." : "Ej: Verificado abono en cuenta BCP / Yape recibido"}
                    className="w-full text-xs font-medium px-3 py-2 rounded-md border border-input bg-background placeholder:text-muted-foreground/70 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                />
            </div>

            <Button type="submit" disabled={isPending || isTerminalStatus} className="w-full h-8 text-xs font-bold uppercase tracking-wider">
                {isTerminalStatus ? "Flujo Comercial Cerrado" : isPending ? "Actualizando..." : "Guardar Estado"}
            </Button>
        </form>
    );
}