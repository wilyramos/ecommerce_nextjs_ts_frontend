"use client";

import { useActionState, useEffect } from "react";
import ProductForm from "./ProductForm";
import { useRouter } from "next/navigation";
import { createProduct } from "@/actions/product/add-product-action";
import { toast } from "sonner";
import type { CategoryListResponse, ProductWithCategoryResponse } from "@/src/schemas";
import type { TBrand } from "@/src/schemas/brands";
import type { ProductLine } from "@/src/schemas/line.schema";
import { Button } from "@/components/ui/button";

interface CreateProductFormProps {
    categorias: CategoryListResponse;
    brands: TBrand[];
    lines: ProductLine[];
    initialData?: ProductWithCategoryResponse;
}

export default function CreateProductForm({ categorias, brands, lines, initialData }: CreateProductFormProps) {
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
            className="flex flex-col gap-4 w-full max-w-5xl mx-auto select-none bg-background text-foreground"
            noValidate
            action={dispatch}
        >
            <ProductForm
                product={initialData}
                categorias={categoriasOrdenadas}
                brands={brands}
                lines={lines}
            />
            <Button type="submit">Crear producto</Button>
            
        </form>
    );
}