import type { Product } from "@/src/schemas";

export default function BudgetForm({ product }: { product?: Product }) {
    return (
        <div className="w-full mx-auto p-6 bg-white shadow-lg rounded-2xl space-y-2">

            <div className="space-y-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del producto</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={product?.name}
                    required
                />
            </div>

            <div className="space-y-1">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={product?.description}
                    required
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={product?.price}
                        required
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
                        required
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Imagen</label>
                <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

           
        </div>
    );
}
