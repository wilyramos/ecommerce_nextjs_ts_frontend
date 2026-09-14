// File: frontend/components/catalog/CatalogSidebar.tsx
"use client";

import { useMemo } from "react";
import { useCatalogNav } from "./hooks/useCatalogNav";
import type { CatalogFilters } from "@/src/schemas/catalog";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import PriceRangeFilter from "./PriceRangeFilter";
import ActiveFiltersSidebar from "./ActiveFiltersSidebar";
import ColorCircle from "../ui/ColorCircle";

interface Props {
  filters: CatalogFilters;
}

export default function CatalogSidebar({ filters }: Props) {
  const {
    setCategory,
    setBrand,
    setLine,
    updateFilter,
    isCategoryActive,
    isBrandActive,
    isLineActive,
    searchParams,
  } = useCatalogNav();

  const sortedFilters = useMemo(() => {
    const priorityOrder: Record<string, number> = {
      color: 1,
      compatibilidad: 2,
      "modelo compatible": 3,
      ram: 4,
    };

    return {
      categories: [...filters.categories].sort((a, b) => a.nombre.localeCompare(b.nombre)),
      brands: [...filters.brands].sort((a, b) => a.nombre.localeCompare(b.nombre)),
      lines: [...filters.lines].sort((a, b) => a.nombre.localeCompare(b.nombre)),
      atributos: [...filters.atributos]
        .sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          const priorityA = priorityOrder[nameA] ?? 999;
          const priorityB = priorityOrder[nameB] ?? 999;
          if (priorityA !== priorityB) return priorityA - priorityB;
          return nameA.localeCompare(nameB);
        })
        .map((attr) => ({
          ...attr,
          values: [...attr.values].sort((a, b) => {
            const va = typeof a === "string" ? a : a.value;
            const vb = typeof b === "string" ? b : b.value;
            return va.localeCompare(vb);
          }),
        })),
    };
  }, [filters]);

  const triggerClass =
    "py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-tertiary transition-colors duration-fast hover:text-text-primary hover:no-underline outline-none";

  const rowClass =
    "group flex cursor-pointer items-center gap-2.5 rounded-radius-md px-2 py-1.5 outline-none transition-colors duration-fast hover:bg-surface-secondary/70";

  const badgeClass =
    "rounded-radius-sm bg-surface-secondary px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-text-secondary transition-colors duration-fast group-hover:bg-surface-primary group-hover:border-border-primary/60 group-hover:shadow-2xs";

  const checkboxClass =
    "size-4 cursor-pointer rounded-radius-sm border-border-strong text-text-inverse transition-colors duration-fast focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-1 data-[state=checked]:border-brand-primary data-[state=checked]:bg-brand-primary";

  return (
    <div className="w-full select-none bg-surface-primary pb-8 md:p-2">
      <ActiveFiltersSidebar />

      <Accordion
        type="multiple"
        className="w-full space-y-1"
        defaultValue={["item-categories", "item-price"]}
      >
        {/* PRECIO */}
        <PriceRangeFilter filters={filters} />

        {/* CATEGORÍAS */}
        {sortedFilters.categories.length > 0 && (
          <AccordionItem value="item-categories" className="border-b border-border-primary/70 py-1">
            <AccordionTrigger className={triggerClass}>
              Categorías
            </AccordionTrigger>
            <AccordionContent className="pb-3 pt-1">
              <ul className="space-y-0.5">
                {sortedFilters.categories.map((cat) => {
                  const active = isCategoryActive(cat.slug);
                  return (
                    <li key={cat.id}>
                      <button
                        onClick={() => setCategory(cat.slug)}
                        className={cn(
                          rowClass,
                          "w-full justify-between pl-2.5",
                          active && "bg-surface-secondary/70 text-text-primary"
                        )}
                      >
                        <span
                          className={cn(
                            "cursor-pointer text-xs transition-colors duration-fast",
                            active ? "font-semibold text-text-primary" : "font-medium text-text-secondary group-hover:text-text-primary"
                          )}
                        >
                          {cat.nombre}
                        </span>
                        {cat.count !== undefined && (
                          <span
                            className={cn(
                              badgeClass,
                              active && "bg-surface-primary border border-border-primary/60 shadow-2xs"
                            )}
                          >
                            {cat.count}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* MARCAS */}
        {sortedFilters.brands.length > 0 && (
          <AccordionItem value="item-brands" className="border-b border-border-primary/70 py-1">
            <AccordionTrigger className={triggerClass}>
              Marcas
            </AccordionTrigger>
            <AccordionContent className="pb-3 pt-1">
              <div className="max-h-[240px] space-y-0.5 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-border-primary">
                {sortedFilters.brands.map((brand) => {
                  const active = isBrandActive(brand.slug);
                  return (
                    <div
                      key={brand.id}
                      onClick={() => setBrand(brand.slug)}
                      className={cn(rowClass, active && "bg-surface-secondary/70")}
                    >
                      <Checkbox checked={active} className={checkboxClass} />
                      <span
                        className={cn(
                          "flex-1 cursor-pointer text-xs transition-colors duration-fast",
                          active ? "font-semibold text-text-primary" : "font-medium text-text-secondary group-hover:text-text-primary"
                        )}
                      >
                        {brand.nombre}
                      </span>
                      {brand.count !== undefined && (
                        <span
                          className={cn(
                            badgeClass,
                            active && "bg-surface-primary border border-border-primary/60 shadow-2xs"
                          )}
                        >
                          {brand.count}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* LÍNEAS */}
        {sortedFilters.lines.length > 0 && (
          <AccordionItem value="item-lines" className="border-b border-border-primary/70 py-1">
            <AccordionTrigger className={triggerClass}>
              Modelos
            </AccordionTrigger>
            <AccordionContent className="pb-3 pt-1">
              <div className="max-h-[240px] space-y-0.5 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-border-primary">
                {sortedFilters.lines.map((line) => {
                  const active = isLineActive(line.slug);
                  return (
                    <div
                      key={line.id}
                      onClick={() => setLine(line.slug)}
                      className={cn(rowClass, active && "bg-surface-secondary/70")}
                    >
                      <Checkbox checked={active} className={checkboxClass} />
                      <span
                        className={cn(
                          "flex-1 cursor-pointer text-xs transition-colors duration-fast",
                          active ? "font-semibold text-text-primary" : "font-medium text-text-secondary group-hover:text-text-primary"
                        )}
                      >
                        {line.nombre}
                      </span>
                      {line.count !== undefined && (
                        <span
                          className={cn(
                            badgeClass,
                            active && "bg-surface-primary border border-border-primary/60 shadow-2xs"
                          )}
                        >
                          {line.count}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* ATRIBUTOS */}
        {sortedFilters.atributos.map((attr, idx) => {
          const isColorAttr = attr.name.toLowerCase().includes("color");
          return (
            <AccordionItem key={idx} value={`attr-${idx}`} className="border-b border-border-primary/70 py-1">
              <AccordionTrigger className={triggerClass}>
                {attr.name}
              </AccordionTrigger>
              <AccordionContent className="pb-3 pt-1">
                <div className="max-h-[240px] space-y-0.5 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-border-primary">
                  {attr.values.map((val) => {
                    const strVal = typeof val === "string" ? val : val.value;
                    const count = typeof val === "string" ? undefined : val.count;
                    const isChecked = searchParams.getAll(attr.name).includes(strVal);

                    return (
                      <div
                        key={strVal}
                        onClick={() => updateFilter(attr.name, strVal)}
                        className={cn(rowClass, isChecked && "bg-surface-secondary/70")}
                      >
                        <Checkbox checked={isChecked} className={checkboxClass} />
                        <div className="flex flex-1 items-center gap-2">
                          {isColorAttr && <ColorCircle color={strVal} size={12} />}
                          <span
                            className={cn(
                              "cursor-pointer text-xs capitalize transition-colors duration-fast",
                              isChecked ? "font-semibold text-text-primary" : "font-medium text-text-secondary group-hover:text-text-primary"
                            )}
                          >
                            {strVal}
                          </span>
                        </div>
                        {count !== undefined && (
                          <span
                            className={cn(
                              badgeClass,
                              isChecked && "bg-surface-primary border border-border-primary/60 shadow-2xs"
                            )}
                          >
                            {count}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}