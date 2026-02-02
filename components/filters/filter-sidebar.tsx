"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react"; // Icono para limpiar

// Importamos tus tipos inferidos
import type { FilterResponse } from "@/src/schemas/filters";

interface FilterSidebarProps {
  filters: FilterResponse;
}

export default function FilterSidebar({ filters }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ===========================================================================
  // 1. SAFE GUARDS & VALORES POR DEFECTO
  // ===========================================================================
  // Evitamos errores si el backend devuelve undefined o arrays vacíos
  const categories = filters.categories || [];
  const brands = filters.brands || [];
  const atributos = filters.atributos || [];
  const prices = filters.price || [];

  // Sanitización específica para el Slider (convertir null a 0)
  // Zod dice: number | null. El Slider exige: number.
  const backendMin = prices.length > 0 ? (prices[0].min ?? 0) : 0;
  const backendMax = prices.length > 0 ? (prices[0].max ?? 0) : 0;

  // Solo mostramos slider si hay una diferencia real de precios
  const showSlider = backendMax > backendMin;

  // ===========================================================================
  // 2. ESTADO LOCAL (Solo para el Slider)
  // ===========================================================================
  const [priceRange, setPriceRange] = useState([backendMin, backendMax]);

  // Sincronizar el Slider con la URL o los defaults del backend
  useEffect(() => {
    const urlPrice = searchParams.get("priceRange");
    if (urlPrice) {
      const [min, max] = urlPrice.split("-").map(Number);
      setPriceRange([min, max]);
    } else {
      setPriceRange([backendMin, backendMax]);
    }
  }, [searchParams, backendMin, backendMax]);

  // ===========================================================================
  // 3. LÓGICA DE ACTUALIZACIÓN DE URL
  // ===========================================================================

  // Para Checkboxes (Categorías, Marcas, Atributos)
  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentValues = params.getAll(key);

    if (currentValues.includes(value)) {
      params.delete(key);
      currentValues.filter((v) => v !== value).forEach((v) => params.append(key, v));
    } else {
      params.append(key, value);
    }

    params.set("page", "1"); // Resetear paginación
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Para el Slider (Solo al soltar el mouse - onValueCommit)
  const handlePriceCommit = (value: number[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("priceRange", `${value[0]}-${value[1]}`);
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Limpiar todo
  const clearAllFilters = () => {
    // Mantener solo la query de búsqueda si quisieras, o limpiar todo radicalmente
    const params = new URLSearchParams();
    if (searchParams.get("q")) params.set("q", searchParams.get("q")!);
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  // Helper visual para checkboxes
  const isChecked = (key: string, value: string) => {
    return searchParams.getAll(key).includes(value);
  };

  // Si no hay ningún filtro disponible, no renderizamos nada
  if (!categories.length && !brands.length && !atributos.length && !showSlider) {
    return null;
  }

  return (
    <div className="w-full space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold tracking-tight">Filtros</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="h-8 px-2 text-xs text-muted-foreground hover:text-primary"
        >
          <X className="mr-1 h-3 w-3" />
          Limpiar
        </Button>
      </div>


      <Accordion
        type="multiple"
        // defaultValue={["categories", "price", "brands", ...atributos.map(a => a.name)]}
        className="w-full"
      >

        {/* 1. CATEGORÍAS */}
        {categories.length > 0 && (
          <AccordionItem value="categories">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">
              Categorías
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-1">
                {categories.map((cat) => (
                  <div key={cat.slug} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cat-${cat.slug}`}
                      checked={isChecked("category", cat.slug)}
                      onCheckedChange={() => handleFilterChange("category", cat.slug)}
                    />
                    <Label
                      htmlFor={`cat-${cat.slug}`}
                      className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {cat.nombre}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* 2. RANGO DE PRECIOS */}
        {showSlider && (
          <AccordionItem value="price">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">
              Precio
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-1 pt-4 pb-2">
                <Slider
                  defaultValue={[backendMin, backendMax]}
                  min={backendMin}
                  max={backendMax}
                  step={10} // Puedes ajustar el paso
                  minStepsBetweenThumbs={1}
                  value={priceRange}
                  onValueChange={setPriceRange} // Actualiza visualmente suave
                  onValueCommit={handlePriceCommit} // Dispara el fetch al soltar
                  className="mb-4"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                  <span>S/ {priceRange[0]}</span>
                  <span>S/ {priceRange[1]}</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* 3. MARCAS */}
        {brands.length > 0 && (
          <AccordionItem value="brands">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">
              Marcas
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-1">
                {brands.map((brand) => (
                  <div key={brand.slug} className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${brand.slug}`}
                      checked={isChecked("brand", brand.slug)}
                      onCheckedChange={() => handleFilterChange("brand", brand.slug)}
                    />
                    <Label htmlFor={`brand-${brand.slug}`} className="text-sm font-normal cursor-pointer">
                      {brand.nombre}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* 4. ATRIBUTOS DINÁMICOS (Color, Talla, Material, etc.) */}
        {atributos.map((attr) => (
          <AccordionItem key={attr.name} value={attr.name}>
            <AccordionTrigger className="text-sm font-medium capitalize hover:no-underline">
              {attr.name}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-1">
                {attr.values.map((val) => (
                  <div key={val} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${attr.name}-${val}`}
                      // Enviamos 'attr.name' como key (ej: "Color")
                      checked={isChecked(attr.name, val)}
                      onCheckedChange={() => handleFilterChange(attr.name, val)}
                    />
                    <Label htmlFor={`${attr.name}-${val}`} className="text-sm font-normal cursor-pointer">
                      {val}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}

      </Accordion>
    </div>
  );
}