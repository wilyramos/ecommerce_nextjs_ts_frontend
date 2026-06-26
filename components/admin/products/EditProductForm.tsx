"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

// Actions y Componentes
import { EditProduct } from "@/actions/product/edit-product-action";
import ProductForm from "./ProductForm";

// Tipos
import type { ProductWithCategoryResponse } from "@/src/schemas";
import type { CategoryListResponse } from "@/src/schemas/category.schema";

import type { TBrand } from "@/src/schemas/brands";
import type { ProductLine } from "@/src/schemas/line.schema";
import { Button } from "@/components/ui/button";
import type { Collection } from "@/src/schemas/collection.schema";

interface EditProductFormProps {
    product: ProductWithCategoryResponse;
    categorias: CategoryListResponse;
    brands: TBrand[];
    lines: ProductLine[];
    allCollections: Collection[];
}

export default function EditProductForm({ product, categorias, brands, lines, allCollections }: EditProductFormProps) {

    // Bind para pasar el ID al Server Action de forma segura
    const editProductWithId = EditProduct.bind(null, product._id);

    const [state, dispatch] = useActionState(editProductWithId, {
        errors: [],
        success: ""
    });

    useEffect(() => {
        if (state.errors) {
            state.errors.forEach(error => toast.error(error));
        }
        if (state.success) {
            toast.success(state.success);
        }
    }, [state]);

    const categoriasOrdenadas = [...categorias].sort((a, b) =>
        a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
    );

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(e.currentTarget);
        const variantsError = formData.get("variants_error");

        // Si existe un error marcado por el componente de variantes, detenemos el envío
        if (variantsError === "true") {
            e.preventDefault();
            toast.error("Por favor, corrige los errores en las variantes antes de actualizar.");
            return;
        }
    };

    return (
        <form
            className="flex flex-col min-h-full w-full"
            noValidate
            action={dispatch}
            onSubmit={handleSubmit}
        >
            {/* Contenedor del contenido del formulario que mantiene el grid */}
            <div className="flex-1 pb-4">
                <ProductForm
                    key={product._id}
                    product={product}
                    categorias={categoriasOrdenadas}
                    brands={brands}
                    lines={lines}
                    allCollections={allCollections}
                />
            </div>

            {/* Botón inferior verdaderamente fijado en la base del formulario */}
            <div className="flex justify-end py-4 border-t border-border sticky bottom-0 z-10 px-4 bg-background mt-auto">
                <Button type="submit">
                    {state.success ? "Actualizado" : "Actualizar producto"}
                </Button>
            </div>
        </form>
    );
}