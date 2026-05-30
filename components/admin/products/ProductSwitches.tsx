"use client"

import Switch from "react-switch"
import { useState, useEffect, useMemo, useRef } from "react"
import type { ProductWithCategoryResponse } from "@/src/schemas"
import type { Collection } from "@/src/schemas/collection.schema"

const SYSTEM_SLUGS = {
    FEATURED: "featured",
    NEW_ARRIVALS: "new-arrivals",
    BEST_SELLERS: "best-sellers",
    ON_SALE: "on-sale"
} as const;

type SystemSlug = typeof SYSTEM_SLUGS[keyof typeof SYSTEM_SLUGS];

export default function ProductSwitches({
    product,
    allCollections
}: {
    product?: ProductWithCategoryResponse;
    allCollections: Collection[]
}) {
    const [isActive, setIsActive] = useState(product?.isActive ?? true);
    const inputRef = useRef<HTMLInputElement>(null);

    // 1. Extraer los IDs asignados actualmente a este producto específico
    // 1. Extraer los IDs asignados actualmente a este producto específico
    const currentCollectionIds = useMemo<string[]>(() => {
        if (!product?.collections || !Array.isArray(product.collections)) return [];

        return product.collections.map((c) => {
            // Verificación estructural estricta en tiempo de ejecución compatible con TypeScript
            if (c && typeof c === "object" && "_id" in c) {
                return String((c as { _id: string })._id);
            }
            return String(c);
        });
    }, [product?.collections]);

    // 2. CORREGIDO: Mapear los IDs del sistema usando la lista maestra 'allCollections' inyectada desde el servidor
    const systemIdsMap = useMemo(() => {
        const mapping: Record<SystemSlug, string> = {
            "featured": "",
            "new-arrivals": "",
            "best-sellers": "",
            "on-sale": ""
        };
        if (!allCollections || !Array.isArray(allCollections)) return mapping;

        allCollections.forEach((c) => {
            if (c && "slug" in c && c.slug) {
                const slug = String(c.slug) as SystemSlug;
                if (slug in mapping) {
                    mapping[slug] = String(c._id);
                }
            }
        });
        return mapping;
    }, [allCollections]);

    // Derivar estado inicial directamente desde los mapas ya computados
    const initialState = useMemo(() => ({
        destacado: !!systemIdsMap[SYSTEM_SLUGS.FEATURED] && currentCollectionIds.includes(systemIdsMap[SYSTEM_SLUGS.FEATURED]),
        nuevo: !!systemIdsMap[SYSTEM_SLUGS.NEW_ARRIVALS] && currentCollectionIds.includes(systemIdsMap[SYSTEM_SLUGS.NEW_ARRIVALS]),
        masVendido: !!systemIdsMap[SYSTEM_SLUGS.BEST_SELLERS] && currentCollectionIds.includes(systemIdsMap[SYSTEM_SLUGS.BEST_SELLERS]),
        enOferta: !!systemIdsMap[SYSTEM_SLUGS.ON_SALE] && currentCollectionIds.includes(systemIdsMap[SYSTEM_SLUGS.ON_SALE]),
    }), [systemIdsMap, currentCollectionIds]);

    const [destacado, setDestacado] = useState(initialState.destacado);
    const [nuevo, setNuevo] = useState(initialState.nuevo);
    const [masVendido, setMasVendido] = useState(initialState.masVendido);
    const [enOferta, setEnOferta] = useState(initialState.enOferta);

    // Calcular el valor inicial para defaultValue — se ejecuta en el primer render
    const initialCollections = useMemo(() => {
        const ids: string[] = [];
        if (initialState.destacado && systemIdsMap[SYSTEM_SLUGS.FEATURED])
            ids.push(systemIdsMap[SYSTEM_SLUGS.FEATURED]);
        if (initialState.nuevo && systemIdsMap[SYSTEM_SLUGS.NEW_ARRIVALS])
            ids.push(systemIdsMap[SYSTEM_SLUGS.NEW_ARRIVALS]);
        if (initialState.masVendido && systemIdsMap[SYSTEM_SLUGS.BEST_SELLERS])
            ids.push(systemIdsMap[SYSTEM_SLUGS.BEST_SELLERS]);
        if (initialState.enOferta && systemIdsMap[SYSTEM_SLUGS.ON_SALE])
            ids.push(systemIdsMap[SYSTEM_SLUGS.ON_SALE]);
        return JSON.stringify(ids);
    }, [initialState, systemIdsMap]);

    // Sincronizar el DOM directamente cuando cambia cualquier switch sin provocar re-renders
    useEffect(() => {
        if (!inputRef.current) return;

        const ids: string[] = [];
        if (destacado && systemIdsMap[SYSTEM_SLUGS.FEATURED])
            ids.push(systemIdsMap[SYSTEM_SLUGS.FEATURED]);
        if (nuevo && systemIdsMap[SYSTEM_SLUGS.NEW_ARRIVALS])
            ids.push(systemIdsMap[SYSTEM_SLUGS.NEW_ARRIVALS]);
        if (masVendido && systemIdsMap[SYSTEM_SLUGS.BEST_SELLERS])
            ids.push(systemIdsMap[SYSTEM_SLUGS.BEST_SELLERS]);
        if (enOferta && systemIdsMap[SYSTEM_SLUGS.ON_SALE])
            ids.push(systemIdsMap[SYSTEM_SLUGS.ON_SALE]);

        inputRef.current.value = JSON.stringify(ids);
    }, [destacado, nuevo, masVendido, enOferta, systemIdsMap]);

    const switches = [
        { id: SYSTEM_SLUGS.FEATURED, label: "¿Es un producto destacado?", state: destacado, setter: setDestacado },
        { id: SYSTEM_SLUGS.NEW_ARRIVALS, label: "¿Es un nuevo ingreso?", state: nuevo, setter: setNuevo },
        { id: SYSTEM_SLUGS.BEST_SELLERS, label: "¿Es de los más vendidos?", state: masVendido, setter: setMasVendido },
        { id: SYSTEM_SLUGS.ON_SALE, label: "¿Está en oferta comercial?", state: enOferta, setter: setEnOferta }
    ];

    useEffect(() => {
        console.log("product.collections raw:", product?.collections);
        console.log("allCollections raw:", allCollections);
        console.log("systemIdsMap:", systemIdsMap);
        console.log("currentCollectionIds:", currentCollectionIds);
        console.log("initialState:", initialState);
    }, [product?.collections, allCollections, currentCollectionIds, systemIdsMap, initialState]);

    return (
        <div className="space-y-4 p-2 text-sm font-medium">
            {/* Control Operativo de Estado Base */}
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <label htmlFor="isActive">¿Producto activo en la tienda?</label>
                <Switch
                    id="isActive"
                    onChange={setIsActive}
                    checked={isActive}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    height={20}
                    width={40}
                    handleDiameter={18}
                />
                <input type="hidden" name="isActive" value={isActive ? "true" : "false"} />
            </div>

            {/* Listado dinámico de interruptores */}
            {switches.map(({ id, label, state, setter }) => (
                <div key={id} className="flex items-center justify-between">
                    <label htmlFor={id}>{label}</label>
                    <Switch
                        id={id}
                        onChange={setter}
                        checked={state}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        height={20}
                        width={40}
                        handleDiameter={18}
                    />
                </div>
            ))}

            {/* Inyección nativa limpia al FormData mediante mutación directa del ref */}
            <input
                ref={inputRef}
                type="hidden"
                name="systemCollections"
                defaultValue={initialCollections}
            />
        </div>
    );
}