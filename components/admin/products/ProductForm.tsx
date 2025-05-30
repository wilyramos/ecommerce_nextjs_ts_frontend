import type { Product } from "@/src/schemas";
import type { CategoriasList } from "@/src/schemas";
import UploadProductImage from "./UploadProductImage";



export default function ProductForm({ product, categorias }: { product?: Product, categorias: CategoriasList }) {

    const brand = {
        options: [
            "Apple",
            "Samsung",
            "Ifans"
        ]
    };

    const color = {
        options: [
            "Negro",
            "Blanco",
            "Azul",
            "Rojo",
            "Verde",
            "Amarillo",
            "Morado",
            "Naranja"
        ]
    };

    return (
        <div className="text-xs font-bold">

            <div className="">
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre del producto</label>
                <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    className="w-full border border-gray-300 rounded-lg p-3 "
                    defaultValue={product?.nombre}
                />
            </div>

            <div className="">
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                    id="descripcion"
                    name="descripcion"
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg p-3 "
                    defaultValue={product?.descripcion}
                />
            </div>

            <div className="">
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">Categoría</label>
                <select
                    id="categoria"
                    name="categoria"
                    className="w-full border border-gray-300 rounded-lg p-3 "
                    defaultValue={product?.categoria}
                >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map((categoria) => (
                        <option key={categoria._id} value={categoria._id}>
                            {categoria.nombre}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="">
                    <label htmlFor="precio" className="block text-sm font-medium text-gray-700">Precio</label>
                    <input
                        type="number"
                        id="precio"
                        name="precio"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={product?.precio}
                    />
                </div>

                <div className="space-y-1">
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
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
                <div className="">
                    <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU (opcional)</label>
                    <input
                        type="text"
                        id="sku"
                        name="sku"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={product?.sku}
                    />
                </div>
                <div className="">
                    <label htmlFor="barcode" className="block text-sm font-medium text-gray-700">Código de barras (opcional)</label>
                    <input
                        type="text"
                        id="barcode"
                        name="barcode"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={product?.barcode}
                    />
                </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="">
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Marca</label>
                    <select
                        id="brand"
                        name="brand"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={product?.brand || ""}
                    >
                        <option value="">Selecciona una marca</option>
                        {brand.options.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="">
                    <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color</label>
                    <select
                        id="color"
                        name="color"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={product?.color || ""}
                    >
                        <option value="">Selecciona un color</option>
                        {color.options.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <UploadProductImage
                CurrentImagenes={product?.imagenes}
            />
        </div>
    );
}
