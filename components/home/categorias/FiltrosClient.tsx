"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Props = {
    categorySlug: string;
    // brands?: string[]; // TODO: Descomentar cuando se implemente el servicio
    // priceRange?: string; // TODO: Descomentar si se implementa el rango de precios
    // page?: string; // TODO: Descomentar si se implementa la paginación
};

export default function FiltrosClient({ categorySlug }: Props) {

    const router = useRouter();
    const searchParams = useSearchParams();


    const [selectedFilters, setSelectedFilters] = useState({
        // brands: searchParams.get("brands") || "",
        // priceRange: searchParams.get("priceRange") || "",
        // page: searchParams.get("page") || "1",
    });




    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Filtros</h3>

        </div>

    )
}
