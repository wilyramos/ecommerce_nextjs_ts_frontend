import { Sale } from '@/src/schemas'
import { formatDate } from '@/lib/utils'
import ActionsButtonsVentas from './ActionsButtonsVentas'

export default function VentasTable({ ventas }: { ventas: Sale[] }) {


    const employeeName = (venta: Sale) => {

        // Verificar si la venta tiene es un objeto de empleado
        if (!venta.employee || typeof venta.employee !== 'object') {
            return 'No asignado';
        }
        // Si es un objeto, retornar el nombre
        return venta.employee.nombre || 'No asignado';
    };

    return (
        <div className="overflow-x-auto  border-gray-200 bg-white">
            <div className="flex justify-end items-center p-2 bg-gray-50 border-b">
                <span className="text-sm text-gray-500">{ventas.length} ventas registradas</span>
            </div>

            <table className="min-w-full text-sm text-left divide-y divide-gray-200">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="px-4 py-2">Fecha</th>
                        <th className="px-4 py-2">Empleado</th>
                        <th className="px-4 py-2">Cliente</th>
                        <th className="px-4 py-2">Total</th>
                        <th className="px-4 py-2">Estado</th>
                        <th className="px-4 py-2">Items</th>
                        <th className="px-4 py-2">Método</th>
                        <th className="px-4 py-2">Pago</th>
                        <th className="px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-900">
                    {ventas.length === 0 ? (
                        <tr>
                            <td colSpan={9} className="text-center py-6 text-gray-500">
                                No se encontraron ventas
                            </td>
                        </tr>
                    ) : (
                        ventas.map((venta) => (
                            <tr key={venta._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-2">{venta.createdAt ? formatDate(venta.createdAt) : '—'}</td>
                                <td className="px-4 py-2">
                                    <span className="text-gray-800">
                                        {employeeName(venta)}
                                    </span>
                                </td>
                                <td className="px-4 py-2">{venta.customerDNI || 'N/A'}</td>
                                <td className="px-4 py-2 text-green-700 font-medium">S/ {venta.totalPrice.toFixed(2)}</td>
                                <td className="px-4 py-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${venta.status === 'COMPLETADA' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {venta.status}
                                    </span>
                                </td>
                                <td className="px-4 py-2">
                                    {venta.items.length > 0 ? (
                                        <div className="space-y-1">
                                            {venta.items.map((item, id) => (
                                                <div key={id} className="text-xs text-gray-700 flex justify-between">
                                                    <span>
                                                        <span className="font-semibold">{item.quantity}</span>
                                                    </span>
                                                    <span className="text-gray-500">S/ {item.price.toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-gray-500 text-xs">Sin Items</span>
                                    )}
                                </td>
                                <td className="px-4 py-2">{venta.paymentStatus}</td>
                                <td className="px-4 py-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${venta.paymentStatus === 'PAGADO' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                                        {venta.paymentStatus}
                                    </span>
                                </td>
                                <td className="px-4 py-2">
                                    <ActionsButtonsVentas venta={venta} />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}
