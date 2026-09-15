// File: frontend/components/collections/CatalogMobileSort.tsx
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

export default function CatalogMobileSort() {
  const { updateFilter, searchParams } = useCatalogNav();
  const currentSort = searchParams.get("sort") || "recientes";

  return (
    <div className="relative flex items-center lg:hidden">
      <ArrowUpDown className="pointer-events-none absolute left-3 z-10 size-3.5 text-text-secondary" />

      <Select
        value={currentSort}
        onValueChange={(val) => updateFilter("sort", val)}
      >
        <SelectTrigger className="h-[34px] w-[160] rounded-md border border-border-primary/80 bg-surface-primary pl-8 pr-3 text-xs font-medium text-text-primary shadow-sm focus:ring-1 focus:ring-brand-accent focus:ring-offset-0">
          <SelectValue placeholder="Ordenar" />
        </SelectTrigger>

        <SelectContent align="end" className="rounded-md border-border-primary/80 bg-surface-primary shadow-md">
          <SelectItem value="relevancia" className="text-xs cursor-pointer focus:bg-surface-secondary focus:text-text-primary">
            Relevancia
          </SelectItem>
          <SelectItem value="recientes" className="text-xs cursor-pointer focus:bg-surface-secondary focus:text-text-primary">
            Más Recientes
          </SelectItem>
          <SelectItem value="rating" className="text-xs cursor-pointer focus:bg-surface-secondary focus:text-text-primary">
            Mejor Valorados
          </SelectItem>
          <SelectItem value="discount" className="text-xs cursor-pointer focus:bg-surface-secondary focus:text-text-primary">
            Mayor Descuento
          </SelectItem>
          <SelectItem value="price-asc" className="text-xs cursor-pointer focus:bg-surface-secondary focus:text-text-primary">
            Menor Precio
          </SelectItem>
          <SelectItem value="price-desc" className="text-xs cursor-pointer focus:bg-surface-secondary focus:text-text-primary">
            Mayor Precio
          </SelectItem>
          <SelectItem value="name-asc" className="text-xs cursor-pointer focus:bg-surface-secondary focus:text-text-primary">
            Nombre: A - Z
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}