// File: frontend/app/admin/category-v3/[id]/page.tsx
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { categoryService } from "@/src/services/category-v3.service";
import EditCategoryClient from "@/components/admin/categories-v3/EditCategoryClient";
import { AdminCompactHeader } from "@/components/admin/ui/layout/AdminCompactHeader";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Editar Categoría | Panel de Administración",
  description: "Actualizar propiedades, imágenes y atributos de la categoría",
};

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryV3Page({ params }: EditPageProps) {
  const { id } = await params;

  const [category, tree] = await Promise.all([
    categoryService.getById(id).catch(() => null),
    categoryService.getTree().catch(() => []),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-full bg-zinc-50/40">
      {/* ── CABECERA COMPACTA ── */}
      <AdminCompactHeader
        breadcrumbs={[
          { label: "Catálogo", href: "/admin/products" },
          { label: "Categorías", href: "/admin/category-v3" },
          { label: category.nombre },
        ]}
        badge={
          <span className="bg-zinc-100 text-zinc-600 border border-zinc-200 px-1.5 py-0.5 text-[10px] font-mono font-bold">
            {category._id}
          </span>
        }
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/category-v3">
              <ArrowLeft />
              Volver al listado
            </Link>
          </Button>
        }
      />

      {/* ── CONTENIDO PRINCIPAL ── */}
      <div className="p-4 md:p-6 max-w-6xl w-full mx-auto">
        <EditCategoryClient initialData={category} tree={tree} />
      </div>
    </div>
  );
}