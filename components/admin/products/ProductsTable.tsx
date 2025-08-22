import type { ProductsAPIResponse } from "@/src/schemas";
import Link from "next/link";
import { FaCheckCircle, FaTimesCircle, FaStar } from "react-icons/fa";
import ProductMenuAction from "./ProductMenuActionts";

export default function ProductsTable({ products }: { products: ProductsAPIResponse }) {
    return (
        <div className="overflow-x-auto text-sm">
            <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                        <th className="px-4 py-2 hidden md:table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                        <th className="px-4 py-2 hidden md:table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-4 py-2 hidden md:table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activo</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nuevo</th>
                        <th className="px-4 py-2 hidden md:table-cell text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destacado</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {products.products.map((product) => (
                        <tr key={product._id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 whitespace-nowrap">
                                <Link
                                    href={`/admin/products/${product._id}`}
                                    className="flex items-center gap-2 hover:text-indigo-600 transition-colors"
                                >
                                    {product.nombre}
                                </Link>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap hidden md:table-cell uppercase text-gray-900">{product.sku}</td>
                            <td className="px-4 py-2 whitespace-nowrap hidden md:table-cell text-gray-900">s/ {product.precio?.toFixed(2)}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-gray-900">{product.stock}</td>
                            <td className="px-4 py-2 whitespace-nowrap hidden md:table-cell">
                                {product.isActive ? (
                                    <FaCheckCircle className="text-green-500 mx-auto" title="Activo" />
                                ) : (
                                    <FaTimesCircle className="text-red-500 mx-auto" title="Inactivo" />
                                )}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                                {product.esNuevo ? (
                                    <FaCheckCircle className="text-green-500 mx-auto" title="Nuevo" />
                                ) : (
                                    <FaTimesCircle className="text-red-500 mx-auto" title="No es nuevo" />
                                )}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap hidden md:table-cell">
                                {product.esDestacado ? (
                                    <FaStar className="text-yellow-500 mx-auto" title="Destacado" />
                                ) : (
                                    <FaTimesCircle className="text-gray-400 mx-auto" title="No destacado" />
                                )}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-right">
                                <ProductMenuAction productId={product._id} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}