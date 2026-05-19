"use client";

import * as React from "react";
import type { CategoryResponse } from "@/src/schemas/category.schema";
import AttributeFields from "./AttributeFileds";
import { ImageUploadDialog } from "./ImageUploadDialog";
import CategorySwitches from "./CategorySwitches";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type Props = {
    category?: CategoryResponse;
    categories: CategoryResponse[];
};

export default function CategoryForm({ category, categories }: Props) {
    const imageInputRef = React.useRef<HTMLInputElement>(null);

    // Filtrar la categoría actual del listado para evitar que se elija a sí misma como padre
    const availableParents = categories.filter((cat) => cat._id !== category?._id);

    return (
        <div className="space-y-6 text-sm text-gray-700">
            {/* Nombre */}
            <div className="space-y-1">
                <Label htmlFor="nombre">Nombre de la categoría</Label>
                <Input
                    id="nombre"
                    name="nombre"
                    defaultValue={category?.nombre}
                    placeholder="Ej. Electrónica"
                    required
                />
            </div>

            {/* Descripción */}
            <div className="space-y-1">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                    id="descripcion"
                    name="descripcion"
                    defaultValue={category?.descripcion}
                    placeholder="Describe la categoría"
                    className="min-h-[100px]"
                />
            </div>

            {/* Categoría padre */}
            <div className="space-y-1">
                <Label htmlFor="parent">Categoría padre</Label>
                <Select
                    defaultValue={
                        category?.parent && typeof category.parent === "object"
                            ? category.parent._id
                            : typeof category?.parent === "string"
                                ? category.parent
                                : "null"
                    }
                    name="parent"
                >
                    <SelectTrigger id="parent" className="min-w-xs">
                        <SelectValue placeholder="Sin categoría padre" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="null">Sin categoría padre</SelectItem>
                        {availableParents.map((cat) => (
                            <SelectItem key={cat._id} value={cat._id}>
                                {cat.nombre}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Orden de Visualización */}
            <div className="space-y-1">
                <Label htmlFor="order">Orden de prioridad (Menor número, mayor prioridad)</Label>
                <Input
                    id="order"
                    name="order"
                    type="number"
                    min={0}
                    defaultValue={category?.order ?? 0}
                    placeholder="0"
                />
            </div>

            {/* Atributos técnicos de filtrado y variantes */}
            <AttributeFields defaultAttributes={category?.attributes} />

            {/* Imagen */}
            <div className="space-y-1">
                <Label>Imagen de la categoría</Label>
                <ImageUploadDialog image={category?.image} inputRef={imageInputRef} />
                <input
                    ref={imageInputRef}
                    type="hidden"
                    name="image"
                    defaultValue={category?.image || ""}
                />
            </div>

            {/* Switches de estado */}
            <CategorySwitches isActive={category?.isActive ?? true} />
        </div>
    );
}