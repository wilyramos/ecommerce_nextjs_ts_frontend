'use client';

import { useTransition } from "react";
import { updateStatusAction } from "@/actions/order/update-order-action";
import { toast } from "sonner"; // O tu librería de notificaciones preferida

export default function OrderActions({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
    const [isPending, startTransition] = useTransition();

    const handleUpdate = async (newStatus: string) => {
        const confirmMsg = newStatus === 'canceled' 
            ? "¿Seguro? Esto devolverá automáticamente los productos al inventario."
            : `¿Cambiar estado a ${newStatus.replace(/_/g, ' ')}?`;

        if (!confirm(confirmMsg)) return;
        
        startTransition(async () => {
            const result = await updateStatusAction(orderId, newStatus);
            if (result.success) {
                toast.success("Estado actualizado correctamente");
            } else {
                toast.error(result.error);
            }
        });
    };

    return (
        <div className="flex flex-wrap gap-2">
            {/* Flujo: Procesamiento -> Envío */}
            {currentStatus === 'processing' && (
                <button 
                    disabled={isPending}
                    onClick={() => handleUpdate('shipped')}
                    className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    {isPending ? 'Procesando...' : 'Marcar como Enviado'}
                </button>
            )}

            {/* Flujo: Sin Stock -> Re-procesar */}
            {currentStatus === 'paid_but_out_of_stock' && (
                <button 
                    disabled={isPending}
                    onClick={() => handleUpdate('processing')}
                    className="text-sm px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
                >
                    {isPending ? 'Validando Stock...' : 'Re-intentar Procesar (Stock Repuesto)'}
                </button>
            )}

            {/* Flujo: Enviado -> Entregado */}
            {currentStatus === 'shipped' && (
                <button 
                    disabled={isPending}
                    onClick={() => handleUpdate('delivered')}
                    className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                    Confirmar Entrega
                </button>
            )}

            {/* Cancelación: Solo si no ha sido entregado o ya cancelado */}
            {!['delivered', 'canceled'].includes(currentStatus) && (
                <button 
                    disabled={isPending}
                    onClick={() => handleUpdate('canceled')}
                    className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
                >
                    Cancelar y Devolver Stock
                </button>
            )}
        </div>
    );
}