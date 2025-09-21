"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useDebouncedCallback } from "use-debounce";
import type { TBrand } from "@/src/schemas/brands";
import Image from "next/image";
import type { CategoryListResponse } from "@/src/schemas";


export default function FiltersSidebar(
    { brand, categorias }: { brand: TBrand; categorias: CategoryListResponse }
) {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Filtros iniciales desde URL
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
    // Agrega más filtros aquí si quieres: color, brand, stock...

    // Función para actualizar la URL
    const updateURL = () => {
        const params = new URLSearchParams();

        if (category) params.set('category', category);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);

        router.push(`?${params.toString()}`);
    };

    // Debounced version para inputs de precio
    const debouncedUpdateURL = useDebouncedCallback(updateURL, 300);

    // Handlers
    const handleCategoryChange = (value: string) => {
        setCategory(value === category ? '' : value); // Toggle
        updateURL();

    };
    const handleMinPriceChange = (value: string) => {
        setMinPrice(value);
        debouncedUpdateURL();
    };
    const handleMaxPriceChange = (value: string) => {
        setMaxPrice(value);
        debouncedUpdateURL();
    };

    // Si quieres, puedes sincronizar los filtros cuando cambie la URL externa
    useEffect(() => {
        setCategory(searchParams.get('category') || '');
        setMinPrice(searchParams.get('minPrice') || '');
        setMaxPrice(searchParams.get('maxPrice') || '');
    }, [searchParams]);

    return (
        <div className="w-64 p-4 rounded space-y-6">
            <h2 className="text-md font-bold mb-2">Filtros de {brand.nombre}</h2>
            <div className="flex items-center justify-center gap-3 ">
                <Image
                    src={brand.logo || '/minilogo.svg'}
                    alt={brand.nombre}
                    width={50}
                    height={50}
                    className="object-contain max-h-12"
                />
            </div>

            <Accordion type="single" collapsible className="w-full space-y-3">
                {/* Categoría */}
                <AccordionItem value="category">
                    <AccordionTrigger>Categoría</AccordionTrigger>
                    <AccordionContent>
                        {categorias.map((cat) => (
                            <div key={cat._id} className="flex items-center mt-2">
                                <input
                                    type="checkbox"
                                    id={`category-${cat._id}`}
                                    value={cat._id}
                                    checked={category === cat.slug}
                                    onChange={() => handleCategoryChange(cat.slug ?? '')}
                                    className="mr-2"
                                />
                                <label htmlFor={`category-${cat._id}`} className="text-sm">{cat.nombre}</label>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>

                {/* Precio */}
                <AccordionItem value="price">
                    <AccordionTrigger>Precio</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex gap-2 mt-2">
                            <input
                                type="number"
                                placeholder="Mín"
                                value={minPrice}
                                onChange={(e) => handleMinPriceChange(e.target.value)}
                                className="w-full border rounded p-1"
                            />
                            <input
                                type="number"
                                placeholder="Máx"

                                value={maxPrice}
                                onChange={(e) => handleMaxPriceChange(e.target.value)}
                                className="w-full border rounded p-1"
                            />
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Más filtros dinámicos se pueden agregar igual */}
            </Accordion>
        </div>
    );
}