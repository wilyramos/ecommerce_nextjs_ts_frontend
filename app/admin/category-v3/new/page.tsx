// File: frontend/app/admin/category-v3/new/page.tsx
import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { categoryService } from "@/src/services/category-v3.service";
import type { CategoryTreeItem } from "@/src/schemas/category-v3.schema";
import CreateCategoryClient from "@/components/admin/categories-v3/CreateCategoryClient";
import { AdminCompactHeader } from "@/components/admin/ui/layout/AdminCompactHeader";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Nueva Categoría | Panel de Administración",
    description: "Crear una nueva categoría en el catálogo",
};

export default async function NewCategoryPage() {
    let tree: CategoryTreeItem[] = []; // <-- Tipado explícito aquí
    try {
        tree = await categoryService.getTree();
    } catch (error) {
        console.error("Error al cargar el árbol de categorías:", error);
    }

    return (
        <div className="flex flex-col min-h-full bg-zinc-50/40">
            <AdminCompactHeader
                breadcrumbs={[
                    { label: "Catálogo", href: "/admin/products" },
                    { label: "Categorías", href: "/admin/category-v3" },
                    { label: "Nueva Categoría" },
                ]}
                actions={
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2.5 text-xs text-zinc-600 hover:text-zinc-900 border border-zinc-200 bg-white"
                    >
                        <Link href="/admin/category-v3">
                            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                            Volver al listado
                        </Link>
                    </Button>
                }
            />

            <div className="p-4 md:p-6 max-w-6xl w-full mx-auto">
                <CreateCategoryClient tree={tree} />
            </div>
        </div>
    );
}