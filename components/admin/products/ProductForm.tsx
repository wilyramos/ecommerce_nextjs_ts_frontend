import type { ProductAPIResponseType } from "@/src/schemas";
import type { CategoriasList } from "@/src/schemas";
import UploadProductImage from "./UploadProductImage";



export default function ProductForm({ product, categorias }: { product?: ProductAPIResponseType, categorias: CategoriasList }) {


    

    return (
        <div className="w-full mx-auto p-6 bg-white shadow-lg rounded-2xl space-y-2">

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
                    defaultValue={product?.categoria?._id}
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

            
            <UploadProductImage />
        </div>
    );
}
