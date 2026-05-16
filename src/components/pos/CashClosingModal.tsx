/* File: src/components/pos/CashClosingModal.tsx 
    @Description: Arqueo de caja industrial con diseño Flat y resumen de ventas detallado.
*/
"use client";

import React, { useActionState, useEffect, useState, startTransition } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { closeCashAction, getCashSummaryAction } from '@/actions/cash-actions';
import { useCashStore } from "@/src/store/useCashStore";
import { Calculator, Loader2, Banknote, History, AlertCircle, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { CashSummary } from '@/src/schemas/cash.schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export const CashClosingModal = ({ userId, shiftId, onClose }: { userId: string; shiftId: string; onClose: () => void }) => {
    const resetCash = useCashStore((state) => state.reset);
    const [summary, setSummary] = useState<CashSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [state, formAction, isPending] = useActionState(closeCashAction, { success: false, message: "" });

    useEffect(() => {
        async function fetchSummary() {
            const res = await getCashSummaryAction(shiftId);
            if (res.success && res.data) {
                setSummary(res.data);
            } else {
                toast.error("No se pudo cargar el resumen de ventas");
            }
            setIsLoading(false);
        }
        fetchSummary();
    }, [shiftId]);

    useEffect(() => {
        if (state.success) {
            resetCash();
            toast.success(state.message);
            onClose();
        } else if (state.message && !state.success) {
            toast.error(state.message);
        }
    }, [state, resetCash, onClose]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const payload = {
            shiftId,
            userId,
            realBalance: Number(formData.get("realBalance")),
            notes: formData.get("notes") as string
        };
        startTransition(() => { formAction(payload); });
    };

    const netMovements = (summary?.shift.totalIncomes ?? 0) - (summary?.shift.totalExpenses ?? 0);

    return (
        <Dialog 
            open={true} 
            onOpenChange={(open) => { if (!open && !isPending) onClose(); }}
        >
            <DialogContent className="sm:max-w-lg p-0 border border-gray-200 bg-white overflow-hidden shadow-none rounded-none">
                
                {/* HEADER INDUSTRIAL */}
                <div className="bg-gray-900 p-8 text-white">
                    <DialogHeader className="flex flex-row items-center gap-4 space-y-0">
                        <div className="h-12 w-12 bg-white/10 flex items-center justify-center">
                            <Calculator size={24} className="text-gray-400" />
                        </div>
                        <div className="text-left">
                            <DialogTitle className="text-xl font-black uppercase tracking-tighter">
                                Arqueo de Turno
                            </DialogTitle>
                            <DialogDescription className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">
                                Turno Activo: {shiftId.slice(-8)}
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    {/* KPI PRINCIPAL: EFECTIVO ESPERADO */}
                    <div className="mt-8 border-t border-white/10 pt-6">
                        <div className="flex items-center gap-2 mb-2 opacity-50">
                            <Banknote size={14} />
                            <span className="text-[9px] font-black uppercase tracking-widest">Efectivo esperado en caja</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black tracking-tighter">
                                S/ {summary?.shift.expectedBalance.toFixed(2) ?? "0.00"}
                            </span>
                            <span className="text-xs font-bold text-gray-500 uppercase">Fondo + Ventas + Movs</span>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    
                    {/* SECCIÓN 1: DESGLOSE TÉCNICO */}
                    {isLoading ? (
                        <div className="h-20 flex items-center justify-center bg-gray-50 border border-dashed border-gray-200 animate-pulse">
                            <Loader2 className="animate-spin text-gray-300" size={20} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-1 border border-gray-100 bg-gray-100">
                            <div className="bg-white p-4">
                                <span className="text-[8px] font-black text-gray-400 uppercase block mb-1">Fondo Inicial</span>
                                <span className="text-xs font-bold text-gray-900">S/ {summary?.shift.initialBalance.toFixed(2)}</span>
                            </div>
                            <div className="bg-white p-4">
                                <span className="text-[8px] font-black text-gray-400 uppercase block mb-1">Ventas (Cash)</span>
                                <span className="text-xs font-bold text-green-600">S/ {summary?.shift.totalSalesCash.toFixed(2)}</span>
                            </div>
                            <div className="bg-white p-4">
                                <span className="text-[8px] font-black text-gray-400 uppercase block mb-1">Movimientos</span>
                                <span className={cn("text-xs font-bold", netMovements >= 0 ? "text-blue-600" : "text-red-600")}>
                                    {netMovements > 0 ? "+" : ""} S/ {netMovements.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* SECCIÓN 2: AUDITORÍA DE DOCUMENTOS */}
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 border border-gray-100">
                        <div className="flex items-center gap-3">
                            <History size={16} className="text-gray-400" />
                            <div>
                                <p className="text-[8px] font-black text-gray-400 uppercase">Docs Emitidos</p>
                                <p className="text-xs font-bold">{summary?.salesCount ?? 0} Operaciones</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <TrendingUp size={16} className="text-gray-400" />
                            <div>
                                <p className="text-[8px] font-black text-gray-400 uppercase">Venta Total (Neto)</p>
                                <p className="text-xs font-bold">S/ {summary?.calculatedTotal.toFixed(2) ?? "0.00"}</p>
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN 3: INGRESO DE MONTO REAL */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase text-gray-900 tracking-widest">
                                Conteo Físico Real (Efectivo)
                            </Label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 font-black text-xl">S/</div>
                                <Input
                                    name="realBalance"
                                    type="number"
                                    step="0.10"
                                    required
                                    className="h-16 pl-12 text-3xl font-black bg-white border-2 border-gray-900 rounded-none focus-visible:ring-0 transition-all outline-none"
                                    placeholder="0.00"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Observaciones</Label>
                            <textarea
                                name="notes"
                                className="w-full h-20 p-3 bg-gray-50 border border-gray-200 text-xs font-medium outline-none focus:border-gray-900 resize-none rounded-none"
                                placeholder="Indique si hay sobrantes o faltantes..."
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isPending || isLoading}
                            className="w-full h-14 bg-gray-900 text-white hover:bg-gray-800 rounded-none transition-all gap-3"
                        >
                            {isPending ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <span className="font-black uppercase tracking-widest text-[10px]">Cerrar Turno y Bloquear Terminal</span>
                            )}
                        </Button>
                    </form>
                </div>

                {/* ADVERTENCIA DE CIERRE */}
                <div className="bg-red-50 p-6 border-t border-red-100 flex gap-4">
                    <AlertCircle size={18} className="text-red-600 shrink-0" />
                    <p className="text-[9px] font-bold text-red-700 uppercase leading-relaxed tracking-tight">
                        Aviso: Al confirmar el arqueo, el turno se marcará como cerrado. No podrá realizar más ventas ni modificar movimientos hasta una nueva apertura. La diferencia será auditada por el sistema.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};