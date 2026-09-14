// File: components/store/ClientCategorias.tsx
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PiCaretRightBold } from "react-icons/pi";
import { RiMenu2Line } from "react-icons/ri";
import Link from "next/link";
import { useState } from "react";
import { CategoryResponse } from "@/src/schemas/category.schema";
import Logo from "../ui/Logo";

export default function ClientCategorias({
  categories,
}: {
  categories: CategoryResponse[];
}) {
  const [open, setOpen] = useState(false);

  const grouped = categories.reduce((acc, category) => {
    const parentId =
      category.parent && typeof category.parent !== "string"
        ? category.parent._id
        : null;

    const key = parentId ?? "root";
    if (!acc[key]) acc[key] = [];
    acc[key].push(category);
    return acc;
  }, {} as Record<string, CategoryResponse[]>);

  const rootCategories = grouped["root"] || [];

  const handleToggle = () => setOpen(!open);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-radius-md px-2.5 py-1.5 text-xs font-semibold text-text-primary transition-colors duration-fast hover:bg-surface-secondary active:scale-[0.98]"
        >
          <RiMenu2Line size={18} />
          <span>Categorías</span>
        </button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[320px] border-r border-border-primary bg-surface-primary p-5 shadow-xl sm:w-[360px]"
      >
        <div className="border-b border-border-primary pb-4">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              <div className="max-w-[120px]">
                <Logo color="black" />
              </div>
            </SheetTitle>
          </SheetHeader>
        </div>

        <ScrollArea className="h-[calc(100vh-120px)] pr-2 pt-4">
          <div className="space-y-2">
            {rootCategories.map((cat) => {
              const subcategories = grouped[cat._id] || [];

              return (
                <div key={cat._id} className="rounded-radius-md">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between rounded-radius-md px-3 py-2.5 text-sm font-medium text-text-primary transition-colors duration-fast hover:bg-surface-secondary">
                      <span>{cat.nombre}</span>
                      <PiCaretRightBold
                        size={14}
                        className="text-text-tertiary transition-transform duration-fast group-open:rotate-90 group-hover:text-text-primary"
                      />
                    </summary>

                    {subcategories.length > 0 && (
                      <ul className="mt-1 space-y-0.5 pl-3">
                        {subcategories.map((sub) => (
                          <li key={sub._id}>
                            <Link
                              href={`/productos?category=${sub.slug}`}
                              className="block rounded-radius-sm px-3 py-1.5 text-xs font-normal text-text-secondary transition-colors duration-fast hover:bg-surface-secondary hover:text-text-primary"
                              onClick={handleToggle}
                            >
                              {sub.nombre}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </details>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}