/* File: src/components/cash-shift/MovementActions.tsx */
"use client";

import { useState, useTransition } from "react";
import { PlusCircle, MinusCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { addCashMovementAction } from "@/actions/cash-actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function MovementActions({ shiftId }: { shiftId: string }) {
    const [isPending, startTransition] = useTransition();
    const [type, setType] = useState<"INCOME" | "EXPENSE" | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const res = await addCashMovementAction({
                shiftId,
                type: type!,
                amount: Number(formData.get("amount")),
                reason: formData.get("reason") as string,
            });

            if (res.success) {
                toast.success("Movimiento registrado");
                setType(null);
            } else {
                toast.error(res.message);
            }
        });
    };

    return (
        <div className="space-y-4">
            {!type ? (
                <div className="grid grid-cols-2 gap-3">
                    <Button
                        variant="accent"
                        onClick={() => setType("INCOME")}
                        className="rounded-sm font-black text-[10px] uppercase tracking-widest gap-2"
                    >
                        <PlusCircle size={14} /> Registrar Ingreso
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={() => setType("EXPENSE")}
                        className="rounded-sm font-black text-[10px] uppercase tracking-widest gap-2"
                    >
                        <MinusCircle size={14} /> Egreso
                    </Button>
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className="p-4 rounded-sm border border-[var(--color-border-strong)] bg-[var(--color-bg-tertiary)] space-y-3"
                >
                    <div className="flex justify-between items-center mb-2">
                        <Label className="text-[9px] font-black uppercase tracking-[0.1em] text-[var(--color-accent-warm)]">
                            Registrar {type === 'INCOME' ? 'Entrada' : 'Salida'}
                        </Label>
                        <button
                            type="button"
                            onClick={() => setType(null)}
                            className="text-[9px] font-bold text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] uppercase"
                        >
                            Cancelar
                        </button>
                    </div>

                    <div className="space-y-1">
                        <Input
                            name="amount"
                            type="number"
                            step="0.10"
                            required
                            autoFocus
                            placeholder="Monto S/"
                        />
                    </div>

                    <div className="space-y-1">
                        <Input
                            name="reason"
                            type="text"
                            required
                            placeholder="Motivo..."
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        variant="accent"
                        className="w-full rounded-sm text-[10px] font-black uppercase tracking-widest gap-2"
                    >
                        {isPending && <Loader2 size={12} className="animate-spin" />}
                        {isPending ? "Procesando" : "Confirmar Movimiento"}
                    </Button>
                </form>
            )}
        </div>
    );
}