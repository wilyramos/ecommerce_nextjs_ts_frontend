"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { routes } from "@/lib/routes";
import type { Collection } from "@/src/schemas/collection.schema";
import { FiImage, FiArrowRight } from "react-icons/fi";
import { ChevronDown } from "lucide-react";
import { CategoryResponse } from "@/src/schemas/category.schema";

interface Props {
  categories: CategoryResponse[];
  collections?: Collection[];
}

export default function ClientCategoriasDesktop({
  categories,
  collections = [],
}: Props) {
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const { rootNoSub, rootWithSub } = React.useMemo(() => {
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
    const rootNoSub: CategoryResponse[] = [];
    const rootWithSub: { cat: CategoryResponse; sub: CategoryResponse[] }[] = [];

    rootCategories.forEach((cat) => {
      const sub = grouped[cat._id] || [];
      if (sub.length === 0) {
        rootNoSub.push(cat);
      } else {
        rootWithSub.push({ cat, sub });
      }
    });

    return { rootNoSub, rootWithSub };
  }, [categories]);

  const handleMouseEnter = (key: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(key);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 120);
  };

  return (
    <nav
      className="relative flex items-center gap-3"
      onMouseLeave={handleMouseLeave}
    >
      {/* 1. Categorías directas */}
      {rootNoSub.map((cat) => (
        <Link
          key={cat._id}
          href={routes.catalog({ category: cat.slug })}
          prefetch={false}
          onMouseEnter={() => handleMouseEnter(cat._id)}
          className="rounded-radius-md py-1.5 text-xs font-medium text-text-secondary transition-colors duration-fast hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-accent"
        >
          {cat.nombre}
        </Link>
      ))}

      {/* 2. Categorías con dropdown flotante */}
      {rootWithSub.map(({ cat, sub }) => {
        const isOpen = activeMenu === cat._id;

        return (
          <div
            key={cat._id}
            className={`relative ${isOpen ? "z-dropdown" : "z-auto"}`}
            onMouseEnter={() => handleMouseEnter(cat._id)}
          >
            <Link
              href={routes.catalog({ category: cat.slug })}
              prefetch={false}
              className={`inline-flex items-center gap-1 rounded-radius-md px-3 py-1.5 text-xs font-medium transition-colors duration-fast focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-accent ${
                isOpen
                  ? "bg-surface-secondary text-text-primary"
                  : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
              }`}
            >
              <span>{cat.nombre}</span>
              <ChevronDown
                size={12}
                className={`text-text-tertiary transition-transform duration-fast ${
                  isOpen ? "rotate-180 text-text-primary" : ""
                }`}
              />
            </Link>

            {/* Dropdown con z-dropdown y sombra Apple */}
            {isOpen && (
              <div className="absolute left-0 top-full z-dropdown pt-1.5 animate-in fade-in-0 zoom-in-98 duration-fast">
                <div className="grid w-[540px] grid-cols-[180px_1fr] overflow-hidden rounded-radius-xl border border-border-primary/80 bg-surface-primary shadow-2xl backdrop-blur-md">
                  <div className="flex flex-col justify-between border-r border-border-primary/60 bg-surface-secondary/50 p-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                        Colección
                      </span>
                      <h4 className="text-sm font-semibold text-text-primary">
                        {cat.nombre}
                      </h4>
                    </div>

                    <Link
                      href={routes.catalog({ category: cat.slug })}
                      prefetch={false}
                      className="group inline-flex items-center gap-1 text-xs font-medium text-brand-accent transition-colors duration-fast hover:underline"
                    >
                      <span>Ver todo</span>
                      <FiArrowRight className="h-3 w-3 transition-transform duration-fast group-hover:translate-x-0.5" />
                    </Link>
                  </div>

                  <div className="p-2.5">
                    <ul className="grid grid-cols-2 gap-1">
                      {sub.map((s) => (
                        <li key={s._id}>
                          <Link
                            href={routes.catalog({ category: s.slug })}
                            prefetch={false}
                            className="group flex items-center gap-2 rounded-radius-md p-1.5 transition-colors duration-fast hover:bg-surface-secondary"
                          >
                            <div className="relative flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-radius-sm border border-border-primary/50 bg-surface-secondary">
                              {s.image ? (
                                <Image
                                  src={s.image}
                                  alt={s.nombre}
                                  fill
                                  sizes="28px"
                                  className="object-cover transition-transform duration-fast group-hover:scale-105"
                                  unoptimized
                                />
                              ) : (
                                <FiImage className="h-3 w-3 text-text-tertiary/60" />
                              )}
                            </div>
                            <span className="truncate text-xs text-text-secondary transition-colors duration-fast group-hover:text-text-primary">
                              {s.nombre}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* 3. Tendencias */}
      {collections.length > 0 && (
        <div
          className={`relative ${activeMenu === "tendencias" ? "z-dropdown" : "z-auto"}`}
          onMouseEnter={() => handleMouseEnter("tendencias")}
        >
          <button
            type="button"
            className={`inline-flex items-center gap-1 rounded-radius-md px-3 py-1.5 text-xs font-medium transition-colors duration-fast focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-accent ${
              activeMenu === "tendencias"
                ? "bg-surface-secondary text-text-primary"
                : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
            }`}
          >
            <span>Tendencias</span>
            <ChevronDown
              size={12}
              className={`text-text-tertiary transition-transform duration-fast ${
                activeMenu === "tendencias" ? "rotate-180 text-text-primary" : ""
              }`}
            />
          </button>

          {activeMenu === "tendencias" && (
            <div className="absolute left-0 top-full z-dropdown pt-1.5 animate-in fade-in-0 zoom-in-98 duration-fast">
              <div className="grid w-[540px] grid-cols-[180px_1fr] overflow-hidden rounded-radius-xl border border-border-primary/80 bg-surface-primary shadow-2xl backdrop-blur-md">
                <div className="flex flex-col justify-between border-r border-border-primary/60 bg-surface-secondary/50 p-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-text-tertiary">
                      Especiales
                    </span>
                    <h4 className="text-sm font-semibold text-text-primary">
                      Tendencias
                    </h4>
                  </div>

                  <Link
                    href="/colecciones"
                    prefetch={false}
                    className="group inline-flex items-center gap-1 text-xs font-medium text-brand-accent transition-colors duration-fast hover:underline"
                  >
                    <span>Ver catálogo</span>
                    <FiArrowRight className="h-3 w-3 transition-transform duration-fast group-hover:translate-x-0.5" />
                  </Link>
                </div>

                <div className="p-2.5">
                  <ul className="grid grid-cols-2 gap-1">
                    {collections.map((c) => (
                      <li key={c._id}>
                        <Link
                          href={`/colecciones/${c.slug}`}
                          prefetch={false}
                          className="group flex items-center gap-2 rounded-radius-md p-1.5 transition-colors duration-fast hover:bg-surface-secondary"
                        >
                          <div className="relative flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-radius-sm border border-border-primary/50 bg-surface-secondary">
                            {c.image ? (
                              <Image
                                src={c.image}
                                alt={c.name}
                                fill
                                sizes="28px"
                                className="object-cover transition-transform duration-fast group-hover:scale-105"
                                unoptimized
                              />
                            ) : (
                              <FiImage className="h-3 w-3 text-text-tertiary/60" />
                            )}
                          </div>
                          <span className="truncate text-xs text-text-secondary transition-colors duration-fast group-hover:text-text-primary">
                            {c.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}