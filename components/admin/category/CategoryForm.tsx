// File: components/admin/category/CategoryForm.tsx

"use client";

import type { CategoryResponse } from "@/src/schemas/category.schema";
import AttributeFields from "./AttributeFileds";
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
import { FormMediaField } from "@/components/form/FormMediaField";

type Props = {
    category?: CategoryResponse;
    categories: CategoryResponse[];
};

export default function CategoryForm({ category, categories }: Props) {
    // Excluir la categoría actual de los posibles padres (evita auto-referencia)
    const availableParents = categories.filter((c) => c._id !== category?._id);

    const currentParentId =
        category?.parent && typeof category.parent === "object"
            ? category.parent._id
            : typeof category?.parent === "string"
                ? category.parent
                : "null";

    return (
        <div className="space-y-6">
            {/* Información básica */}
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="nombre">Nombre de la categoría</Label>
                    <Input
                        id="nombre"
                        name="nombre"
                        defaultValue={category?.nombre}
                        placeholder="Ej. Electrónica"
                        required
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                        id="descripcion"
                        name="descripcion"
                        defaultValue={category?.descripcion}
                        placeholder="Describe la categoría..."
                        className="min-h-[90px] resize-none"
                    />
                </div>
            </div>


            {/* Jerarquía y orden */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="parent">Categoría padre</Label>
                    <Select defaultValue={currentParentId} name="parent">
                        <SelectTrigger id="parent">
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

                <div className="space-y-1.5">
                    <Label htmlFor="order">
                        Orden de prioridad
                        <span className="ml-1 text-xs text-muted-foreground font-normal">
                            (menor = mayor prioridad)
                        </span>
                    </Label>
                    <Input
                        id="order"
                        name="order"
                        type="number"
                        min={0}
                        defaultValue={category?.order ?? 0}
                        placeholder="0"
                    />
                </div>
            </div>


            {/* Imagen */}
            <div className="space-y-1.5">
                <FormMediaField
                    name="image"
                    label="Imagen de la categoría"
                    folder="general"
                    defaultValue={category?.image}
                    multiple={false}
                    accept="image"
                />
            </div>


            {/* Atributos */}
            <AttributeFields defaultAttributes={category?.attributes} />


            {/* Estado */}
            <CategorySwitches isActive={category?.isActive ?? true} />
        </div>
    );
}