'use client';

import { useState, useTransition } from "react";
import { updateStatusAction } from "@/actions/order/update-order-action";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Espeja el enum del backend
type OrderStatus =
    | 'awaiting_payment'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'canceled'
    | 'paid_but_out_of_stock';

// Estados terminales: no permiten ninguna acción
const TERMINAL_STATUSES: OrderStatus[] = ['delivered', 'canceled'];

// Estados donde el stock YA fue descontado (webhook lo hizo)
// awaiting_payment NO está aquí → cancelar desde ese estado no restaura nada
const STATUSES_WITH_DEDUCTED_STOCK: OrderStatus[] = [
    'processing',
    'shipped',
    'paid_but_out_of_stock',
];

interface ConfirmConfig {
    title: string;
    description: string;
    variant: 'default' | 'destructive';
    label: string;
}

// Recibe currentStatus para saber si hay stock involucrado en la cancelación
const getConfirmConfig = (
    targetStatus: string,
    currentStatus: OrderStatus
): ConfirmConfig => {
    switch (targetStatus) {
        case 'canceled': {
            const willRestoreStock = STATUSES_WITH_DEDUCTED_STOCK.includes(currentStatus);
            return {
                title: 'Confirmar cancelación',
                description: willRestoreStock
                    ? 'Esta acción cancelará la orden y devolverá automáticamente los productos al inventario. ¿Deseas continuar?'
                    : 'La orden será cancelada. El pago no fue confirmado, por lo que no hay stock que devolver.',
                variant: 'destructive',
                label: 'Confirmar cancelación',
            };
        }
        case 'shipped':
            return {
                title: 'Confirmar envío',
                description: 'El estado cambiará a "Enviado". Asegúrate de haber generado la guía de despacho.',
                variant: 'default',
                label: 'Marcar como enviado',
            };
        case 'delivered':
            return {
                title: 'Confirmar entrega',
                description: '¿Confirmas que el pedido fue entregado exitosamente al cliente?',
                variant: 'default',
                label: 'Confirmar entrega',
            };
        case 'processing':
            return {
                title: 'Re-procesar orden',
                description: 'Se intentará descontar el stock nuevamente. Asegúrate de haber repuesto el inventario antes de continuar.',
                variant: 'default',
                label: 'Re-procesar',
            };
        default:
            return {
                title: 'Confirmar cambio',
                description: `¿Cambiar estado a "${targetStatus.replace(/_/g, ' ')}"?`,
                variant: 'default',
                label: 'Confirmar',
            };
    }
};

interface OrderActionsProps {
    orderId: string;
    currentStatus: OrderStatus;
}

export default function OrderActions({ orderId, currentStatus }: OrderActionsProps) {
    const [isPending, startTransition] = useTransition();
    const [pendingStatus, setPendingStatus] = useState<string | null>(null);

    const executeUpdate = () => {
        if (!pendingStatus) return;

        startTransition(async () => {
            const result = await updateStatusAction(orderId, pendingStatus);
            if (result.success) {
                toast.success('Estado actualizado correctamente');
                setPendingStatus(null);
            } else {
                toast.error(result.error ?? 'Error al actualizar el estado');
                setPendingStatus(null);
            }
        });
    };

    const config = pendingStatus
        ? getConfirmConfig(pendingStatus, currentStatus)
        : null;

    // No mostrar nada si la orden está en estado terminal
    if (TERMINAL_STATUSES.includes(currentStatus)) return null;

    const willRestoreStock =
        pendingStatus === 'canceled' &&
        STATUSES_WITH_DEDUCTED_STOCK.includes(currentStatus);

    return (
        <>
            <div className="flex flex-wrap gap-2">

                {/* processing → shipped */}
                {currentStatus === 'processing' && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPendingStatus('shipped')}
                        className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                    >
                        Marcar como enviado
                    </Button>
                )}

                {/* shipped → delivered */}
                {currentStatus === 'shipped' && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPendingStatus('delivered')}
                        className="bg-green-600 text-white hover:bg-green-700 hover:text-white"
                    >
                        Confirmar entrega
                    </Button>
                )}

                {/* paid_but_out_of_stock → processing (admin repuso stock) */}
                {currentStatus === 'paid_but_out_of_stock' && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPendingStatus('processing')}
                        className="bg-orange-500 text-white hover:bg-orange-600 hover:text-white"
                    >
                        Re-intentar procesar
                    </Button>
                )}

                {/* Cancelar — disponible en todos los estados no terminales.
                    El label cambia según si hay stock que devolver o no. */}
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setPendingStatus('canceled')}
                >
                    {STATUSES_WITH_DEDUCTED_STOCK.includes(currentStatus)
                        ? 'Cancelar y devolver stock'
                        : 'Cancelar orden'
                    }
                </Button>
            </div>

            <Dialog
                open={!!pendingStatus}
                onOpenChange={(open) => {
                    if (!open && !isPending) setPendingStatus(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{config?.title}</DialogTitle>
                        <DialogDescription>{config?.description}</DialogDescription>
                    </DialogHeader>

                    {/* Aviso adicional cuando se va a restaurar stock */}
                    {willRestoreStock && (
                        <p className="text-xs text-muted-foreground border border-dashed rounded-md px-3 py-2">
                            Los productos volverán al inventario de forma automática.
                        </p>
                    )}

                    <DialogFooter>
                        <Button
                            variant="ghost"
                            onClick={() => setPendingStatus(null)}
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant={config?.variant}
                            onClick={executeUpdate}
                            disabled={isPending}
                        >
                            {isPending ? 'Procesando...' : config?.label}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}