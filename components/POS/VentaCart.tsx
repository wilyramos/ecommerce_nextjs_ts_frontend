"use client";

import { useCartStore } from "@/src/store/cartStore";
import SubmitSaleButton from "./SubmitSaleButton";
import { FaShoppingCart } from "react-icons/fa";
import CustomerDniInput from "./CustomerDniInput";
import CartItemsList from "./CartItemsList";
import ProofPayment from "./ProofPayment";
import VentaCompletada from "./VentaCompletada";

export default function VentaCart() {
    const { cart, saleCompleted, saleId } = useCartStore();
    const dni = useCartStore((s) => s.dni);
    const total = cart.reduce((acc, item) => acc + item.subtotal, 0);


    if (saleCompleted && saleId) {
        return (
            <VentaCompletada />
        );
    }


    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                <FaShoppingCart size={56} className="mb-4" />
                <p className="text-sm">Tu carrito está vacío.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 ">
            {/* Lista de productos */}
            <CartItemsList />

            {/* DNI del cliente :TODO:: implementar lógica para manejar el DNI */}
            <div className="space-y-1 rounded-full">
                <CustomerDniInput />
                {dni && (
                    <p className="text-xs text-gray-500">DNI del cliente: <span className="font-semibold">{dni}</span></p>
                )}
            </div>

            <div className="flex items-center gap-2">
                <ProofPayment
                />
            </div>

            {/* Total y botón */}
            <div className="flex flex-col items-end space-y-2">
                <div>
                    <p className="text-sm text-gray-500">Total:</p>
                    <p className="text-2xl font-bold text-gray-900">S/. {total.toFixed(2)}</p>
                </div>
                <SubmitSaleButton
                />
            </div>
        </div>
    );
}
