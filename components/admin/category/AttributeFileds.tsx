"use client";

import { useState } from "react";
import type { Attribute } from "@/src/schemas";

export default function AttributeFields({ defaultAttributes = [] }: { defaultAttributes?: Attribute[] }) {
  const [attributes, setAttributes] = useState<Attribute[]>(defaultAttributes);

  const handleChange = (index: number, field: keyof Attribute, value: string) => {
    const updated = [...attributes];
    updated[index][field] = value as any;
    setAttributes(updated);
  };

  const addAttribute = () => {
    setAttributes([...attributes, { nombre: "", tipo: "string" }]);
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-medium text-gray-700">Atributos</legend>

      {attributes.map((attr, index) => (
        <div key={index} className="grid grid-cols-3 gap-2 items-center">
          <input
            type="text"
            name={`atributos[${index}][nombre]`}
            placeholder="Nombre"
            value={attr.nombre}
            onChange={(e) => handleChange(index, "nombre", e.target.value)}
            className="border p-2 rounded"
          />

          <select
            name={`atributos[${index}][tipo]`}
            value={attr.tipo}
            onChange={(e) => handleChange(index, "tipo", e.target.value)}
            className="border p-2 rounded"
          >
            <option value="string">Texto</option>
            <option value="number">Número</option>
            <option value="boolean">Sí/No</option>
            <option value="select">Select</option>
          </select>

          {attr.tipo === "select" && (
            <input
              type="text"
              name={`atributos[${index}][opciones]`}
              placeholder="opción1, opción2"
              value={attr.opciones || ""}
              onChange={(e) => handleChange(index, "opciones", e.target.value)}
              className="border p-2 rounded"
            />
          )}

          <button
            type="button"
            onClick={() => removeAttribute(index)}
            className="text-red-600 hover:underline text-sm col-span-3 text-left"
          >
            Quitar atributo
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addAttribute}
        className="text-blue-600 hover:underline text-sm"
      >
        + Añadir atributo
      </button>

      <p className="text-xs text-gray-500">
        Si el tipo es "select", separa las opciones con comas.
      </p>
    </fieldset>
  );
}
