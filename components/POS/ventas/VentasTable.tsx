import { Sale } from '@/src/schemas'



export default function VentasTable({ ventas }: { ventas: Sale[] }) {
    return (
        <div className="overflow-x-auto rounded-lg shadow-sm border bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                <thead className="bg-gray-100 text-gray-700 uppercase font-medium tracking-wider">
                    <tr>
                        <th className="px-4 py-3">Fecha</th>
                        <th className="px-4 py-3">Total</th>
                        <th className="px-4 py-3">Productos</th>
                        <th className="px-4 py-3">Método</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {ventas.map((venta) => (
                        <tr key={venta._id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">${venta.totalPrice.toFixed(2)}</td>
                            <td className="px-4 py-3">{venta.items.length}</td>
                            <td className="px-4 py-3">{venta.paymentMethod}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}
