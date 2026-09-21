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
import { H4 } from "@/components/ui/TypographyV3";
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
      categories: [...filters.categories].sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      ),
      brands: [...filters.brands].sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      ),
      lines: [...filters.lines].sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      ),
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
    "group flex w-full items-center justify-between py-3.5 outline-none transition-opacity duration-fast hover:no-underline";

  const rowClass =
    "group flex w-full cursor-pointer items-center gap-2.5 rounded-radius-md px-2.5 py-1.5 outline-none transition-colors duration-fast hover:bg-surface-secondary";

  const badgeClass =
    "rounded-radius-sm bg-surface-secondary px-1.5 py-0.5 font-mono text-[10px] font-medium tabular-nums text-text-secondary transition-colors duration-fast group-hover:bg-surface-primary group-hover:border-border-primary/60 group-hover:shadow-sm";

  const checkboxClass =
    "size-4 cursor-pointer rounded-radius-sm border-border-strong text-text-inverse transition-colors duration-fast focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-1 data-[state=checked]:border-brand-primary data-[state=checked]:bg-brand-primary";

  return (
    <div className="w-full select-none bg-surface-primary pb-8 px-1">
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
          <AccordionItem
            value="item-categories"
            className="border-b border-border-primary/50 py-0.5"
          >
            <AccordionTrigger className={triggerClass}>
              <H4 className="text-[11px] font-semibold tracking-wider uppercase text-text-tertiary transition-colors duration-fast group-hover:text-brand-primary">
                Categorías
              </H4>
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-3">
              <ul className="space-y-0.5">
                {sortedFilters.categories.map((cat) => {
                  const active = isCategoryActive(cat.slug);
                  return (
                    <li key={cat.id}>
                      <button
                        onClick={() => setCategory(cat.slug)}
                        className={cn(
                          rowClass,
                          "justify-between",
                          active && "bg-surface-secondary font-medium text-text-primary"
                        )}
                      >
                        <span
                          className={cn(
                            "cursor-pointer text-xs transition-colors duration-fast",
                            active
                              ? "font-semibold text-brand-primary"
                              : "font-normal text-text-secondary group-hover:text-text-primary"
                          )}
                        >
                          {cat.nombre}
                        </span>
                        {cat.count !== undefined && (
                          <span
                            className={cn(
                              badgeClass,
                              active &&
                                "bg-surface-primary border border-border-primary/60 shadow-sm font-semibold text-brand-primary"
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
          <AccordionItem
            value="item-brands"
            className="border-b border-border-primary/50 py-0.5"
          >
            <AccordionTrigger className={triggerClass}>
              <H4 className="text-[11px] font-semibold tracking-wider uppercase text-text-tertiary transition-colors duration-fast group-hover:text-brand-primary">
                Marcas
              </H4>
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-3">
              <div className="max-h-[240px] space-y-0.5 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-border-primary">
                {sortedFilters.brands.map((brand) => {
                  const active = isBrandActive(brand.slug);
                  return (
                    <div
                      key={brand.id}
                      onClick={() => setBrand(brand.slug)}
                      className={cn(rowClass, active && "bg-surface-secondary")}
                    >
                      <Checkbox checked={active} className={checkboxClass} />
                      <span
                        className={cn(
                          "flex-1 cursor-pointer text-xs transition-colors duration-fast",
                          active
                            ? "font-semibold text-brand-primary"
                            : "font-normal text-text-secondary group-hover:text-text-primary"
                        )}
                      >
                        {brand.nombre}
                      </span>
                      {brand.count !== undefined && (
                        <span
                          className={cn(
                            badgeClass,
                            active &&
                              "bg-surface-primary border border-border-primary/60 shadow-sm font-semibold text-brand-primary"
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

        {/* LÍNEAS / MODELOS */}
        {sortedFilters.lines.length > 0 && (
          <AccordionItem
            value="item-lines"
            className="border-b border-border-primary/50 py-0.5"
          >
            <AccordionTrigger className={triggerClass}>
              <H4 className="text-[11px] font-semibold tracking-wider uppercase text-text-tertiary transition-colors duration-fast group-hover:text-brand-primary">
                Modelos
              </H4>
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-3">
              <div className="max-h-[240px] space-y-0.5 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-border-primary">
                {sortedFilters.lines.map((line) => {
                  const active = isLineActive(line.slug);
                  return (
                    <div
                      key={line.id}
                      onClick={() => setLine(line.slug)}
                      className={cn(rowClass, active && "bg-surface-secondary")}
                    >
                      <Checkbox checked={active} className={checkboxClass} />
                      <span
                        className={cn(
                          "flex-1 cursor-pointer text-xs transition-colors duration-fast",
                          active
                            ? "font-semibold text-brand-primary"
                            : "font-normal text-text-secondary group-hover:text-text-primary"
                        )}
                      >
                        {line.nombre}
                      </span>
                      {line.count !== undefined && (
                        <span
                          className={cn(
                            badgeClass,
                            active &&
                              "bg-surface-primary border border-border-primary/60 shadow-sm font-semibold text-brand-primary"
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

        {/* ATRIBUTOS DINÁMICOS */}
        {sortedFilters.atributos.map((attr, idx) => {
          const isColorAttr = attr.name.toLowerCase().includes("color");
          return (
            <AccordionItem
              key={idx}
              value={`attr-${idx}`}
              className="border-b border-border-primary/50 py-0.5"
            >
              <AccordionTrigger className={triggerClass}>
                <H4 className="text-[11px] font-semibold tracking-wider uppercase text-text-tertiary transition-colors duration-fast group-hover:text-brand-primary">
                  {attr.name}
                </H4>
              </AccordionTrigger>
              <AccordionContent className="pt-1 pb-3">
                <div className="max-h-[240px] space-y-0.5 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-border-primary">
                  {attr.values.map((val) => {
                    const strVal = typeof val === "string" ? val : val.value;
                    const count =
                      typeof val === "string" ? undefined : val.count;
                    const isChecked = searchParams
                      .getAll(attr.name)
                      .includes(strVal);

                    return (
                      <div
                        key={strVal}
                        onClick={() => updateFilter(attr.name, strVal)}
                        className={cn(
                          rowClass,
                          isChecked && "bg-surface-secondary"
                        )}
                      >
                        <Checkbox
                          checked={isChecked}
                          className={checkboxClass}
                        />
                        <div className="flex flex-1 items-center gap-2">
                          {isColorAttr && (
                            <ColorCircle color={strVal} size={12} />
                          )}
                          <span
                            className={cn(
                              "cursor-pointer text-xs capitalize transition-colors duration-fast",
                              isChecked
                                ? "font-semibold text-brand-primary"
                                : "font-normal text-text-secondary group-hover:text-text-primary"
                            )}
                          >
                            {strVal}
                          </span>
                        </div>
                        {count !== undefined && (
                          <span
                            className={cn(
                              badgeClass,
                              isChecked &&
                                "bg-surface-primary border border-border-primary/60 shadow-sm font-semibold text-brand-primary"
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