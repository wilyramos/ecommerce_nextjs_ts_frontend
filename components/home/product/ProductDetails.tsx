'use client';

import { formatCurrency } from '@/src/utils/formatCurrency';
import AddProductToCart from './AddProductToCart';
import ColorCircle from '@/components/ui/ColorCircle';
import ImagenesProductoCarousel from './ImagenesProductoCarousel';
import type { Product } from '@/src/schemas';

type Props = {
    producto: Product;
};

export default function ProductDetails({ producto }: Props) {
    return (
        <>
            <div className="mx-auto px-4 py-6 grid lg:grid-cols-[1fr_1fr] gap-12 max-w-7xl">
                {/* Imágenes */}
                <div>
                    <ImagenesProductoCarousel images={producto.imagenes || []} />
                </div>

                {/* Detalles */}
                <div className="space-y-6 pb-20 md:pb-0">
                    {/* Título y Precio */}
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight">
                            {producto.nombre}
                        </h1>

                        <div className="flex items-center gap-4">
                            <span className="text-2xl font-semibold text-gray-800">
                                {formatCurrency(producto.precio)}
                            </span>
                            <span className={`text-xs font-medium px-3 py-1 rounded-full 
                                ${producto.stock > 0 
                                    ? 'bg-emerald-50 text-emerald-600' 
                                    : 'bg-rose-50 text-rose-600'}`}>
                                {producto.stock > 0 ? `${producto.stock} en stock` : 'Sin stock'}
                            </span>
                        </div>
                    </div>

                    {/* Info Básica */}
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-700">
                        {producto.brand && (
                            <div>
                                <p className="text-gray-400">Marca</p>
                                <p className="font-medium text-gray-700">{producto.brand}</p>
                            </div>
                        )}
                        {producto.color && (
                            <div>
                                <p className="text-gray-400">Color</p>
                                <p className="font-medium text-gray-700">{producto.color}</p>
                            </div>
                        )}
                        {producto.sku && (
                            <div>
                                <p className="text-gray-400">SKU</p>
                                <p className="font-medium text-gray-700">{producto.sku}</p>
                            </div>
                        )}
                        {producto.barcode && (
                            <div>
                                <p className="text-gray-400">Código</p>
                                <p className="font-medium text-gray-700">{producto.barcode}</p>
                            </div>
                        )}
                    </div>

                    {/* Características */}
                    {producto.atributos && (
                        <div>
                            <h2 className="text-sm font-medium text-gray-400 mb-3">Características</h2>
                            <div className="">
                                <table className="w-full text-xs">
                                    <tbody>
                                        {Object.entries(producto.atributos).map(([key, value]) => (
                                            <tr key={key} className="border-b last:border-b-0 even:bg-gray-50">
                                                <td className="px-4 py-2 font-medium text-gray-700">{key}</td>
                                                <td className="px-4 py-2 text-gray-600">{value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Descripción */}
                    {producto.descripcion && (
                        <div>
                            <h2 className="text-md font-semibold text-gray-400 mb-2">Descripción</h2>
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                {producto.descripcion}
                            </p>
                        </div>
                    )}

                    {/* Variantes */}
                    {producto.variantes && producto.variantes.length > 0 && (
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-3">Variantes disponibles</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {producto.variantes.map((v, i) => (
                                    <div
                                        key={i}
                                        className="min-h-[180px] flex flex-col justify-between border rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="space-y-3 text-sm text-gray-700">
                                            {v.opciones.map((o, j) => (
                                                <div key={j}>
                                                    <span className="font-medium text-gray-700">{o.nombre}:</span>{' '}
                                                    {o.nombre.toLowerCase() === 'color' ? (
                                                        <div className="flex flex-wrap gap-1 mt-1">
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
                                        <div className="flex justify-between items-center text-xs text-gray-500 mt-4">
                                            <span
                                                className={`px-2 py-0.5 rounded-full font-medium ${
                                                    v.stock > 0
                                                        ? 'bg-emerald-50 text-emerald-600'
                                                        : 'bg-rose-50 text-rose-600'
                                                }`}
                                            >
                                                {v.stock > 0 ? `${v.stock} disponibles` : 'Sin stock'}
                                            </span>
                                            {v.barcode && <span className="truncate">Código: {v.barcode}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Botón para escritorio */}
                    <div className="hidden md:block pt-6">
                        <AddProductToCart product={producto} />
                    </div>
                </div>
            </div>

            {/* Espaciador mobile */}
            <div className="block md:hidden h-16" />

            {/* Botón fijo para móviles */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-4 py-3 shadow z-50">
                <div className="max-w-7xl mx-auto">
                    <AddProductToCart product={producto} />
                </div>
            </div>
        </>
    );
}
