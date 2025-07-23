import type { CategoryResponse } from "@/src/schemas";
import AttributeFields from "./AttributeFileds";

type Props = {
    category?: CategoryResponse;
    categories: CategoryResponse[];
};

export default function CategoryForm({ category, categories }: Props) {


    return (
        <div className="text-xs text-gray-500 space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nombre de la categoría
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={category?.nombre}
                    className="w-full border border-gray-300 rounded-lg p-2"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Descripción
                </label>
                <textarea
                    id="description"
                    name="description"
                    defaultValue={category?.descripcion}
                    className="w-full border border-gray-300 rounded-lg p-2"
                />
            </div>

            <div>
                <label htmlFor="parent" className="block text-sm font-medium text-gray-700">
                    Categoría padre
                </label>
                <select
                    id="parent"
                    name="parent"
                    defaultValue={typeof category?.parent === "object" ? category.parent?._id : ""}
                    className="w-full border border-gray-300 rounded-lg p-2"
                >
                    <option value="">Sin categoría padre</option>
                    {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>
                            {cat.nombre}
                        </option>
                    ))}
                </select>
                {category?._id && (
                    <p className="text-xs text-gray-500 mt-1">No puedes seleccionar la misma categoría como padre.</p>
                )}
            </div>

            <AttributeFields defaultAttributes={category?.attributes} />

        </div>
    );
}