"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { TFilter } from "@/src/schemas";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

type ProductsFiltersProps = {
    filters: TFilter[] | null;
};

export default function ProductsFiltersMain({ filters }: ProductsFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // función para actualizar query params en la url
    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        // toggle: si ya está lo quitamos, si no lo añadimos
        if (params.getAll(key).includes(value)) {
            const newValues = params.getAll(key).filter((v) => v !== value);
            params.delete(key);
            newValues.forEach((v) => params.append(key, v));
        } else {
            params.append(key, value);
        }

        router.push(`/productos?${params.toString()}`);
    };

    if (!filters || filters.length === 0) return null;

    const { brands = [], atributos = [] } = filters[0]; // backend lo manda en array

    return (
        <aside className="w-full p-2 border border-gray-100 shadow-xs rounded-md bg-white">
            <h2 className="text-lg font-semibold mb-3">Filtros</h2>

            <Accordion type="multiple" className="w-full">
                {/* Brands */}
                {brands.length > 0 && (
                    <AccordionItem value="brands">
                        <AccordionTrigger>Marcas</AccordionTrigger>
                        <AccordionContent>
                            <ul className="space-y-1">
                                {brands.map((brand) => (
                                    <li key={brand.slug}>
                                        <label className="flex items-center gap-2 cursor-pointer text-sm">
                                            <input
                                                type="checkbox"
                                                checked={searchParams.getAll("brand").includes(brand.slug)}
                                                onChange={() => handleFilterChange("brand", brand.slug)}
                                            />
                                            {brand.nombre}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* Atributos dinámicos */}
                {atributos.map((attr) => (
                    <AccordionItem key={attr.name} value={attr.name}>
                        <AccordionTrigger className="capitalize">{attr.name}</AccordionTrigger>
                        <AccordionContent>
                            <ul className="space-y-1">
                                {attr.values.map((value) => (
                                    <li key={value}>
                                        <label className="flex items-center gap-2 cursor-pointer text-sm">
                                            <input
                                                type="checkbox"
                                                checked={searchParams.getAll(attr.name).includes(value)}
                                                onChange={() => handleFilterChange(attr.name, value)}
                                            />
                                            {value}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </aside>
    );
}
