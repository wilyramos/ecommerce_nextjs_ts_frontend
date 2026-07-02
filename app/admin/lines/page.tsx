import { Suspense } from "react";
import { LinesClient } from "./components/lines-client";
import { linesService } from "@/src/services/lines.service";
import { getBrands } from "@/src/services/brands";
import { getAllSubcategories } from "@/src/services/categorys";

// 1. Componente asíncrono secundario que maneja la carga con cookies
async function LinesDataWrapper() {
    const [linesData, brandsData, categoriesData] = await Promise.all([
        linesService.getAll().catch((err) => {
            console.error("Error fetching lines:", err);
            return [];
        }),
        getBrands().catch((err) => {
            console.error("Error fetching brands:", err);
            return [];
        }),
        getAllSubcategories().catch((err) => {
            console.error("Error fetching categories:", err);
            return [];
        }),
    ]);

    return (
        <LinesClient
            initialData={linesData}
            brands={brandsData}
            categories={categoriesData}
        />
    );
}

// 2. Componente principal que se exporta y permite el pre-renderizado estático de la estructura básica
export default function LinesPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <Suspense fallback={<LinesSkeleton />}>
                <LinesDataWrapper />
            </Suspense>
        </div>
    );
}

// 3. Fallback visual para mostrar mientras se valida la sesión y se leen las cookies
function LinesSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-neutral-200 rounded w-1/4"></div>
            <div className="h-64 bg-neutral-100 rounded"></div>
        </div>
    );
}