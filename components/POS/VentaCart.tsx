// File: frontend/components/POS/VentaCart.tsx
"use client";

import { useCartStore } from "@/src/store/cartStore";
import SubmitSaleButton from "./SubmitSaleButton";
import { FaShoppingCart, FaUser, FaMoneyBillWave, FaTimes } from "react-icons/fa";
import CustomerDniInput from "./CustomerDniInput";
import CartItemsList from "./CartItemsList";
import ProofPayment from "./ProofPayment";
import VentaCompletada from "./VentaCompletada";

interface VentaCartProps {
    onMobileClose?: () => void;
}

export default function VentaCart({ onMobileClose }: VentaCartProps) {
    const { cart, saleCompleted, saleId } = useCartStore();
    const dni = useCartStore((s) => s.dni);
    const total = cart.reduce((acc, item) => acc + item.subtotal, 0);

    // ESTADO 1: VENTA COMPLETADA
    if (saleCompleted && saleId) {
        return (
            <div className="relative h-full w-full">
                {/* Botón de cerrar opcional para móvil */}
                {onMobileClose && (
                    <button
                        onClick={onMobileClose}
                        className="absolute top-4 right-4 z-10 p-2 bg-[var(--admin-surface)] border border-[var(--admin-border)] text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] rounded-full shadow-sm"
                    >
                        <FaTimes size={16} />
                    </button>
                )}
                {/* Le pasamos el onMobileClose para que cierre el modal al hacer "Nueva Venta" */}
                <VentaCompletada onMobileClose={onMobileClose} />
            </div>
        );
    }

    // ESTADO 2: CARRITO VACÍO
    if (cart.length === 0) {
        return (
            <div className="relative flex flex-col items-center justify-center h-full bg-[var(--admin-surface)] p-6 text-center text-[var(--admin-text-muted)]">
                {onMobileClose && (
                    <button
                        onClick={onMobileClose}
                        className="absolute top-4 right-4 p-2 bg-[var(--admin-bg)] text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] rounded-full"
                    >
                        <FaTimes size={16} />
                    </button>
                )}
                <div className="w-20 h-20 bg-[var(--admin-bg)] rounded-full flex items-center justify-center mb-4">
                    <FaShoppingCart size={32} className="text-[var(--admin-border)]" />
                </div>
                <h3 className="text-lg font-bold text-[var(--admin-text)] mb-1">Carrito Vacío</h3>
                <p className="text-sm">Busca un producto y haz clic para agregarlo a la venta.</p>
            </div>
        );
    }

    // ESTADO 3: CARRITO CON PRODUCTOS
    return (
        <div className="flex flex-col h-full bg-[var(--admin-surface)]">

            {/* Cabecera del Carrito */}
            <div className="shrink-0 p-4 border-b border-[var(--admin-border)] flex items-center justify-between bg-[var(--admin-bg)]/50">
                <h2 className="font-bold text-[var(--admin-text)] flex items-center gap-2">
                    <FaShoppingCart className="text-[var(--admin-info)]" />
                    Pedido Actual
                </h2>

                <div className="flex items-center gap-3">
                    <span className="bg-[var(--admin-primary)] text-[var(--admin-primary-text)] text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                        {cart.length} Ítems
                    </span>

                    {/* Botón X solo visible si estamos en el modal de móvil */}
                    {onMobileClose && (
                        <button
                            onClick={onMobileClose}
                            className="p-1.5 bg-white border border-[var(--admin-border)] text-[var(--admin-text-muted)] hover:text-[var(--admin-destructive)] rounded-md shadow-sm transition-colors"
                        >
                            <FaTimes size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* LISTA DE PRODUCTOS (Scrolleable) */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <CartItemsList />
            </div>

            {/* FOOTER FIJO DE PAGOS */}
            <div className="shrink-0 bg-[var(--admin-bg)] border-t border-[var(--admin-border)] p-4 space-y-3 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">

                {/* 1. Cliente */}
                <div className="bg-[var(--admin-surface)] p-3 rounded-lg border border-[var(--admin-border)] shadow-sm flex items-start gap-3">
                    <div className="p-2 bg-[var(--store-bg)] rounded-md text-[var(--admin-text-muted)]">
                        <FaUser />
                    </div>
                    <div className="flex-1">
                        <CustomerDniInput />
                        {dni && (
                            <p className="text-[11px] text-[var(--admin-info-text)] mt-1.5 font-medium bg-[var(--admin-info-bg)] w-fit px-2 py-0.5 rounded">
                                DNI Vinculado: {dni}
                            </p>
                        )}
                    </div>
                </div>

                {/* 2. Método de Pago */}
                <div className="bg-[var(--admin-surface)] p-3 rounded-lg border border-[var(--admin-border)] shadow-sm flex items-start gap-3">
                    <div className="p-2 bg-[var(--store-bg)] rounded-md text-[var(--admin-text-muted)]">
                        <FaMoneyBillWave />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-bold text-[var(--admin-text)] mb-1.5 uppercase tracking-wider">Método de Pago</p>
                        <ProofPayment />
                    </div>
                </div>

                {/* 3. Total y Cobro */}
                <div className="bg-[var(--admin-primary)] p-4 rounded-xl shadow-lg flex items-center justify-between mt-2">
                    <div>
                        <p className="text-[11px] text-[var(--admin-text-muted)] uppercase tracking-widest font-bold">Total a Cobrar</p>
                        <p className="text-2xl font-black text-[var(--admin-primary-text)]">
                            S/ {total.toFixed(2)}
                        </p>
                    </div>

                    <div className="w-1/2">
                        <SubmitSaleButton />
                    </div>
                </div>
            </div>

        </div>
    );
}