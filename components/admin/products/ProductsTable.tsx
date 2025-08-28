import type { ProductsAPIResponse } from "@/src/schemas";
import Link from "next/link";
import { CheckCircle, XCircle, Star } from "lucide-react";
import ProductMenuAction from "./ProductMenuActionts";

export default function ProductsTable({ products }: { products?: ProductsAPIResponse | null }) {
    if (!products || products.products.length === 0) {
        return (
            <div className="p-6 text-center text-slate-500">
                No se encontraron productos
            </div>
        );
    }

    return (
        <div className="overflow-x-auto text-sm">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nombre</th>
                        <th className="px-4 py-2 hidden md:table-cell text-left text-xs font-medium text-slate-500 uppercase tracking-wider">SKU</th>
                        <th className="px-4 py-2 hidden md:table-cell text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Precio</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Stock</th>
                        <th className="px-4 py-2 hidden md:table-cell text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Activo</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nuevo</th>
                        <th className="px-4 py-2 hidden md:table-cell text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Destacado</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                    {products.products.map((product) => (
                        <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-2 whitespace-nowrap">
                                <Link
                                    href={`/admin/products/${product._id}`}
                                    className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors"
                                >
                                    {product.nombre}
                                </Link>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap hidden md:table-cell uppercase text-slate-700">
                                {product.sku}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap hidden md:table-cell text-slate-700">
                                S/ {product.precio?.toFixed(2)}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-slate-700">{product.stock}</td>
                            <td className="px-4 py-2 whitespace-nowrap hidden md:table-cell text-center">
                                {product.isActive ? (
                                    <CheckCircle className="text-emerald-500 h-4 w-4 mx-auto" />
                                ) : (
                                    <XCircle className="text-rose-500 h-4 w-4 mx-auto" />
                                )}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-center">
                                {product.esNuevo ? (
                                    <CheckCircle className="text-emerald-500 h-4 w-4 mx-auto" />
                                ) : (
                                    <XCircle className="text-rose-500 h-4 w-4 mx-auto" />
                                )}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap hidden md:table-cell text-center">
                                {product.esDestacado ? (
                                    <Star className="text-amber-500 fill-amber-500 h-4 w-4 mx-auto" />
                                ) : (
                                    <XCircle className="text-slate-400 h-4 w-4 mx-auto" />
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
