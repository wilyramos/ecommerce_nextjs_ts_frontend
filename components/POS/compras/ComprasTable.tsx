"use client";

import type { TPurchase } from "@/src/schemas";
import ComprasFilters from "./ComprasFilters";
import Link from "next/link";

export default function ComprasTable({ purchases = [] }: { purchases?: TPurchase[] }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700">
                <thead className="bg-gray-50 sticky top-0 z-10">
                    <ComprasFilters />
                </thead>
                <tbody>
                    {purchases.length > 0 ? (
                        purchases.map((purchase, idx) => (
                            <tr
                                key={purchase.numeroCompra ?? idx}
                                className="border-t hover:bg-gray-50 transition-colors"
                            >
                                <td className="p-3 font-medium text-blue-500 underline ">
                                    <Link href={`/pos/compras/${purchase._id}`}>
                                        {purchase.numeroCompra}
                                    </Link>
                                </td>
                                <td className="p-3">{purchase.proveedor}</td>
                                <td className="p-3">
                                    {purchase.createdAt
                                        ? new Date(purchase.createdAt).toLocaleDateString("es-PE")
                                        : "—"}
                                </td>
                                <td className="p-3 text-right font-semibold text-gray-800">
                                    {purchase.total
                                        ? `S/ ${purchase.total.toFixed(2)}`
                                        : "—"}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={4}
                                className="p-6 text-center text-gray-500 italic"
                            >
                                No se encontraron compras
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}