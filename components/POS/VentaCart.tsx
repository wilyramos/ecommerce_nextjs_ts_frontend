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
        return <VentaCompletada />;
    }

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center text-gray-400 h-full">
                <FaShoppingCart size={48} className="mb-3 text-gray-300" />
                <p className="text-sm">Tu carrito está vacío.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">

            {/* LISTA DE PRODUCTOS → 2/3 altura */}
            <div className="h-[66vh] overflow-y-auto">
                <CartItemsList />
            </div>

            {/* FOOTER FIJO → 1/3 altura */}
            <div className="h-[34vh] bg-white border-t border-gray-200 flex flex-col justify-between ">

                {/* DNI */}
                <div>
                    <CustomerDniInput />
                    {dni && (
                        <p className="text-xs text-gray-600 mt-1">
                            DNI: <span className="font-semibold">{dni}</span>
                        </p>
                    )}
                </div>

                {/* Método de pago */}
                <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200">
                    <ProofPayment />
                </div>

                {/* Total y botón */}
                <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
                    <div>
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-2xl font-semibold text-gray-800">
                            S/. {total.toFixed(2)}
                        </p>
                    </div>

                    <SubmitSaleButton />
                </div>
            </div>
        </div>
    );
}
