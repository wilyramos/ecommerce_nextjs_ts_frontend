import type { ProductWithCategoryResponse } from "@/src/schemas";
import type { CategoryListResponse } from "@/src/schemas";
import UploadProductImage from "./UploadProductImage";
import ClientCategoryAttributes from "./ClientCategoryAttributes"
import ProductSwitches from "./ProductSwitches";
import SpecificationsSection from "./SpecificationsSection";
import ProductDescriptionEditor from "./ProductDescriptionEditor";


export default function ProductForm({ product, categorias }: { product?: ProductWithCategoryResponse, categorias: CategoryListResponse }) {

    return (
        <div className="text-xs grid grid-cols-1 sm:grid-cols-4 gap-4 p-4">

            <div className="col-span-1 sm:col-span-3">
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
                    <label htmlFor="descripcion" className="block font-semibold text-gray-700 mb-1">Descripción</label>
                    <ProductDescriptionEditor
                        initialHTML={product?.descripcion || ""}
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

                <ClientCategoryAttributes categorias={categorias} initialCategoryId={product?.categoria?._id} currentAttributes={product?.atributos} />

                <UploadProductImage
                    CurrentImagenes={product?.imagenes}
                />

                <SpecificationsSection initial={product?.especificaciones} />

            </div>
            <div className="">
                <ProductSwitches product={product} />
            </div>
        </div>
    );
}
