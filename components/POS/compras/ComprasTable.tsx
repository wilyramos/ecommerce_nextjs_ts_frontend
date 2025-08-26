"use client";

import type { TPurchase } from "@/src/schemas";
import ComprasFilters from "./ComprasFilters";

export default function ComprasTable({ purchases }: { purchases: TPurchase[] }) {
    if (purchases.length === 0) {
        return (
            <div className="p-6 text-center text-gray-500 border rounded-xl shadow-sm bg-white">
                No hay compras registradas.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700">
                <thead className="bg-gray-50 sticky top-0 z-10">
                    <ComprasFilters />
                </thead>
                <tbody>
                    {purchases.map((purchase, idx) => (
                        <tr
                            key={purchase.numeroCompra ?? idx}
                            className="border-t hover:bg-gray-50 transition-colors"
                        >
                            <td className="p-3 font-medium text-gray-900">
                                {purchase.numeroCompra}
                            </td>
                            <td className="p-3">{purchase.proveedor}</td>
                            <td className="p-3">
                                {new Date(purchase.createdAt || "").toLocaleDateString("es-PE")}
                            </td>
                            <td className="p-3 text-right font-semibold text-gray-800">
                                {purchase.total
                                    ? `S/ ${purchase.total.toFixed(2)}`
                                    : "—"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
