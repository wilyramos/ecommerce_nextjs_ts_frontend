import type { ProductsList } from "@/src/schemas";
import Link from "next/link";


export default function ProductsTable({ products }: { products: ProductsList }) {
    return (
        <>
            <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Nombre</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Descripción</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Precio</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Stock</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.products.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-100 transition">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.nombre}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{product.descripcion}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">${product.precio}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">{product.stock}</td>
                                <td className="px-6 py-4 text-sm">
                                    <Link href={`/admin/products/${product._id}`} className="text-blue-600 hover:underline">
                                        Ver Detalles
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </>
    )
}
