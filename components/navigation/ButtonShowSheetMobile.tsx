// File: frontend/components/navigation/ButtonShowSheetMobile.tsx
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, ChevronRight } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ButtonV3 } from "@/components/ui/ButtonV3";

import { routes } from "@/lib/routes";
import type { CategoryResponse } from "@/src/schemas/category.schema";
import type { Collection } from "@/src/schemas/collection.schema";

interface Props {
  categories: CategoryResponse[];
  collections: Collection[];
}

export default function ButtonShowSheetMobile({ categories, collections }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => setOpen(false), [pathname]);

  const mainLinks = [
    { href: routes.catalog(), label: "Catálogo General" },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Abrir menú de navegación"
          className="flex size-9 items-center justify-center rounded-radius-full text-text-secondary outline-none transition-colors duration-fast hover:bg-surface-secondary hover:text-text-primary active:scale-95"
        >
          <Menu size={20} strokeWidth={2} />
        </button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="flex h-full w-[300px] select-none flex-col border-r border-border-primary/80 bg-surface-primary p-0 text-text-primary sm:w-[350px]"
      >
        {/* Header Fijo y Minimalista */}
        <div className="sticky top-0 z-10 border-b border-border-primary/60 bg-surface-primary/90 px-6 py-5 backdrop-blur-md">
          <SheetHeader className="text-left">
            <SheetTitle className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-tertiary">
              Menú de Navegación
            </SheetTitle>
          </SheetHeader>
        </div>

        {/* Contenido Scrolleable */}
        <ScrollArea className="flex-1 overflow-y-auto bg-surface-primary py-3">
          <nav className="flex flex-col gap-4">
            {/* Enlaces principales */}
            <div className="flex flex-col px-3">
              {mainLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative rounded-radius-md px-4 py-2.5 text-xs font-semibold uppercase tracking-wider outline-none transition-all duration-fast",
                      isActive
                        ? "bg-surface-secondary font-bold text-text-primary"
                        : "text-text-secondary hover:bg-surface-secondary/60 hover:text-text-primary"
                    )}
                  >
                    {isActive && (
                      <span className="absolute bottom-1.5 left-2.5 top-1.5 w-1 rounded-full bg-brand-primary" />
                    )}
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Colecciones */}
            {collections.length > 0 && (
              <div className="px-3">
                <details className="group overflow-hidden rounded-radius-md bg-surface-secondary/40 transition-all duration-fast">
                  <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wider text-text-primary outline-none transition-colors hover:bg-surface-secondary">
                    Colecciones
                    <ChevronRight size={14} className="text-text-tertiary transition-transform duration-fast group-open:rotate-90" />
                  </summary>
                  <div className="flex flex-col gap-0.5 border-t border-border-primary/50 bg-surface-primary px-2 pb-2.5 pt-1">
                    {collections.map((col) => (
                      <Link
                        key={col._id}
                        href={`/colecciones/${col.slug}`}
                        className="rounded-radius-sm px-3 py-2 text-xs font-medium text-text-secondary outline-none transition-colors duration-fast hover:bg-surface-secondary hover:text-text-primary"
                      >
                        {col.name}
                      </Link>
                    ))}
                  </div>
                </details>
              </div>
            )}

            {/* Categorías */}
            <div className="space-y-2 px-3">
              <div className="px-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-tertiary">
                  Categorías
                </span>
              </div>

              <div className="space-y-1">
                {categories.filter(c => !c.parent).map((parent) => {
                  const subcategories = categories.filter(
                    c => (typeof c.parent === 'object' ? c.parent?._id : c.parent) === parent._id
                  );
                  const hasSubcategories = subcategories.length > 0;

                  if (!hasSubcategories) {
                    return (
                      <Link
                        key={parent._id}
                        href={routes.catalog({ category: parent.slug })}
                        className="block rounded-radius-md px-4 py-3 text-xs font-medium text-text-primary outline-none transition-all duration-fast hover:bg-surface-secondary/70"
                      >
                        {parent.nombre}
                      </Link>
                    );
                  }

                  return (
                    <details key={parent._id} className="group overflow-hidden rounded-radius-md bg-surface-secondary/40 transition-all duration-fast">
                      <summary
                        className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-xs font-medium text-text-primary outline-none transition-colors hover:bg-surface-secondary"
                        onClick={(e) => {
                          const target = e.target as HTMLElement;
                          if (!target.closest('.chevron-container')) {
                            e.preventDefault();
                            setOpen(false);
                            router.push(routes.catalog({ category: parent.slug }));
                          }
                        }}
                      >
                        <span>{parent.nombre}</span>
                        <div className="chevron-container rounded-radius-sm p-1 transition-colors hover:bg-surface-tertiary">
                          <ChevronRight size={14} className="text-text-tertiary transition-transform duration-fast group-open:rotate-90" />
                        </div>
                      </summary>
                      <div className="flex flex-col gap-0.5 border-t border-border-primary/50 bg-surface-primary px-2 pb-2.5 pt-1">
                        {subcategories.map((sub) => (
                          <Link
                            key={sub._id}
                            href={routes.catalog({ category: sub.slug })}
                            onClick={() => setOpen(false)}
                            className="rounded-radius-sm px-3 py-2 text-xs font-medium text-text-secondary outline-none transition-colors duration-fast hover:bg-surface-secondary hover:text-text-primary"
                          >
                            {sub.nombre}
                          </Link>
                        ))}
                      </div>
                    </details>
                  );
                })}
              </div>
            </div>
          </nav>
        </ScrollArea>

        {/* Footer Fijo y Limpio */}
        <div className="border-t border-border-primary/80 bg-surface-primary/90 p-4 backdrop-blur-md">
          <ButtonV3 asChild variant="default" size="full">
            <Link href="/auth/registro">Iniciar Sesión / Registro</Link>
          </ButtonV3>
        </div>
      </SheetContent>
    </Sheet>
  );
}