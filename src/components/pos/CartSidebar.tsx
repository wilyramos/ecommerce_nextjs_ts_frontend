/* File: src/components/pos/CartSidebar.tsx 
    @Author: whramos 
    @Description: Order summary and checkout panel. 
    Handles dual-flow: Real Sale (Stock deduction) & Proforma (Quote).
*/

"use client";

import {
    Trash2, Plus, Minus, CreditCard, Banknote,
    ChevronRight, ShoppingBag, X, Calculator, Loader2, Tag, FileText
} from "lucide-react";

// Stores
import { usePosStore } from "@/src/store/usePosStore";
import { useCheckoutStore } from "@/src/store/useCheckoutStore";
import { useCashStore } from "@/src/store/useCashStore";

// Utils
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CartSidebarProps {
    onClose?: () => void;
    userId: string; // ID del operador actual
}

export const CartSidebar = ({ onClose }: CartSidebarProps) => {
    // 1. ESTADO DEL CARRITO Y TOTALES
    const {
        cart, total, subtotal, itemsCount,
        paymentMethod, totalDiscountAmount, totalSurchargeAmount,
        updateQuantity, removeFromCart, clearCart, setPaymentMethod
    } = usePosStore();

    // 2. ESTADO DE CAJA (Fuente de verdad)
    const { isOpen, currentShiftId } = useCashStore();

    // 3. LÓGICA DE TRANSACCIÓN
    const { executeCheckout, executeQuote, isPending } = useCheckoutStore();

    // --- HANDLER: PROCESAR VENTA REAL ---
    const handlePayment = async () => {
        if (cart.length === 0) return toast.error("El carrito está vacío");
        if (!isOpen || !currentShiftId) return toast.error("Debe abrir turno de caja primero");

        const result = await executeCheckout(
            cart,
            { subtotal, total, discount: totalDiscountAmount, surcharge: totalSurchargeAmount },
            paymentMethod as "CASH" | "CARD"
        );

        if (result.success) {
            toast.success("Venta procesada con éxito");
            clearCart();
            onClose?.();
        } else {
            toast.error(result.message);
        }
    };

    // --- HANDLER: GENERAR PROFORMA ---
    const handleQuote = async () => {
        if (cart.length === 0) return toast.error("Agregue productos para proformar");
        if (!isOpen || !currentShiftId) return toast.error("Caja requerida para proformas");

        const result = await executeQuote(
            cart,
            { subtotal, total, discount: totalDiscountAmount, surcharge: totalSurchargeAmount }
        );

        if (result.success) {
            toast.success("Proforma guardada correctamente");
            clearCart();
            onClose?.();
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[var(--color-bg-primary)] shadow-2xl border-l border-[var(--color-border-default)] overflow-hidden">

            {/* --- HEADER: OPERADOR Y ESTADO DE CAJA --- */}
            <header className="p-6 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-[var(--color-bg-inverse)] text-[var(--color-text-inverse)] p-2.5 rounded-2xl shadow-lg">
                            <ShoppingBag size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-tight text-[var(--color-text-primary)]">Orden Actual</h2>
                            <p className="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest mt-0.5">
                                {itemsCount} productos en lista
                            </p>
                        </div>
                    </div>
                    {onClose && (
                        <button onClick={onClose} className="lg:hidden p-2 hover:bg-[var(--color-surface-hover)] rounded-full transition-colors text-[var(--color-text-tertiary)]">
                            <X size={20} />
                        </button>
                    )}
                </div>
            </header>

            {/* --- LISTADO: PRODUCTOS Y VARIANTES --- */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[var(--color-bg-primary)]">
                {cart.length > 0 ? (
                    cart.map((item) => (
                        <div key={`${item.productId}-${item.variantId}`} className="flex flex-col gap-3 group animate-in slide-in-from-right-4 duration-300">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-[11px] font-black uppercase text-[var(--color-text-primary)] truncate leading-tight">
                                        {item.nombre}
                                    </h4>

                                    {item.atributos && Object.entries(item.atributos).length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                                            {Object.entries(item.atributos).map(([key, value]) => (
                                                <span key={key} className="flex items-center gap-1 px-2 py-0.5 bg-[var(--color-bg-secondary)] text-[8px] font-bold text-[var(--color-text-secondary)] rounded-md border border-[var(--color-border-subtle)] uppercase">
                                                    <Tag size={8} />
                                                    {key}: {value}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.productId, item.variantId)}
                                    className="p-1.5 text-[var(--color-text-tertiary)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-light)] rounded-lg transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between bg-[var(--color-bg-secondary)] p-2 rounded-2xl border border-dashed border-[var(--color-border-default)]">
                                <div className="flex items-center gap-1 bg-[var(--color-bg-primary)] rounded-xl p-1 border border-[var(--color-border-subtle)] shadow-sm">
                                    <button
                                        disabled={item.quantity <= 1}
                                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                                        className="p-1.5 hover:bg-[var(--color-surface-hover)] rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-all disabled:opacity-20"
                                    >
                                        <Minus size={12} strokeWidth={3} />
                                    </button>
                                    <span className="w-8 text-center text-[11px] font-black font-mono text-[var(--color-text-primary)]">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                                        className="p-1.5 hover:bg-[var(--color-surface-hover)] rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-all"
                                    >
                                        <Plus size={12} strokeWidth={3} />
                                    </button>
                                </div>
                                <div className="text-right">
                                    <p className="text-[11px] font-black text-[var(--color-text-primary)] tracking-tighter">
                                        S/ {item.subtotal.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-[var(--color-text-tertiary)] space-y-4">
                        <Calculator size={64} strokeWidth={1} />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">Carrito vacío</p>
                    </div>
                )}
            </div>

            {/* --- FOOTER: FINANZAS Y EJECUCIÓN --- */}
            <footer className="p-6 bg-[var(--color-bg-inverse)] text-[var(--color-text-inverse)] rounded-t-[2.5rem] shadow-2xl space-y-4">

                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { id: 'CASH', label: 'Efectivo', icon: Banknote },
                            { id: 'CARD', label: 'Tarjeta', icon: CreditCard },
                        ].map((method) => (
                            <button
                                key={method.id}
                                onClick={() => setPaymentMethod(method.id)}
                                className={cn(
                                    "flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 transition-all duration-300",
                                    paymentMethod === method.id
                                        ? "border-[var(--color-success)] bg-[var(--color-success)] text-[var(--color-text-inverse)] shadow-lg"
                                        : "border-[var(--color-text-secondary)] bg-transparent text-[var(--color-text-secondary)] hover:border-[var(--color-text-tertiary)]"
                                )}
                            >
                                <method.icon size={14} />
                                <span className="text-[9px] font-black uppercase tracking-widest">{method.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2 border-t border-white/10 pt-4">
                    <div className="flex justify-between items-center opacity-60">
                        <span className="text-[10px] font-bold uppercase tracking-widest">Subtotal</span>
                        <span className="text-xs font-bold font-mono">S/ {subtotal.toFixed(2)}</span>
                    </div>
                    {totalDiscountAmount > 0 && (
                        <div className="flex justify-between items-center text-[var(--color-success)]">
                            <span className="text-[10px] font-bold uppercase tracking-widest">Descuento Global</span>
                            <span className="text-xs font-bold font-mono">- S/ {totalDiscountAmount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-xs font-black uppercase tracking-tighter">Monto Total</span>
                        <span className="text-2xl font-black tracking-tighter text-[var(--color-text-inverse)]">
                            S/ {total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                        disabled={cart.length === 0 || isPending || !isOpen || !currentShiftId}
                        onClick={handlePayment}
                        className={cn(
                            "py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] font-black uppercase tracking-tighter text-[10px] shadow-xl",
                            cart.length > 0 && !isPending && isOpen && currentShiftId
                                ? "bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] hover:opacity-90 shadow-white/10"
                                : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)] cursor-not-allowed opacity-30"
                        )}
                    >
                        {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                Venta <ChevronRight size={14} strokeWidth={3} />
                            </>
                        )}
                    </button>

                    <button
                        disabled={cart.length === 0 || isPending || !isOpen || !currentShiftId}
                        onClick={handleQuote}
                        className="py-4 rounded-2xl flex items-center justify-center gap-2 border border-[var(--color-text-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-inverse)] hover:border-[var(--color-text-inverse)] transition-all font-bold uppercase tracking-tighter text-[10px] disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <FileText size={14} />
                        Proforma
                    </button>
                </div>

                {cart.length > 0 && !isPending && (
                    <button
                        onClick={clearCart}
                        className="w-full text-[9px] font-black uppercase text-[var(--color-text-tertiary)] hover:text-[var(--color-error)] transition-colors pt-2"
                    >
                        Anular Carrito
                    </button>
                )}
            </footer>
        </div>
    );
};