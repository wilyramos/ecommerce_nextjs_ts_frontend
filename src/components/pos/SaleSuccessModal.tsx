/* File: src/components/pos/SaleSuccessModal.tsx 
    @Description: Post-sale summary modal. Provides feedback and printing options.
*/
"use client";

import { useCheckoutStore } from "@/src/store/useCheckoutStore";
import { CheckCircle2, Printer, ArrowRight } from "lucide-react";

export const SaleSuccessModal = () => {
    const { lastResult } = useCheckoutStore();

    // Close logic: Clears the last result from the store
    const handleClose = () => {
        useCheckoutStore.setState({ lastResult: null });
    };

    const handlePrint = () => {
        if (!lastResult?._id) return;
        // Open the ticket in a new tab for printing
        const printUrl = `/api/sales/${lastResult._id}/ticket`;
        window.open(printUrl, "_blank", "noopener,noreferrer");
    }



    if (!lastResult) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center animate-in fade-in duration-300 p-4">
            <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-[3rem] p-10 shadow-2xl text-center">

                {/* Status Icon */}
                <div className="flex justify-center mb-6">
                    <div className="h-24 w-24 bg-emerald-50 text-emerald-500 rounded-[2.5rem] flex items-center justify-center border-2 border-emerald-100 shadow-inner animate-bounce-short">
                        <CheckCircle2 size={48} strokeWidth={2.5} />
                    </div>
                </div>

                <div className="space-y-2 mb-8">
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-black">Venta Exitosa</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Transacción #{lastResult._id?.toString().slice(-6)}</p>
                </div>

                {/* Amount Summary */}
                <div className="bg-slate-50 rounded-3xl p-6 mb-8 border border-slate-100">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Cobrado</span>
                    <div className="text-4xl font-black tracking-tighter text-black mt-1">
                        S/ {lastResult.totalPrice.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 bg-white border border-slate-200 rounded-full">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[9px] font-black uppercase text-slate-500">{lastResult.paymentMethod}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 gap-3">
                    <button
                        onClick={handlePrint}
                        className="flex items-center justify-center gap-3 w-full h-14 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:opacity-90 transition-all shadow-xl shadow-black/10 active:scale-95"
                    >
                        <Printer size={16} />
                        Generar Ticket
                    </button>

                    <button
                        onClick={handleClose}
                        className="flex items-center justify-center gap-3 w-full h-14 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
                    >
                        Continuar
                        <ArrowRight size={16} />
                    </button>

                </div>
            </div>
        </div>
    );
};