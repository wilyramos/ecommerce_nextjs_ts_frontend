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
        <div className="flex flex-col h-full bg-bg-primary shadow-2xl border-l border-border-default overflow-hidden">

            {/* --- HEADER: OPERADOR Y ESTADO DE CAJA --- */}
            <header className="p-6 border-b border-border-subtle bg-bg-secondary">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-bg-inverse text-text-inverse p-2.5 rounded-2xl shadow-lg">
                            <ShoppingBag size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-tight text-text-primary">Orden Actual</h2>
                            <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mt-0.5">
                                {itemsCount} productos en lista
                            </p>
                        </div>
                    </div>
                    {onClose && (
                        <button onClick={onClose} className="lg:hidden p-2 hover:bg-accent-warm-light rounded-full transition-colors text-text-tertiary cursor-pointer">
                            <X size={20} />
                        </button>
                    )}
                </div>
            </header>

            {/* --- LISTADO: PRODUCTOS Y VARIANTES --- */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-bg-primary">
                {cart.length > 0 ? (
                    cart.map((item) => (
                        <div key={`${item.productId}-${item.variantId}`} className="flex flex-col gap-3 group animate-in slide-in-from-right-4 duration-300">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-[11px] font-black uppercase text-text-primary truncate leading-tight">
                                        {item.nombre}
                                    </h4>

                                    {item.atributos && Object.entries(item.atributos).length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                                            {Object.entries(item.atributos).map(([key, value]) => (
                                                <span key={key} className="flex items-center gap-1 px-2 py-0.5 bg-bg-secondary text-[8px] font-bold text-text-secondary rounded-md border border-border-subtle uppercase">
                                                    <Tag size={8} />
                                                    {key}: {value}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.productId, item.variantId)}
                                    className="p-1.5 text-text-tertiary hover:text-accent-warm-hover hover:bg-accent-warm-light rounded-lg transition-all cursor-pointer"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between bg-bg-secondary p-2 rounded-2xl border border-dashed border-border-default">
                                <div className="flex items-center gap-1 bg-bg-primary rounded-xl p-1 border border-border-subtle shadow-sm">
                                    <button
                                        disabled={item.quantity <= 1}
                                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                                        className="p-1.5 hover:bg-bg-tertiary rounded-lg text-text-tertiary hover:text-text-primary transition-all disabled:opacity-20 cursor-pointer"
                                    >
                                        <Minus size={12} strokeWidth={3} />
                                    </button>
                                    <span className="w-8 text-center text-[11px] font-black font-mono text-text-primary">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                                        className="p-1.5 hover:bg-bg-tertiary rounded-lg text-text-tertiary hover:text-text-primary transition-all cursor-pointer"
                                    >
                                        <Plus size={12} strokeWidth={3} />
                                    </button>
                                </div>
                                <div className="text-right">
                                    <p className="text-[11px] font-black text-text-primary tracking-tighter">
                                        S/ {item.subtotal.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-text-tertiary space-y-4">
                        <Calculator size={64} strokeWidth={1} />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary">Carrito vacío</p>
                    </div>
                )}
            </div>

            {/* --- FOOTER: FINANZAS Y EJECUCIÓN --- */}
            <footer className="p-6 bg-bg-inverse text-text-inverse rounded-t-[2.5rem] shadow-2xl space-y-4">

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
                                    "flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 transition-all duration-300 cursor-pointer",
                                    paymentMethod === method.id
                                        ? "border-accent-warm bg-accent-warm text-text-inverse shadow-lg"
                                        : "border-text-secondary bg-transparent text-text-secondary hover:border-text-tertiary"
                                )}
                            >
                                <method.icon size={14} />
                                <span className="text-[9px] font-black uppercase tracking-widest">{method.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2 border-t border-text-secondary pt-4">
                    <div className="flex justify-between items-center text-text-tertiary">
                        <span className="text-[10px] font-bold uppercase tracking-widest">Subtotal</span>
                        <span className="text-xs font-bold font-mono text-text-inverse">S/ {subtotal.toFixed(2)}</span>
                    </div>
                    {totalDiscountAmount > 0 && (
                        <div className="flex justify-between items-center text-accent-warm">
                            <span className="text-[10px] font-bold uppercase tracking-widest">Descuento Global</span>
                            <span className="text-xs font-bold font-mono">- S/ {totalDiscountAmount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-xs font-black uppercase tracking-tighter text-text-inverse">Monto Total</span>
                        <span className="text-2xl font-black tracking-tighter text-text-inverse">
                            S/ {total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                        disabled={cart.length === 0 || isPending || !isOpen || !currentShiftId}
                        onClick={handlePayment}
                        className={cn(
                            "py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] font-black uppercase tracking-tighter text-[10px] shadow-xl cursor-pointer",
                            cart.length > 0 && !isPending && isOpen && currentShiftId
                                ? "bg-text-inverse text-text-primary hover:bg-bg-tertiary"
                                : "bg-bg-tertiary text-text-tertiary cursor-not-allowed opacity-30"
                        )}
                    >
                        {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <div className="flex items-center gap-1">
                                <span>Venta</span>
                                <ChevronRight size={14} strokeWidth={3} />
                            </div>
                        )}
                    </button>

                    <button
                        disabled={cart.length === 0 || isPending || !isOpen || !currentShiftId}
                        onClick={handleQuote}
                        className="py-4 rounded-2xl flex items-center justify-center gap-2 border border-text-secondary text-text-secondary hover:text-text-inverse hover:border-text-inverse transition-all font-bold uppercase tracking-tighter text-[10px] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <FileText size={14} />
                        Proforma
                    </button>
                </div>

                {cart.length > 0 && !isPending && (
                    <button
                        onClick={clearCart}
                        className="w-full text-[9px] font-black uppercase text-text-tertiary hover:text-accent-warm transition-colors pt-2 cursor-pointer"
                    >
                        Anular Carrito
                    </button>
                )}
            </footer>
        </div>
    );
};