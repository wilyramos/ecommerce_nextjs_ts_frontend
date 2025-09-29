import * as React from "react";
import type { CategoryResponse } from "@/src/schemas";
import AttributeFields from "./AttributeFileds";
import { ImageUploadDialog } from "./ImageUploadDialog";
import CategorySwitches from "./CategorySwitches";

type Props = {
    category?: CategoryResponse;
    categories: CategoryResponse[];
};

export default function CategoryForm({ category, categories }: Props) {
    const imageInputRef = React.useRef<HTMLInputElement>(null);

    return (
        <div className="text-xs text-gray-500 space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm text-black font-semibold">
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
                <label htmlFor="description" className="block text-sm text-black font-semibold">
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
                <label htmlFor="parent" className="block text-sm text-black font-semibold">
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
                    <p className="text-xs text-gray-500 mt-1">
                        No puedes seleccionar la misma categoría como padre.
                    </p>
                )}
            </div>

            <AttributeFields defaultAttributes={category?.attributes} />

            <div>
                <label className="block text-sm text-black font-semibold mb-1">
                    Imagen de la categoría
                </label>
                {/* Pasamos la referencia del input a ImageUploadDialog */}
                <ImageUploadDialog image={category?.image} inputRef={imageInputRef} />
                {/* Hidden input dentro del form */}
                <input
                    ref={imageInputRef}
                    type="hidden"
                    name="image"
                    defaultValue={category?.image || ""}
                />
            </div>

            <CategorySwitches 
                isActive={category?.isActive}
            />


        </div>
    );
}
