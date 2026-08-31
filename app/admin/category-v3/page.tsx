// File: frontend/app/admin/category-v3/page.tsx
import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { categoryService } from "@/src/services/category-v3.service";
import type { CategoryTreeItem, CategoryResponse } from "@/src/schemas/category-v3.schema";
import CategoryListClient from "@/components/admin/categories-v3/CategoryListClient";
import { AdminCompactHeader } from "@/components/admin/ui/layout/AdminCompactHeader";
import { Button } from "@/components/ui/button";

function flattenCategoryTree(
  tree: CategoryTreeItem[],
  level: number = 0,
  parentPath: string = ""
): (CategoryResponse & { level: number; pathName: string })[] {
  let result: (CategoryResponse & { level: number; pathName: string })[] = [];

  for (const item of tree) {
    const currentPathName = level === 0 ? item.nombre : `${parentPath} > ${item.nombre}`;
    const { children, ...baseItem } = item;

    result.push({
      ...baseItem,
      level,
      pathName: currentPathName,
    });

    if (children && children.length > 0) {
      result = result.concat(flattenCategoryTree(children, level + 1, currentPathName));
    }
  }

  return result;
}

export default async function CategoriesV3IndexPage() {
  const tree = await categoryService.getTree();
  const flattenedCategories = flattenCategoryTree(tree);

  return (
    <div className="flex flex-col min-h-full bg-zinc-50/40">
      {/* Cabecera compacta de una sola línea */}
      <AdminCompactHeader
        breadcrumbs={[
          { label: "Catálogo", href: "/admin/products" },
          { label: "Categorías" },
        ]}
        badge={
          <span className="bg-zinc-100 text-zinc-600 border border-zinc-200 px-1.5 py-0.5 text-[10px] font-mono font-bold">
            {flattenedCategories.length}
          </span>
        }
        actions={
          <Button asChild size="sm" className="h-7 px-3 text-xs bg-zinc-900 hover:bg-zinc-800 text-white font-semibold">
            <Link href="/admin/category-v3/new">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Nueva Categoría
            </Link>
          </Button>
        }
      />

      {/* Vista principal de la tabla a pantalla completa útil */}
      <div className="p-4 md:p-6">
        <CategoryListClient data={flattenedCategories} />
      </div>
    </div>
  );
}