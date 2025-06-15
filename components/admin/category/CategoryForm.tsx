import type { Category } from "@/src/schemas";
import React from "react";
import AttributeFields from "./AttributeFileds";

type Props = {
    category?: Category;
    categories: Category[];
};

export default function CategoryForm({ category, categories }: Props) {
    // Función para renderizar jerarquía con sangría visual
    const renderCategoryOptions = (
        cats: Category[],
        parentId: string | null = null,
        depth = 0
    ) => {
        return cats
            .filter((cat) => (cat.parent?._id || null) === parentId)
            .map((cat) => (
                <React.Fragment key={cat._id}>
                    <option
                        value={cat._id}
                        disabled={cat._id === category?._id}
                    >
                        {`${"— ".repeat(depth)}${cat.nombre}`}
                    </option>
                    {renderCategoryOptions(cats, cat._id, depth + 1)}
                </React.Fragment>
            ));
    };

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
                    defaultValue={category?.parent?._id || ""}
                    className="w-full border border-gray-300 rounded-lg p-2"
                >
                    <option value="">Sin categoría padre</option>
                    {renderCategoryOptions(categories)}
                </select>
                {category?._id && (
                    <p className="text-xs text-gray-500 mt-1">No puedes seleccionar la misma categoría como padre.</p>
                )}
            </div>

            <AttributeFields defaultAttributes={category?.attributes || []} />
        </div>
    );
}