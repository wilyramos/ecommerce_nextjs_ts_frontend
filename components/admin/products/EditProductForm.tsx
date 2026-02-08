"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

// Actions y Componentes
import { EditProduct } from "@/actions/product/edit-product-action";
import ProductForm from "./ProductForm";

// Tipos
import type { ProductWithCategoryResponse, CategoryListResponse } from "@/src/schemas";
import type { TBrand } from "@/src/schemas/brands";
import type { ProductLine } from "@/src/schemas/line.schema"; // Importamos el tipo

interface EditProductFormProps {
    product: ProductWithCategoryResponse;
    categorias: CategoryListResponse;
    brands: TBrand[];
    lines: ProductLine[]; // Agregamos lines a las props
}

export default function EditProductForm({ product, categorias, brands, lines }: EditProductFormProps) {

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

    return (
        <form
            className="flex flex-col gap-2 w-full max-w-7xl mx-auto mt-8 bg-white rounded-lg"
            noValidate
            action={dispatch}
        >
            <ProductForm
                key={product._id} // Fuerza re-render si cambia el ID (buena práctica)
                product={product} // Pasamos los datos actuales para rellenar el form
                categorias={categoriasOrdenadas}
                brands={brands}
                lines={lines} // Pasamos las líneas al formulario genérico
            />

            <div className="p-4">
                <input
                    type="submit"
                    value="Actualizar Producto"
                    className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 cursor-pointer inline-block w-full sm:w-auto'
                />
            </div>
        </form>
    );
}