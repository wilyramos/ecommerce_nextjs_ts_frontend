//File: frontend/components/admin/products/CreateProductForm.tsx

"use client";

import { useActionState, useEffect } from "react";
import ProductForm from "./ProductForm";
import { useRouter } from "next/navigation";
import { createProduct } from "@/actions/product/add-product-action";
import { toast } from "sonner";
import type { ProductWithCategoryResponse } from "@/src/schemas";
import type { CategoryListResponse } from "@/src/schemas/category.schema";

import type { TBrand } from "@/src/schemas/brands";
import type { ProductLine } from "@/src/schemas/line.schema";
import { Button } from "@/components/ui/button";
import type { Collection } from "@/src/schemas/collection.schema";

interface CreateProductFormProps {
    categorias: CategoryListResponse;
    brands: TBrand[];
    lines: ProductLine[];
    initialData?: ProductWithCategoryResponse;
    allCollections: Collection[];

}

export default function CreateProductForm({ categorias, brands, lines, initialData, allCollections }: CreateProductFormProps) {
    const router = useRouter();

    const [state, dispatch] = useActionState(createProduct, {
        errors: [],
        success: ""
    });

    useEffect(() => {
        if (state.success) {
            toast.success(state.success);
            router.push("/admin/products");
        }
        if (state.errors) {
            state.errors.forEach((error) => {
                toast.error(error);
            });
        }
    }, [state, router]);

    const categoriasOrdenadas = [...categorias].sort((a, b) =>
        a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base" })
    );

    return (
        <form
            className="flex flex-col gap-4 w-full max-screen-2xl mx-auto "
            noValidate
            action={dispatch}
        >
            <ProductForm
                product={initialData}
                categorias={categoriasOrdenadas}
                brands={brands}
                lines={lines}
                allCollections={allCollections}
            />

            <div className="flex justify-end py-4 border-t border-border sticky bottom-0 z-10 px-4 bg-background">

                <Button
                    type="submit"
                    className="px-8 font-semibold"
                >
                    Crear producto
                </Button>

            </div>

        </form>
    );
}