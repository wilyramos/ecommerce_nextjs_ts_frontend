"use client";

import { useState, useEffect } from "react";
import type { CategoriasList } from "@/src/schemas";

type Props = {
  categorias: CategoriasList;
  initialCategoryId?: string;
};

export default function ClientCategoryAttributes({ categorias, initialCategoryId }: Props) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId || "");
  const [categoryAttributes, setCategoryAttributes] = useState<{ name: string; values: string[] }[]>([]);

console.log(initialCategoryId);
console.log(categorias)

  useEffect(() => {
    const selected = categorias.find(cat => cat._id === selectedCategoryId);

    // Debug rápido
    if (!selected) {
      console.warn("Categoría no encontrada:", selectedCategoryId);
    } else if (!selected.attributes) {
      console.warn("Categoría sin atributos:", selected.nombre);
    }

    setCategoryAttributes(selected?.attributes || []);
  }, [selectedCategoryId, categorias]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategoryId(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="py-1">
        <label htmlFor="categoria" className="block font-semibold text-gray-700">Categoría</label>
        <select
          id="categoria"
          name="categoria"
          className="w-full border border-gray-300 rounded-lg p-3"
          value={selectedCategoryId}
          onChange={handleCategoryChange}
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </div>

      {categoryAttributes.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Atributos de la categoría</h4>
          {categoryAttributes.map(attr => (
            <div key={attr.name} className="py-1">
              <label className="block text-sm text-gray-700">{attr.name}</label>
              <select
                name={`attribute_${attr.name}`}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="">Selecciona {attr.name.toLowerCase()}</option>
                {attr.values.map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
