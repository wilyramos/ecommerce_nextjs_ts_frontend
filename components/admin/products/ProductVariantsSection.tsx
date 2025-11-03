"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Variant {
  nombre: string;
  precio?: string;
  precioComparativo?: string;
  stock: string;
  sku?: string;
  barcode?: string;
  atributos: Record<string, string>;
}

export default function ProductVariantsSection() {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [variant, setVariant] = useState<Variant>({
    nombre: "",
    precio: "",
    precioComparativo: "",
    stock: "0",
    sku: "",
    barcode: "",
    atributos: {}
  });

  const [attributeName, setAttributeName] = useState("");
  const [attributeValue, setAttributeValue] = useState("");

  const handleAddAttribute = () => {
    if (!attributeName.trim() || !attributeValue.trim()) return;

    setVariant(prev => ({
      ...prev,
      atributos: {
        ...prev.atributos,
        [attributeName]: attributeValue
      }
    }));

    setAttributeName("");
    setAttributeValue("");
  };

  const handleAddVariant = () => {
    if (!variant.nombre.trim()) return alert("La variante necesita un nombre");

    setVariants(prev => [...prev, variant]);

    setVariant({
      nombre: "",
      precio: "",
      precioComparativo: "",
      stock: "0",
      sku: "",
      barcode: "",
      atributos: {}
    });
  };

  const removeVariant = (i: number) => {
    setVariants(prev => prev.filter((_, index) => index !== i));
  };

  return (
    <div className="mt-6 border rounded-lg p-4 bg-white shadow-sm">
      <h3 className="font-semibold mb-4 text-sm">Variantes del Producto</h3>

      {/* Nombre variante */}
      <div className="mb-4">
        <Label>Nombre variante *</Label>
        <Input
          value={variant.nombre}
          onChange={e => setVariant({ ...variant, nombre: e.target.value })}
          placeholder="Ej: Rojo / iPhone 13"
        />
      </div>

      {/* Precio / stock / sku grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div>
          <Label>Precio</Label>
          <Input
            type="number"
            value={variant.precio}
            onChange={e => setVariant({ ...variant, precio: e.target.value })}
          />
        </div>
        <div>
          <Label>Stock *</Label>
          <Input
            type="number"
            value={variant.stock}
            onChange={e => setVariant({ ...variant, stock: e.target.value })}
          />
        </div>
        <div>
          <Label>SKU</Label>
          <Input
            value={variant.sku}
            onChange={e => setVariant({ ...variant, sku: e.target.value })}
          />
        </div>
      </div>

      {/* Añadir atributos dinámicos */}
      <div className="border p-3 rounded mb-4 bg-gray-50">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <Input
            placeholder="Nombre atributo (Color, Modelo...)"
            value={attributeName}
            onChange={e => setAttributeName(e.target.value)}
          />
          <Input
            placeholder="Valor (Rojo, iPhone 13...)"
            value={attributeValue}
            onChange={e => setAttributeValue(e.target.value)}
          />
        </div>

        <Button type="button" size="sm" onClick={handleAddAttribute}>
          + Añadir atributo
        </Button>

        {Object.keys(variant.atributos).length > 0 && (
          <div className="text-xs mt-2 bg-white p-2 rounded border">
            {Object.entries(variant.atributos).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {value}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botón agregar variante */}
      <Button type="button" onClick={handleAddVariant}>
        ➕ Añadir variante
      </Button>

      {/* Campo hidden para enviar al server */}
      <input type="hidden" name="variantes" value={JSON.stringify(variants)} />

      {/* Tabla de variantes */}
      {variants.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2 text-xs text-gray-600">Variantes agregadas</h4>

          <div className="border rounded overflow-hidden text-xs">
            <table className="w-full bg-white">
              <thead className="bg-gray-100 text-[11px] uppercase">
                <tr>
                  <th className="p-2 text-left">Nombre</th>
                  <th className="p-2 text-left">Stock</th>
                  <th className="p-2 text-left">SKU</th>
                  <th className="p-2 text-left">Atributos</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {variants.map((v, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{v.nombre}</td>
                    <td className="p-2">{v.stock}</td>
                    <td className="p-2">{v.sku || "-"}</td>
                    <td className="p-2">
                      {Object.entries(v.atributos).map(([k, val]) => (
                        <div key={k}>
                          <strong>{k}:</strong> {val}
                        </div>
                      ))}
                    </td>
                    <td className="p-2 text-right">
                      <button onClick={() => removeVariant(i)} className="text-red-500 hover:text-red-700">
                        <X size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  );
}
