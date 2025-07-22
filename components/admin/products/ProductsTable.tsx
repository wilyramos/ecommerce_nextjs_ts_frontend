import type { ProductsList } from "@/src/schemas";
import Link from "next/link";
import { FaEye, FaCheckCircle, FaTimesCircle, FaStar } from "react-icons/fa";
import ProductMenuAction from "./ProductMenuActionts";

export default function ProductsTable({ products }: { products: ProductsList }) {
    return (
        <div className="overflow-x-auto rounded-lg bg-white">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
                <thead className="bg-gray-50 text-gray-800 uppercase text-xs">
                    <tr>
                        <th className="px-4 py-2 text-left">Nombre</th>
                        <th className="px-4 py-2 text-left hidden md:table-cell">SKU</th>
                        <th className="px-4 py-2 text-left hidden md:table-cell">Precio</th>
                        <th className="px-4 py-2 text-left">Stock</th>
                        <th className="px-4 py-2 text-left hidden md:table-cell">Activo</th>
                        <th className="px-4 py-2 text-left">Nuevo</th>
                        <th className="px-4 py-2 text-left hidden md:table-cell">Destacado</th>
                        <th className="px-4 py-2 text-left">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                    {products.products.map((product) => (
                        <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-2 font-medium">{product.nombre}</td>
                            <td className="px-4 py-2 hidden md:table-cell uppercase">{product.sku}</td>
                            <td className="px-4 py-2 hidden md:table-cell">${product.precio.toFixed(2)}</td>
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

                            <td className="px-4 py-3">
                                <ProductMenuAction productId={product._id} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
