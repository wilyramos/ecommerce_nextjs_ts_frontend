'use client';

import { formatCurrency } from '@/src/utils/formatCurrency';
import AddProductToCart from './AddProductToCart';
import ColorCircle from '@/components/ui/ColorCircle';
import type { Product } from '@/src/schemas';

type Props = {
    producto: Product;
};

export default function ProductDetails({ producto }: Props) {
    return (
        <div className="flex flex-col justify-between space-y-2">
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">{producto.nombre}</h1>

                <div className="flex items-center gap-4">
                    <span className="text-2xl font-semibold text-indigo-600">
                        {formatCurrency(producto.precio)}
                    </span>
                    <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium 
              ${producto.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}
                    >
                        {producto.stock > 0 ? `${producto.stock} disponibles` : 'Sin stock'}
                    </span>
                </div>

                <ul className="text-sm text-gray-700 space-y-1">
                    {producto.brand && <li><strong>Marca:</strong> {producto.brand}</li>}
                    {producto.color && <li><strong>Color:</strong> {producto.color}</li>}
                    {producto.sku && <li><strong>SKU:</strong> {producto.sku}</li>}
                    {producto.barcode && <li><strong>Código:</strong> {producto.barcode}</li>}
                    {producto.atributos && (
    <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200 rounded-md">
            <tbody>
                {Object.entries(producto.atributos).map(([key, value]) => (
                    <tr key={key} className="border-b last:border-b-0">
                        <td className="px-3 py-2 font-medium text-gray-700 bg-gray-50 w-1/3">{key}</td>
                        <td className="px-3 py-2 text-gray-600">{value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)}
                </ul>

                {producto.descripcion && (
                    <div className="space-y-2">
                        <h2 className="text-base font-medium text-gray-800">Descripción</h2>
                        <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                            {producto.descripcion}
                        </p>
                    </div>
                )}

                {producto.variantes && producto.variantes.length > 0 && (
                    <div className="space-y-3 text-sm text-gray-700">
                        <h2 className="font-medium text-gray-800">Variantes</h2>

                        {producto.variantes.map((v, i) => (
                            <div key={i} className="border rounded-md p-2 bg-gray-50 text-xs text-gray-600 shadow-sm">
                                <div className="space-y-1">
                                    {v.opciones.map((o, j) => (
                                        <div key={j} className="flex items-start gap-1">
                                            <span className="font-medium text-gray-600">{o.nombre}:</span>
                                            {o.nombre.toLowerCase() === 'color' ? (
                                                <div className="flex gap-1">
                                                    {o.valores.map((valor, k) => (
                                                        <ColorCircle key={k} color={valor} />
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-500">{o.valores.join(', ')}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-2 flex items-center justify-between text-[11px]">
                                    <span className={`px-2 py-0.5 rounded-full font-medium ${v.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                        {v.stock > 0 ? `${v.stock} disponibles` : 'Sin stock'}
                                    </span>
                                    {v.barcode && <span className="text-gray-400">Código: {v.barcode}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AddProductToCart product={producto} />
        </div>
    );
}
