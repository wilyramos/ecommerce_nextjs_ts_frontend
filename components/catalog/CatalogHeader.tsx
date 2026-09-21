"use client";

import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCatalogNav } from "./hooks/useCatalogNav";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export type TitlePart = {
  text: string;
  italic?: boolean;
};

interface Props {
  title: TitlePart[];
  totalProducts: number;
  breadcrumbs: { label: string; href: string }[];
}

export default function CatalogHeader({ title, totalProducts, breadcrumbs }: Props) {
  const { updateFilter, searchParams } = useCatalogNav();
  const currentSort = searchParams.get("sort") || "recientes";

  // Procesamos los breadcrumbs para el componente genérico de UI
  const breadcrumbItems = breadcrumbs.slice(0, -1);
  const currentBreadcrumb = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1] : undefined;

  return (
    <div className="flex w-full flex-col gap-4 border-b border-border-primary/80 pb-4 pt-1 select-none px-2">

      {/* Componente de Breadcrumbs Unificado */}
      {breadcrumbs.length > 0 && (
        <div className="">
          <Breadcrumbs
            items={breadcrumbItems}
            current={currentBreadcrumb?.label}
            currentHref={currentBreadcrumb?.href}
          />
        </div>
      )}

      {/* Header Title & Sorting */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-2xl font-semibold  text-text-secondary md:text-3xl capitalize">
            {title.map((part, i) => (
              <span
                key={i}
                className={part.italic ? "font-normal italic text-text-secondary lowercase " : ""}
              >
                {part.text}{" "}
              </span>
            ))}
          </h1>

          <span className="rounded-radius-sm bg-surface-secondary px-2 py-0.5 text-[10px] font-semibold  text-text-secondary">
            {totalProducts} Items
          </span>
        </div>

        {/* Sorting Desktop */}
        <div className="hidden items-center md:flex">
          <div className="relative flex items-center">
            <ArrowUpDown className="pointer-events-none absolute left-3 z-10 size-3.5 text-text-tertiary" />
            <Select
              value={currentSort}
              onValueChange={(val) => updateFilter("sort", val)}
            >
              <SelectTrigger className="h-9 w-[200px] rounded-radius-md border-border-primary/80 bg-surface-primary pl-8 pr-3 text-xs font-medium text-text-primary transition-colors duration-fast hover:border-border-strong hover:bg-surface-secondary">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>

              <SelectContent align="end" className="border-border-primary shadow-lg">
                <SelectItem value="relevancia" className="cursor-pointer text-xs focus:bg-surface-secondary">Relevancia</SelectItem>
                <SelectItem value="recientes" className="cursor-pointer text-xs focus:bg-surface-secondary">Más Recientes</SelectItem>
                <SelectItem value="discount" className="cursor-pointer text-xs focus:bg-surface-secondary">Mayor Descuento</SelectItem>
                <SelectItem value="price-asc" className="cursor-pointer text-xs focus:bg-surface-secondary">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="price-desc" className="cursor-pointer text-xs focus:bg-surface-secondary">Precio: Mayor a Menor</SelectItem>
                <SelectItem value="name-asc" className="cursor-pointer text-xs focus:bg-surface-secondary">Nombre: A - Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}