/* File: src/components/cash-shift/MovementLog.tsx 
    @Author: whramos 
    @Description: Tabla de auditoría para movimientos manuales de caja con arquitectura de color estricta.
*/

import { ArrowUpRight, ArrowDownLeft, ReceiptText } from "lucide-react";
import { format } from "date-fns";

interface Movement {
    _id: string;
    type: "INCOME" | "EXPENSE";
    amount: number;
    reason: string;
    createdAt: string | Date;
}

interface Props {
    movements: Movement[];
}

export function MovementLog({ movements }: Props) {
    if (!movements || movements.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-[var(--color-text-inverse)]">
                <div className="w-12 h-12 bg-[var(--color-accent-warm-light)] flex items-center justify-center text-[var(--color-text-tertiary)] mb-3 border border-dashed border-[var(--color-accent-warm)]">
                    <ReceiptText size={20} />
                </div>
                <p className="text-[10px] font-black text-[var(--color-text-tertiary)] uppercase tracking-[0.2em]">
                    Sin registros manuales en este turno
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-[var(--color-text-inverse)]">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-[var(--color-accent-warm-light)] border-b border-[var(--color-accent-warm-light)]">
                        <th className="px-6 py-3 text-left text-[9px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest">Hora</th>
                        <th className="px-6 py-3 text-left text-[9px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest">Operación</th>
                        <th className="px-6 py-3 text-left text-[9px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest">Concepto / Motivo</th>
                        <th className="px-6 py-3 text-right text-[9px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest">Monto</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-accent-warm-light)]">
                    {movements.map((m) => {
                        const isIncome = m.type === "INCOME";
                        
                        return (
                            <tr key={m._id} className="hover:bg-[var(--color-accent-warm-light)] transition-colors">
                                <td className="px-6 py-4 text-[10px] font-mono font-bold text-[var(--color-text-tertiary)]">
                                    {format(new Date(m.createdAt), "HH:mm:ss")}
                                </td>
                                <td className="px-6 py-4">
                                    <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-tighter ${
                                        isIncome ? "text-[var(--color-accent-warm)]" : "text-[var(--color-text-primary)]"
                                    }`}>
                                        {isIncome ? 
                                            <ArrowUpRight size={12} strokeWidth={3} className="text-[var(--color-accent-warm)]" /> : 
                                            <ArrowDownLeft size={12} strokeWidth={3} className="text-[var(--color-text-secondary)]" />
                                        }
                                        {isIncome ? "Entrada" : "Salida"}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-[10px] text-[var(--color-text-secondary)] font-bold uppercase tracking-tight max-w-[300px] truncate">
                                    {m.reason}
                                </td>
                                <td className={`px-6 py-4 text-right text-[11px] font-black ${
                                    isIncome ? "text-[var(--color-accent-warm-hover)]" : "text-[var(--color-text-primary)]"
                                }`}>
                                    {isIncome ? "+" : "-"} S/ {m.amount.toFixed(2)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}