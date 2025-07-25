import type { ProductWithCategoryResponse } from "@/src/schemas";
import type { CategoryListResponse } from "@/src/schemas";
import UploadProductImage from "./UploadProductImage";
import ClientCategoryAttributes from "./ClientCategoryAttributes"


export default function ProductForm({ product, categorias }: { product?: ProductWithCategoryResponse, categorias: CategoryListResponse }) {

    return (
        <div className="text-xs text-gray-500 upp">

            <div className="py-1">
                <label htmlFor="nombre" className="block font-semibold text-gray-700">Nombre del producto</label>
                <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    className="w-full border border-gray-200 rounded-lg p-2"
                    defaultValue={product?.nombre}
                />
            </div>

            <div className="py-1">
                <label htmlFor="descripcion" className="block font-semibold text-gray-700">Descripción</label>
                <textarea
                    id="descripcion"
                    name="descripcion"
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg p-3 "
                    defaultValue={product?.descripcion}
                />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="py-1">
                    <label htmlFor="precio" className="block font-semibold text-gray-700">Precio</label>
                    <input
                        type="number"
                        id="precio"
                        name="precio"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={product?.precio}
                    />
                </div>

                <div className="py-1">
                    <label htmlFor="costo" className="block font-semibold text-gray-700">Costo</label>
                    <input
                        type="number"
                        id="costo"
                        name="costo"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={product?.costo}
                    />
                </div>

                <div className="space-y-1">
                    <label htmlFor="stock" className="block font-semibold text-gray-700">Stock</label>
                    <input
                        type="number"
                        id="stock"
                        name="stock"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={product?.stock}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="py-1">
                    <label htmlFor="sku" className="block font-semibold text-gray-700">SKU (opcional)</label>
                    <input
                        type="text"
                        id="sku"
                        name="sku"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={product?.sku}
                    />
                </div>
                <div className="py-1">
                    <label htmlFor="barcode" className="block font-semibold text-gray-700">Código de barras (opcional)</label>
                    <input
                        type="text"
                        id="barcode"
                        name="barcode"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={product?.barcode}
                    />
                </div>

            </div>

            <div className="flex items-center gap-2 mb-4">

                <label htmlFor="esDestacado" className="text-sm text-gray-700">¿Es destacado?</label>


                <input
                    type="checkbox"
                    id="esDestacado"
                    name="esDestacado"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    defaultChecked={product?.esDestacado}
                />

                <label htmlFor="esNuevo" className="text-sm text-gray-700">¿Es nuevo?</label>

                <input
                    type="checkbox"
                    id="esNuevo"
                    name="esNuevo"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    defaultChecked={product?.esNuevo}
                />
            </div>

            <ClientCategoryAttributes categorias={categorias} initialCategoryId={product?.categoria?._id} currentAttributes={product?.atributos} />

            <UploadProductImage
                CurrentImagenes={product?.imagenes}
            />
        </div>
    );
}
