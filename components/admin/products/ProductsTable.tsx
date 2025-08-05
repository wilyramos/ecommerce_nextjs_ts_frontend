import type { ProductsAPIResponse } from "@/src/schemas";
import Link from "next/link";
import { FaCheckCircle, FaTimesCircle, FaStar } from "react-icons/fa";
import ProductMenuAction from "./ProductMenuActionts";

export default function ProductsTable({ products }: { products: ProductsAPIResponse }) {
    return (
        <div className="overflow-x-auto rounded-lg border shadow-xs text-sm">
            <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2">Nombre</th>
                        <th className="px-4 py-2 hidden md:table-cell">SKU</th>
                        <th className="px-4 py-2 hidden md:table-cell">Precio</th>
                        <th className="px-4 py-2">Stock</th>
                        <th className="px-4 py-2 hidden md:table-cell">Activo</th>
                        <th className="px-4 py-2">Nuevo</th>
                        <th className="px-4 py-2 hidden md:table-cell">Destacado</th>
                        <th className="px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {products.products.map((product) => (
                        <tr key={product._id} className="hover:bg-gray-200">
                            <td className="px-4 py-2">
                                <Link
                                    href={`/admin/products/${product._id}`}
                                    className="flex items-center gap-2 hover:text-indigo-600 transition-colors"
                                >
                                    {product.nombre}
                                </Link>
                            </td>
                            <td className="px-4 py-2 hidden md:table-cell uppercase">{product.sku}</td>
                            <td className="px-4 py-2 hidden md:table-cell">s/ {product.precio?.toFixed(2)}</td>
                            <td className="px-4 py-2">{product.stock}</td>
                            <td className="px-4 py-2 hidden md:table-cell">
                                {product.isActive ? (
                                    <FaCheckCircle className="text-green-500" title="Activo" />
                                ) : (
                                    <FaTimesCircle className="text-red-500" title="Inactivo" />
                                )}
                            </td>
                            <td className="px-4 py-2">
                                {product.esNuevo ? (
                                    <FaCheckCircle className="text-green-500" title="Nuevo" />
                                ) : (
                                    <FaTimesCircle className="text-red-500" title="No es nuevo" />
                                )}
                            </td>
                            <td className="px-4 py-2 hidden md:table-cell">
                                {product.esDestacado ? (
                                    <FaStar className="text-yellow-500" title="Destacado" />
                                ) : (
                                    <FaTimesCircle className="text-gray-400" title="No destacado" />
                                )}
                            </td>
                            <td className="p-2 text-center">
                                <ProductMenuAction productId={product._id} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
