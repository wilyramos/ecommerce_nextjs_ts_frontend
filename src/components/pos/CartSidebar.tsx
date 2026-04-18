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
        <div className="flex flex-col h-full bg-white shadow-2xl border-l border-slate-200 overflow-hidden">
            
            {/* --- HEADER: OPERADOR Y ESTADO DE CAJA --- */}
            <header className="p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-black text-white p-2.5 rounded-2xl shadow-lg">
                            <ShoppingBag size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-tight text-slate-900">Orden Actual</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                {itemsCount} productos en lista
                            </p>
                        </div>
                    </div>
                    {onClose && (
                        <button onClick={onClose} className="lg:hidden p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                            <X size={20} />
                        </button>
                    )}
                </div>

               
            </header>

            {/* --- LISTADO: PRODUCTOS Y VARIANTES --- */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-white">
                {cart.length > 0 ? (
                    cart.map((item) => (
                        <div key={`${item.productId}-${item.variantId}`} className="flex flex-col gap-3 group animate-in slide-in-from-right-4 duration-300">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-[11px] font-black uppercase text-slate-900 truncate leading-tight">
                                        {item.nombre}
                                    </h4>
                                    
                                    {/* Mapeo de Atributos de Variantes */}
                                    {item.atributos && Object.entries(item.atributos).length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                                            {Object.entries(item.atributos).map(([key, value]) => (
                                                <span key={key} className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 text-[8px] font-bold text-slate-500 rounded-md border border-slate-100 uppercase">
                                                    <Tag size={8} />
                                                    {key}: {value}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button 
                                    onClick={() => removeFromCart(item.productId, item.variantId)}
                                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* Controles de Cantidad y Subtotal */}
                            <div className="flex items-center justify-between bg-slate-50/50 p-2 rounded-2xl border border-dashed border-slate-200">
                                <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-slate-100 shadow-sm">
                                    <button 
                                        disabled={item.quantity <= 1}
                                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-black transition-all disabled:opacity-20"
                                    >
                                        <Minus size={12} strokeWidth={3} />
                                    </button>
                                    <span className="w-8 text-center text-[11px] font-black font-mono">{item.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-black transition-all"
                                    >
                                        <Plus size={12} strokeWidth={3} />
                                    </button>
                                </div>
                                <div className="text-right">
                                    <p className="text-[11px] font-black text-slate-900 tracking-tighter">
                                        S/ {item.subtotal.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-200 space-y-4">
                        <Calculator size={64} strokeWidth={1} />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Carrito vacío</p>
                    </div>
                )}
            </div>

            {/* --- FOOTER: FINANZAS Y EJECUCIÓN (Industrial) --- */}
            <footer className="p-6 bg-slate-900 text-white rounded-t-[2.5rem] shadow-2xl space-y-4">
                
                {/* Selector de Pago */}
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
                                        ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                                        : "border-slate-800 bg-slate-800/50 text-slate-500 hover:border-slate-700"
                                )}
                            >
                                <method.icon size={14} />
                                <span className="text-[9px] font-black uppercase tracking-widest">{method.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Resumen Financiero */}
                <div className="space-y-2 border-t border-white/10 pt-4">
                    <div className="flex justify-between items-center opacity-60">
                        <span className="text-[10px] font-bold uppercase tracking-widest">Subtotal</span>
                        <span className="text-xs font-bold font-mono">S/ {subtotal.toFixed(2)}</span>
                    </div>
                    {totalDiscountAmount > 0 && (
                        <div className="flex justify-between items-center text-emerald-400">
                            <span className="text-[10px] font-bold uppercase tracking-widest">Descuento Global</span>
                            <span className="text-xs font-bold font-mono">- S/ {totalDiscountAmount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-xs font-black uppercase tracking-tighter">Monto Total</span>
                        <span className="text-2xl font-black tracking-tighter text-white">
                            S/ {total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>

                {/* GRUPO DE ACCIONES */}
<div className="grid grid-cols-2 gap-2 pt-2">
    {/* ACCIÓN PRINCIPAL: VENTA */}
    <button
        disabled={cart.length === 0 || isPending || !isOpen || !currentShiftId}
        onClick={handlePayment}
        className={cn(
            "py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] font-black uppercase tracking-tighter text-[10px] shadow-xl",
            cart.length > 0 && !isPending && isOpen && currentShiftId
                ? "bg-white text-black hover:bg-slate-100 shadow-white/10"
                : "bg-slate-800 text-slate-600 cursor-not-allowed"
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

    {/* ACCIÓN SECUNDARIA: PROFORMA */}
    <button
        disabled={cart.length === 0 || isPending || !isOpen || !currentShiftId}
        onClick={handleQuote}
        className="py-4 rounded-2xl flex items-center justify-center gap-2 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all font-bold uppercase tracking-tighter text-[10px] disabled:opacity-30 disabled:cursor-not-allowed"
    >
        <FileText size={14} />
        Proforma
    </button>
</div>

{cart.length > 0 && !isPending && (
    <button 
        onClick={clearCart}
        className="w-full text-[9px] font-black uppercase text-slate-600 hover:text-red-400 transition-colors pt-2"
    >
        Anular Carrito
    </button>
)}
            </footer>
        </div>
    );
};