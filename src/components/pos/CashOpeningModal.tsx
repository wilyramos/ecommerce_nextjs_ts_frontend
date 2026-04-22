/* File: src/components/pos/CashOpeningModal.tsx 
    @Description: Industrial-grade modal for cash shift initiation using Radix Dialog and Shadcn UI.
*/
"use client";

import React, { useState, useActionState, useEffect, startTransition } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
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
            <DialogContent className="bg-[var(--color-bg-primary)] border-[var(--color-border-default)]">
                <DialogHeader className="text-left mb-4">
                    <DialogTitle className="text-xl font-black uppercase tracking-tighter text-[var(--color-text-primary)]">
                        Apertura de Caja
                    </DialogTitle>
                    
                </DialogHeader>

                <form onSubmit={handleOpen} className="space-y-6">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase text-[var(--color-text-secondary)] ml-1">
                            Efectivo Inicial (S/)
                        </Label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] group-focus-within:text-[var(--color-text-primary)] transition-colors z-10">
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
                                className="h-12 pl-12 pr-4 bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border-default)] text-2xl font-black text-[var(--color-text-primary)] focus-visible:ring-[var(--color-action-primary)] focus-visible:border-[var(--color-action-primary)] transition-all outline-none"
                                autoFocus
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-[var(--color-bg-inverse)] text-[var(--color-text-inverse)] hover:opacity-90 transition-all active:scale-[0.98] gap-3"
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
                    <p className="text-[9px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-tighter">
                        Asegúrese de contar el efectivo físico antes de confirmar
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};