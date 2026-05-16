/* File: components/cash-shift/CashStats.tsx */
import { DollarSign, ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";

interface StatsProps {
    initial: number;
    sales: number;
    incomes: number;
    expenses: number;
    expected: number;
}

/**
 * @architecture POS Cash Stats
 * @description Indicadores financieros con mapeo estricto a paleta institucional.
 */
export const CashStats = ({ initial, sales, incomes, expenses, expected }: StatsProps) => {
    const cards = [
        { label: "Apertura", value: initial, icon: DollarSign, highlight: false },
        { label: "Ventas (Efectivo)", value: sales, icon: ArrowUpRight, highlight: false },
        { label: "Ingresos/Gastos", value: incomes - expenses, icon: ArrowDownRight, highlight: false },
        { label: "Total Esperado", value: expected, icon: Wallet, highlight: true },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => (
                <div 
                    key={card.label} 
                    className={
                        card.highlight 
                            ? "p-5 border border-[var(--color-accent-warm)] bg-[var(--color-accent-warm)] text-[var(--color-text-inverse)] rounded-sm transition-all" 
                            : "p-5 border border-[var(--color-accent-warm-light)] bg-[var(--color-text-inverse)] text-[var(--color-text-primary)] rounded-sm transition-all"
                    }
                >
                    <div className="flex items-center justify-between mb-4">
                        <span className={
                            card.highlight 
                                ? "text-[10px] font-black uppercase tracking-widest text-[var(--color-text-inverse)]" 
                                : "text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)]"
                        }>
                            {card.label}
                        </span>
                        <card.icon 
                            size={16} 
                            className={card.highlight ? "text-[var(--color-text-inverse)]" : "text-[var(--color-accent-warm)]"} 
                        />
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className={
                            card.highlight 
                                ? "text-sm font-medium text-[var(--color-text-inverse)] opacity-70" 
                                : "text-sm font-medium text-[var(--color-text-tertiary)]"
                        }>
                            S/
                        </span>
                        <p className="text-2xl font-mono font-bold tracking-tighter">
                            {card.value.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};