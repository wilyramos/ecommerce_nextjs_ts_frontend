import type { ProductsAPIResponse } from "@/src/schemas";
import Link from "next/link";
import Image from "next/image";
import { XCircle, Star } from "lucide-react";

export default function ProductsTablePOS({ products }: { products: ProductsAPIResponse }) {
    return (
        <div className="overflow-x-auto text-sm">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Producto</th>
                        <th className="px-4 py-2 hidden md:table-cell text-left text-xs font-medium text-slate-500 uppercase tracking-wider">SKU</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Precio</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Stock</th>
                        <th className="px-4 py-2 hidden md:table-cell text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Activo</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Nuevo</th>
                        <th className="px-4 py-2 hidden md:table-cell text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Destacado</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                    {products.products.map((product) => (
                        <tr key={product._id} className="hover:bg-slate-50 transition-colors">
                            {/* Producto con imagen + nombre */}
                            <td className="px-4 py-3 whitespace-nowrap">
                                <Link
                                    href={`/admin/products/${product._id}`}
                                    className="flex items-center gap-3 text-slate-700 hover:text-blue-600 transition-colors"
                                >
                                    <Image
                                        src={product.imagenes?.[0] || "/logob.svg"}
                                        alt={product.nombre}
                                        width={40}
                                        height={40}
                                        className="rounded border object-cover"
                                    />
                                    <div>
                                        <p className="font-medium">{product.nombre}</p>
                                        <p className="text-xs text-slate-400">ID: {product._id.slice(-6)}</p>
                                    </div>
                                </Link>
                            </td>

                            {/* SKU */}
                            <td className="px-4 py-2 hidden md:table-cell uppercase text-slate-600">{product.sku}</td>

                            {/* Precio */}
                            <td className="px-4 py-2 font-medium text-slate-700">S/ {product.precio?.toFixed(2)}</td>

                            {/* Stock */}
                            <td className="px-4 py-2">
                                <span
                                    className={`px-2 py-1 text-xs rounded-full ${product.stock ?? 0 > 0
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-rose-100 text-rose-700"
                                        }`}
                                >
                                    {product.stock}
                                </span>
                            </td>

                            {/* Activo */}
                            <td className="px-4 py-2 hidden md:table-cell text-center">
                                {product.isActive ? (
                                    <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700">Activo</span>
                                ) : (
                                    <span className="px-2 py-1 text-xs rounded-full bg-rose-100 text-rose-700">Inactivo</span>
                                )}
                            </td>

                            {/* Nuevo */}
                            <td className="px-4 py-2 text-center">
                                {product.esNuevo ? (
                                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">Nuevo</span>
                                ) : (
                                    <span className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-500">—</span>
                                )}
                            </td>

                            {/* Destacado */}
                            <td className="px-4 py-2 hidden md:table-cell text-center">
                                {product.esDestacado ? (
                                    <Star className="text-amber-500 fill-amber-500 h-4 w-4 mx-auto" />
                                ) : (
                                    <XCircle className="text-slate-400 h-4 w-4 mx-auto" />
                                )}
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
