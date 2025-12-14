"use client";

import { useState, useEffect, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import type { CategoryListResponse } from "@/src/schemas";

type Props = {
    categorias: CategoryListResponse;
    initialCategoryId?: string;
    currentAttributes?: Record<string, string>; // Atributos guardados en DB
    onCategoryChange?: (categoryId: string) => void;
};

export default function ClientCategoryAttributes({
    categorias,
    initialCategoryId,
    currentAttributes, // Datos originales del producto (DB)
    onCategoryChange,
}: Props) {
    const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId || "");

    // Lista de DEFINICIONES de atributos (qué inputs mostrar)
    const [categoryDefinitions, setCategoryDefinitions] = useState<{ name: string; values: string[] }[]>([]);

    // Estado de VALORES seleccionados. 
    // Truco: Inicializamos con lo que viene de la DB y NUNCA lo borramos automáticamente al cambiar categoría.
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(currentAttributes || {});

    const handleCategorySelect = (id: string) => {
        setSelectedCategoryId(id);
        if (onCategoryChange) {
            onCategoryChange(id);
        }
    };

    useEffect(() => {
        const selected = categorias.find((cat) => cat._id === selectedCategoryId);

        if (!selected) {
            setCategoryDefinitions([]);
            return;
        }

        const validDefinitions = selected.attributes || [];
        setCategoryDefinitions(validDefinitions);

        // Lógica de Mezcla (Merge):
        // Al cambiar de categoría, aseguramos que si existen datos originales (DB) 
        // para los nuevos campos, se recuperen si el usuario aún no los ha sobrescrito manualmente.
        setSelectedAttributes((prev) => {
            const merged = { ...prev };

            // Si hay atributos originales en la DB, asegurarnos de que estén en el estado 
            // si el usuario no ha definido ya un valor para esa clave.
            if (currentAttributes) {
                validDefinitions.forEach((def) => {
                    // Si el usuario no tiene un valor en memoria (prev), pero la DB sí (current), lo restauramos.
                    // Esto sirve si cambias de categoría A -> B -> A.
                    if (prev[def.name] === undefined && currentAttributes[def.name]) {
                        merged[def.name] = currentAttributes[def.name];
                    }
                });
            }
            return merged;
        });

    }, [selectedCategoryId, categorias, currentAttributes]);

    const handleAttributeChange = (name: string, value: string) => {
        setSelectedAttributes((prev) => {
            const updated = { ...prev };
            if (value === "") delete updated[name];
            else updated[name] = value;
            return updated;
        });
    };

    const selectedCategory = categorias.find((c) => c._id === selectedCategoryId);

    return (
        <div className="space-y-4 border-2 rounded-2xl p-4">
            <div className="py-1">
                <label className="block font-semibold text-gray-700 mb-1">
                    Categoría<span className="text-red-500">*</span>
                </label>
                <input type="hidden" name="categoria" value={selectedCategoryId} />
                <Listbox value={selectedCategoryId} onChange={handleCategorySelect}>
                    <div className="relative">
                        <Listbox.Button className="w-full border border-gray-300 rounded-lg p-3 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <span>
                                {selectedCategory ? selectedCategory.nombre : "Selecciona una categoría"}
                            </span>
                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                        </Listbox.Button>
                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white shadow-lg border border-gray-200 z-50">
                                <Listbox.Option key="none" value="" className={({ active }) => `cursor-pointer select-none relative p-2 ${active ? "bg-blue-100 text-blue-900" : "text-gray-900"}`}>
                                    {({ selected }) => (
                                        <span className={`flex items-center ${selected ? "font-semibold" : "font-normal"}`}>
                                            — Ninguna —
                                            {selected && <CheckIcon className="h-4 w-4 ml-auto text-blue-600" />}
                                        </span>
                                    )}
                                </Listbox.Option>
                                {categorias.map((cat) => (
                                    <Listbox.Option key={cat._id} value={cat._id} className={({ active }) => `cursor-pointer select-none relative p-2 ${active ? "bg-blue-100 text-blue-900" : "text-gray-900"}`}>
                                        {({ selected }) => (
                                            <span className={`flex items-center ${selected ? "font-semibold" : "font-normal"}`}>
                                                {cat.nombre}
                                                {selected && <CheckIcon className="h-4 w-4 ml-auto text-blue-600" />}
                                            </span>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </Listbox>
            </div>

            {categoryDefinitions.length > 0 && (
                <div>
                    {/* Enviamos al backend solo los atributos que son válidos para la categoría actual */}
                    <input
                        type="hidden"
                        name="atributos"
                        value={JSON.stringify(
                            Object.fromEntries(
                                Object.entries(selectedAttributes).filter(([key]) =>
                                    categoryDefinitions.some(def => def.name === key)
                                )
                            )
                        )}
                    />

                    <h4 className="font-semibold text-gray-700 mb-2">Atributos de la categoría:</h4>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-8">
                        {categoryDefinitions.map((attr) => (
                            <div key={attr.name} className="space-y-1">
                                <label className="block font-medium text-gray-600">{attr.name}</label>
                                <Listbox
                                    // Aquí ocurre la magia: si 'Color' ya estaba seleccionado en otra categoría, se muestra aquí.
                                    value={selectedAttributes[attr.name] || ""}
                                    onChange={(val) => handleAttributeChange(attr.name, val)}
                                >
                                    <div className="relative">
                                        <Listbox.Button className="w-full border border-gray-300 rounded-lg p-2 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <span>{selectedAttributes[attr.name] || "Selecciona un valor"}</span>
                                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                                        </Listbox.Button>
                                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white shadow-lg border border-gray-200 z-50">
                                                <Listbox.Option key="none" value="" className={({ active }) => `cursor-pointer select-none relative p-2 ${active ? "bg-blue-100 text-blue-900" : "text-gray-900"}`}>
                                                    <span className="font-normal">— Ninguno —</span>
                                                </Listbox.Option>
                                                {attr.values.map((val) => (
                                                    <Listbox.Option key={val} value={val} className={({ active }) => `cursor-pointer select-none relative p-2 ${active ? "bg-blue-100 text-blue-900" : "text-gray-900"}`}>
                                                        {({ selected }) => (
                                                            <span className={`flex items-center ${selected ? "font-semibold" : "font-normal"}`}>
                                                                {val}
                                                                {selected && <CheckIcon className="h-4 w-4 ml-auto text-blue-600" />}
                                                            </span>
                                                        )}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </Listbox>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}