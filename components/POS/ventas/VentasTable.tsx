import { Sale } from "@/src/schemas";
import { formatDate } from "@/lib/utils";
import ActionsButtonsVentas from "./ActionsButtonsVentas";

export default function VentasTable({ ventas }: { ventas: Sale[] }) {
    const employeeName = (venta: Sale) => {
        if (!venta.employee || typeof venta.employee !== "object") {
            return "No asignado";
        }
        return venta.employee.nombre || "No asignado";
    };

    return (
        <div className="overflow-hidden ">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50">
                <h2 className="text-sm font-semibold text-gray-700">Ventas</h2>
                <span className="text-xs text-gray-500">
                    {ventas.length} registradas
                </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="text-xs font-medium text-gray-500 uppercase tracking-wide bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left">N° Comprobante</th>
                            <th className="px-4 py-3 text-left">Cliente</th>
                            <th className="px-4 py-3 text-left">Vendedor</th>
                            <th className="px-4 py-3 text-left">Fecha</th>
                            <th className="px-4 py-3 text-left">Estado de venta</th>
                            <th className="px-4 py-3 text-right">Productos</th>
                            <th className="px-4 py-3 text-right">Total</th>
                            <th className="px-4 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 text-gray-700">
                        {ventas.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="text-center py-10 text-gray-400 text-sm"
                                >
                                    No se encontraron ventas
                                </td>
                            </tr>
                        ) : (
                            ventas.map((venta) => (
                                <tr
                                    key={venta._id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    {/* N° Comprobante */}
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {venta.receiptNumber || "N/A"}
                                    </td>

                                    {/* Cliente */}
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {venta.customerDNI || "N/A"}
                                    </td>

                                    {/* Vendedor */}
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {employeeName(venta)}
                                    </td>

                                    {/* Fecha */}
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {venta.createdAt ? (
                                            <span className="text-gray-800">
                                                {formatDate(venta.createdAt)}
                                            </span>
                                        ) : (
                                            "—"
                                        )}
                                    </td>

                                    {/* Estado de venta */}
                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${venta.status === "COMPLETED"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {venta.status}
                                        </span>
                                    </td>

                                    {/* Productos */}
                                    <td className="px-4 py-3 text-right">
                                        {venta.items.length}
                                    </td>

                                    {/* Total */}
                                    <td className="px-4 py-3 font-semibold text-gray-900 text-right">
                                        S/ {venta.totalPrice.toFixed(2)}
                                    </td>

                                    {/* Acciones */}
                                    <td className="px-4 py-3 text-right">
                                        <ActionsButtonsVentas venta={venta} />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>

                </table>
            </div>
        </div>
    );
}
