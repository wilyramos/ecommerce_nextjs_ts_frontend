// File: components/store/ClientCategoriasDesktop.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import type { CategoryResponse, CategoryListResponse } from "@/src/schemas";

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export default function ClientCategoriasDesktop({
  categories,
}: {
  categories: CategoryResponse[];
}) {
  // Agrupar categorías por parent
  const grouped = React.useMemo(() => {
    return categories.reduce((acc, category) => {
      const parentId =
        category.parent && typeof category.parent !== "string"
          ? category.parent._id
          : null;

      const key = parentId ?? "root";
      if (!acc[key]) acc[key] = [];
      acc[key].push(category);
      return acc;
    }, {} as Record<string, CategoryListResponse>);
  }, [categories]);

  const rootCategories = grouped["root"] || [];

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex-wrap">
        {rootCategories.map((cat) => {
          const sub = grouped[cat._id] || [];

          return (
            <NavigationMenuItem key={cat._id}>
              <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
                {cat.nombre}
              </NavigationMenuTrigger>

              {sub.length > 0 && (
                <NavigationMenuContent>
                  <ul className="grid gap-4 md:w-[520px] lg:w-[650px] lg:grid-cols-[.8fr_1fr]">
                    {/* Panel descriptivo */} 
                    <li className="p-4">
                      <NavigationMenuLink asChild>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {cat.nombre}
                          </h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            Explora todas las subcategorías disponibles dentro de{" "}
                            <strong>{cat.nombre}</strong>.
                          </p>
                        </div>
                      </NavigationMenuLink>
                    </li>

                    {/* Lista de subcategorías con imagen */}
                    <li>
                      <ul className="space-y-2">
                        {sub.map((subcat) => (
                          <ListItem
                            key={subcat._id}
                            href={`/productos?category=${subcat.slug}`}
                            title={subcat.nombre}
                            image={subcat.image}
                          >
                            {subcat.descripcion ??
                              `Productos disponibles en ${subcat.nombre}`}
                          </ListItem>
                        ))}

                        {/* link "ver todo" */}
                        {/* <li className="pt-2">
                          <NavigationMenuLink asChild>
                            <Link
                              href={`/productos?category=${cat.slug ?? ""}`}
                              className="text-primary text-sm font-medium hover:underline"
                            >
                              Ver todo en {cat.nombre}
                            </Link>
                          </NavigationMenuLink>
                        </li> */}
                      </ul>
                    </li>
                  </ul>
                </NavigationMenuContent>
              )}
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

/* ----------------------------------------------------
   ListItem con imagen (subcategorías de 2do nivel)
----------------------------------------------------- */
function ListItem({
  title,
  children,
  href,
  image,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & {
  href: string;
  image?: string;
}) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="flex items-center flex-row gap-3 p-2 rounded-md hover:bg-gray-100 transition"
        >
          {/* Miniatura */}
          {image && (
            <div className="relative w-11 h-11 flex-shrink-0 rounded-md overflow-hidden">
              <Image
                src={image}
                alt={title || "Imagen de categoría"}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
          )
            
          }

          {/* Texto */}
          <div>
            <div className="text-sm font-medium text-gray-800">{title}</div>
            <p className="text-muted-foreground text-xs line-clamp-2 leading-snug">
              {children}
            </p>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
