"use client";

import { useCatalogNav } from "./hooks/useCatalogNav";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { H4 } from "@/components/ui/TypographyV3";

export default function ActiveFiltersSidebar() {
  const { currentSlugs, searchParams, updateFilter, clearPriceRange, hasFilters } = useCatalogNav();
  const router = useRouter();

  const hasSlugs = currentSlugs.length > 0;
  const visible = hasSlugs || hasFilters;

  if (!visible) return null;

  const removeSlug = (slugToRemove: string) => {
    const remainingSlugs = currentSlugs.filter((s) => s !== slugToRemove);
    const newPath = remainingSlugs.length > 0 ? `/catalogo/${remainingSlugs.join("/")}` : "/catalogo";
    const query = searchParams.toString();
    router.push(query ? `${newPath}?${query}` : newPath);
  };

  const getLabelForParam = (key: string, value: string): string => {
    if (key === "priceMin" || key === "priceMax") return "";
    if (key === "query") return `"${value}"`;
    const keyLabel = key.charAt(0).toUpperCase() + key.slice(1);
    return `${keyLabel}: ${value}`;
  };

  const priceMin = searchParams.get("priceMin");
  const priceMax = searchParams.get("priceMax");
  const hasPriceFilter = priceMin !== null || priceMax !== null;

  const fmt = (n: string) =>
    new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", maximumFractionDigits: 0 }).format(
      Number(n)
    );

  const HIDDEN_KEYS = new Set(["page", "limit", "sort", "priceMin", "priceMax"]);
  const queryChips = [];

  for (const [key, value] of searchParams.entries()) {
    if (HIDDEN_KEYS.has(key)) continue;
    const label = getLabelForParam(key, value);
    if (label) queryChips.push({ key, value, label });
  }

  return (
    <div className="mb-6 select-none animate-in fade-in duration-200">
      <div className="mb-3 flex items-center justify-between pb-1">
        <H4 className="text-[12px] font-semibold text-text-tertiary">
          Filtros Activos
        </H4>
        <button
          onClick={() => router.push("/catalogo")}
          className="text-[12px] font-medium text-brand-accent outline-none transition-opacity duration-fast hover:opacity-70 active:scale-95"
        >
          Limpiar
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {currentSlugs.map((slug) => (
          <Chip key={slug} label={slug.replace(/-/g, " ")} onRemove={() => removeSlug(slug)} />
        ))}
        {hasPriceFilter && (
          <Chip
            label={`${priceMin ? fmt(priceMin) : "–"} a ${priceMax ? fmt(priceMax) : "–"}`}
            onRemove={clearPriceRange}
          />
        )}
        {queryChips.map(({ key, value, label }) => (
          <Chip key={`${key}-${value}`} label={label} onRemove={() => updateFilter(key, value)} />
        ))}
      </div>
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      onClick={onRemove}
      className={cn(
        "group inline-flex cursor-pointer items-center gap-1.5 rounded-radius-full bg-surface-secondary px-3 py-1.5 outline-none transition-all duration-fast",
        "hover:bg-surface-tertiary active:scale-95"
      )}
    >
      <span className="max-w-[150px] truncate text-[12px] font-medium text-text-primary capitalize">
        {label}
      </span>
      <X className="size-3.5 shrink-0 text-text-secondary transition-colors duration-fast group-hover:text-text-primary" />
    </button>
  );
}