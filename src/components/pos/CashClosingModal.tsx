/* File: src/components/pos/CashClosingModal.tsx 
    @Description: Arqueo de caja industrial con resumen de ventas integrado usando Radix Dialog.
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
import { Calculator, Loader2, Receipt, Banknote, History, AlertCircle } from "lucide-react";
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

    // 1. Cargar resumen del sistema al montar
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

    // 2. Manejar respuesta del cierre definitivo
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

        startTransition(() => {
            formAction(payload);
        });
    };

    // Calculamos el balance de movimientos de forma segura para la UI
    const netMovements = (summary?.shift.totalIncomes ?? 0) - (summary?.shift.totalExpenses ?? 0);

    return (
        <Dialog 
            open={true} 
            onOpenChange={(open) => {
                if (!open && !isPending) onClose();
            }}
        >
            <DialogContent className="sm:max-w-lg p-0 border-none bg-white rounded-[2.5rem] shadow-2xl overflow-hidden overflow-y-auto max-h-[95vh] custom-scrollbar">
                
                {/* CABECERA INDUSTRIAL */}
                <div className="p-8 pb-4">
                    <DialogHeader className="flex flex-row items-center gap-4 space-y-0">
                        <div className="h-12 w-12 rounded-2xl bg-black text-white flex items-center justify-center shrink-0">
                            <Calculator size={24} />
                        </div>
                        <div className="text-left">
                            <DialogTitle className="text-xl font-black uppercase tracking-tighter">
                                Arqueo de Caja
                            </DialogTitle>
                            <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                ID Turno: {shiftId.slice(-8)}
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                </div>

                <div className="px-8 pb-8 space-y-8">
                    {/* SECCIÓN 1: RESUMEN DEL SISTEMA */}
                    {isLoading ? (
                        <div className="h-32 flex flex-col items-center justify-center gap-3 bg-slate-50 rounded-3xl border border-dashed border-slate-200 animate-pulse">
                            <Loader2 className="animate-spin text-slate-300" size={24} />
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Sincronizando totales...</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 bg-slate-900 rounded-[2rem] p-6 text-white">
                                <div className="flex items-center gap-2 mb-4 opacity-40">
                                    <Receipt size={14} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Cómputo del Sistema</span>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-[10px] font-bold opacity-50 uppercase mb-1">Efectivo Esperado</p>
                                        <p className="text-4xl font-black tracking-tighter">
                                            S/ {summary?.shift.expectedBalance.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1.5 text-emerald-400 justify-end mb-1">
                                            <History size={12} />
                                            <span className="text-[10px] font-black uppercase">{summary?.salesCount} Ventas</span>
                                        </div>
                                        <p className="text-[10px] font-bold opacity-50 uppercase">Total Operado</p>
                                        <p className="text-sm font-black">S/ {summary?.calculatedTotal.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">Saldo Inicial</span>
                                <span className="text-xs font-bold text-slate-600">S/ {summary?.shift.initialBalance.toFixed(2)}</span>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">Ingresos / Egresos</span>
                                <span className={cn(
                                    "text-xs font-bold",
                                    netMovements >= 0 ? "text-emerald-600" : "text-red-600"
                                )}>
                                    S/ {netMovements.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* SECCIÓN 2: FORMULARIO DE CIERRE */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase text-slate-900 ml-2">Monto Físico en Caja (Efectivo)</Label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors z-10">
                                    <Banknote size={24} />
                                </div>
                                <Input
                                    name="realBalance"
                                    type="number"
                                    step="0.10"
                                    required
                                    className="h-20 pl-16 pr-8 bg-slate-50 border-2 border-slate-100 rounded-3xl text-3xl font-black focus-visible:ring-black focus-visible:border-black transition-all outline-none"
                                    placeholder="0.00"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Observaciones / Notas de Arqueo</Label>
                            <textarea
                                name="notes"
                                className="w-full h-24 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus-visible:ring-black focus-visible:border-black transition-all outline-none resize-none"
                                placeholder="Especifique si hay sobrantes, faltantes o motivos de descuadre..."
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isPending || isLoading}
                            className="w-full h-16 rounded-2xl bg-black text-white hover:bg-slate-900 transition-all active:scale-[0.98] shadow-xl shadow-black/5 gap-3"
                        >
                            {isPending ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <span className="font-black uppercase tracking-widest text-xs">Finalizar Turno y Cerrar Caja</span>
                            )}
                        </Button>
                    </form>
                </div>

                {/* ADVERTENCIA CRÍTICA */}
                <div className="bg-amber-50 p-6 flex items-start gap-4 border-t border-amber-100">
                    <AlertCircle size={20} className="text-amber-600 shrink-0" />
                    <p className="text-[10px] font-bold text-amber-700 uppercase leading-relaxed tracking-tight">
                        Atención: Al confirmar, el sistema registrará la diferencia entre el monto esperado y el físico. Esta operación quedará auditada y el terminal se bloqueará para ventas hasta una nueva apertura.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};