import { Sale } from '@/src/schemas'
import { formatDate } from '@/lib/utils'

export default function VentasTable({ ventas }: { ventas: Sale[] }) {
    return (
        <div className="overflow-x-auto rounded-lg shadow-sm border bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="px-4 py-3">Fecha</th>
                        <th className="px-4 py-3">Cliente</th>
                        <th className="px-4 py-3">Empleado</th>
                        <th className="px-4 py-3">Total</th>
                        <th className="px-4 py-3">Pago</th>
                        <th className="px-4 py-3">Estado</th>
                        <th className="px-4 py-3">Estado Pago</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-900">
                    {ventas.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="text-center py-4 text-gray-500">
                                No se encontraron ventas
                            </td>
                        </tr>
                    ) : (
                        ventas.map((venta) => (
                            <tr key={venta._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-2">{venta.createdAt ? formatDate(venta.createdAt) : '—'}</td>
                                <td className="px-4 py-2">{venta.customer?.nombre || '—'}</td>
                                <td className="px-4 py-2">{venta.employee?.nombre || '—'}</td>
                                <td className="px-4 py-2">S/ {venta.totalPrice.toFixed(2)}</td>
                                <td className="px-4 py-2">{venta.paymentMethod}</td>
                                <td className="px-4 py-2">{venta.status}</td>
                                <td className="px-4 py-2">{venta.paymentStatus}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}
