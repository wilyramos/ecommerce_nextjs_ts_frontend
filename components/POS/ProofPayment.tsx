"use client";

import { useCartStore } from "@/src/store/cartStore";
import type { TReceiptType } from "@/src/schemas";

export default function ProofPayment() {
    const { comprobante, setComprobante } = useCartStore();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setComprobante(e.target.value as TReceiptType);
    };

    return (
        <div className="flex items-center gap-2">
            <label htmlFor="comprobante" className="text-sm text-gray-600">
                Tipo de comprobante:
            </label>

            <select
                id="comprobante"
                value={comprobante ?? "ticket"}   // fallback a "ticket"
                onChange={handleChange}
                className="border rounded-lg px-2 py-1 text-sm"
            >
                <option value="TICKET">Ticket</option>
                <option value="BOLETA">Boleta</option>
                <option value="FACTURA">Factura</option>
            </select>
        </div>
    );
}
