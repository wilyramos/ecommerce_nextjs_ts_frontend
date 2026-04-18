/* File: src/components/pos/CashOpeningModal.tsx 
    @Description: Industrial-grade modal for cash shift initiation using Radix Dialog and Shadcn UI.
*/
"use client";

import React, { useState, useActionState, useEffect, startTransition } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { openCashAction } from '@/actions/cash-actions';
import { useCashStore } from "@/src/store/useCashStore";
import { Banknote, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface Props {
    userId?: string;
    onClose?: () => void;
}

export const CashOpeningModal = ({ userId, onClose }: Props) => {
    const [balance, setBalance] = useState<string>("0");
    const { setOpen, toggleModal } = useCashStore();
    
    const [state, formAction, isPending] = useActionState(openCashAction, { 
        success: false, 
        message: "" 
    });

    useEffect(() => {
        if (state.success && state.data) {
            setOpen(true, state.data._id);
            toggleModal(false);
            toast.success("Caja abierta correctamente");
        } else if (state.message && !state.success) {
            toast.error(state.message);
        }
    }, [state, setOpen, toggleModal]);

    if (!userId) return null;

    const handleOpen = (e: React.FormEvent) => {
        e.preventDefault();
        
        startTransition(() => {
            formAction({ 
                initialBalance: Number(balance), 
                userId 
            });
        });
    };

    return (
        <Dialog 
            open={true} 
            onOpenChange={(isOpen) => {
                if (!isOpen && onClose) onClose();
            }}
        >
            <DialogContent className="sm:max-w-sm rounded-[2.5rem] p-8 border-none shadow-2xl">
                <DialogHeader className="text-left mb-4">
                    <DialogTitle className="text-xl font-black uppercase tracking-tighter text-black">
                        Apertura de Caja
                    </DialogTitle>
                    <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        GOPHONE v3 / Terminal Operativo
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleOpen} className="space-y-6">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">
                            Efectivo Inicial (S/)
                        </Label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-black transition-colors z-10">
                                <Banknote size={20} />
                            </div>
                            <Input
                                name="balance"
                                type="number"
                                step="0.10"
                                min="0"
                                required
                                value={balance}
                                onChange={(e) => setBalance(e.target.value)}
                                placeholder="0.00"
                                className="h-16 pl-12 pr-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-2xl font-black focus-visible:ring-black focus-visible:border-black transition-all outline-none"
                                autoFocus
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full h-16 rounded-2xl bg-black text-white hover:bg-slate-900 transition-all active:scale-[0.98] shadow-xl shadow-black/5 gap-3"
                    >
                        {isPending ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                <span className="font-black uppercase tracking-widest text-xs">Iniciar Turno Ahora</span>
                                <ArrowRight size={18} strokeWidth={3} />
                            </>
                        )}
                    </Button>
                </form>

                <div className="mt-2 text-center">
                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">
                        Asegúrese de contar el efectivo físico antes de confirmar
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};