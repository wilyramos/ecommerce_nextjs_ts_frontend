import { useState, useEffect } from 'react';
import type { Variant } from "@/src/schemas"; // Asegúrate de que estos tipos estén exportados desde tu archivo de schemas
import { FaTrash } from 'react-icons/fa';

const predefinedOptionsNames = [
    'Talla',
    'Color',
    'Material',
    'Estilo',
    'Sabor',
    'Capacidad',
    'Peso',
    'Dimensiones',
    "Compatibilidad",
];

interface ProductVariantsFormProps {
    initialVariants?: Variant[];
    onVariantsChange: (variants: Variant[]) => void;
}

export default function ProductVariantsForm({ initialVariants, onVariantsChange }: ProductVariantsFormProps) {
    const [variants, setVariants] = useState<Variant[]>(initialVariants || []);

    useEffect(() => {
        onVariantsChange(variants);
    }, [variants, onVariantsChange]);

    const addVariant = () => {
        setVariants([...variants, { opciones: [{ nombre: '', valores: [''] }], stock: 0, barcode: '' }]);
    };

    const removeVariant = (indexToRemove: number) => {
        setVariants(variants.filter((_, index) => index !== indexToRemove));
    };

    const handleVariantOptionNameChange = (variantIndex: number, optionIndex: number, value: string) => {
        const newVariants = [...variants];
        newVariants[variantIndex].opciones[optionIndex].nombre = value;
        setVariants(newVariants);
    };

    // **MODIFICADO**: Maneja un solo valor de input a la vez
    const handleVariantOptionValueChange = (variantIndex: number, optionIndex: number, valueIndex: number, value: string) => {
        const newVariants = [...variants];
        newVariants[variantIndex].opciones[optionIndex].valores[valueIndex] = value;
        setVariants(newVariants);
    };

    const handleVariantStockChange = (variantIndex: number, value: string) => {
        const newVariants = [...variants];
        newVariants[variantIndex].stock = parseInt(value) || 0;
        setVariants(newVariants);
    };

    const handleVariantBarcodeChange = (variantIndex: number, value: string) => {
        const newVariants = [...variants];
        newVariants[variantIndex].barcode = value;
        setVariants(newVariants);
    };

    const addVariantOption = (variantIndex: number) => {
        const newVariants = [...variants];
        newVariants[variantIndex].opciones.push({ nombre: '', valores: [''] }); // Inicializa con un valor vacío
        setVariants(newVariants);
    };

    const removeVariantOption = (variantIndex: number, optionIndexToRemove: number) => {
        const newVariants = [...variants];
        newVariants[variantIndex].opciones = newVariants[variantIndex].opciones.filter((_, index) => index !== optionIndexToRemove);
        // Asegúrate de que al menos una opción quede si es necesario, o maneja el caso de opciones vacías
        if (newVariants[variantIndex].opciones.length === 0) {
            newVariants[variantIndex].opciones.push({ nombre: '', valores: [''] });
        }
        setVariants(newVariants);
    };

    // **NUEVA FUNCIÓN**: Para añadir un valor a una opción específica
    const addValueToOption = (variantIndex: number, optionIndex: number) => {
        const newVariants = [...variants];
        newVariants[variantIndex].opciones[optionIndex].valores.push(''); // Añade un input de valor vacío
        setVariants(newVariants);
    };

    // **NUEVA FUNCIÓN**: Para eliminar un valor de una opción específica
    const removeValueFromOption = (variantIndex: number, optionIndex: number, valueIndexToRemove: number) => {
        const newVariants = [...variants];
        newVariants[variantIndex].opciones[optionIndex].valores = newVariants[variantIndex].opciones[optionIndex].valores.filter((_, index) => index !== valueIndexToRemove);
        // Si no quedan valores, añade uno vacío para que siempre haya un input
        if (newVariants[variantIndex].opciones[optionIndex].valores.length === 0) {
            newVariants[variantIndex].opciones[optionIndex].valores.push('');
        }
        setVariants(newVariants);
    };


    return (
        <div className="mt-6 border p-4 rounded-lg bg-gray-50">
            <h3 className="text-sm font-bold text-gray-800 mb-4">Variantes del Producto</h3>
            {variants.map((variant, variantIndex) => (
                <div key={variantIndex} className="border border-gray-200 p-3 mb-4 rounded-lg bg-white shadow-sm">
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => removeVariant(variantIndex)}
                            className="text-red-600 hover:text-red-800 text-sm font-semibold"
                        >
                            Eliminar Variante
                        </button>
                    </div>

                    {variant.opciones.map((option, optionIndex) => (
                        <div key={`${variantIndex}-${optionIndex}`} className="mb-3 p-2 border border-gray-100 rounded-md bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">Nombre de Opción</label>
                                    <select
                                        className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                                        value={option.nombre}
                                        onChange={(e) => handleVariantOptionNameChange(variantIndex, optionIndex, e.target.value)}
                                    >
                                        <option value="">Selecciona una opción</option>
                                        {predefinedOptionsNames.map((name) => (
                                            <option key={name} value={name}>
                                                {name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex justify-end items-start pt-6">
                                    <button
                                        type="button"
                                        onClick={() => removeVariantOption(variantIndex, optionIndex)}
                                        className="text-red-500 hover:text-red-700 text-xs font-semibold"
                                    >
                                        Eliminar esta Opción
                                    </button>
                                </div>
                            </div>

                            <div className="mt-3">
                     

                                <label className="block text-xs font-medium text-gray-700">Valores para {option.nombre || 'esta opción'}</label>
                                <div className="space-y-2 mt-1">
                                    {option.valores.map((value, valueIndex) => (
                                        <div key={valueIndex} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                className="flex-grow border border-gray-300 rounded-lg p-2 text-xs"
                                                value={value}
                                                onChange={(e) => handleVariantOptionValueChange(variantIndex, optionIndex, valueIndex, e.target.value)}
                                                placeholder={`Valor ${valueIndex + 1}`}
                                            />
                                            {option.valores.length > 1 && ( // Permite eliminar si hay más de un valor
                                                <button
                                                    type="button"
                                                    onClick={() => removeValueFromOption(variantIndex, optionIndex, valueIndex)}
                                                    className="p-1 text-red-500 hover:text-red-700 text-sm"
                                                >
                                                   <FaTrash />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => addValueToOption(variantIndex, optionIndex)}
                                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs font-semibold"
                                >
                                    Añadir Valor
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addVariantOption(variantIndex)}
                        className="mt-2 mb-4 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-xs font-semibold"
                    >
                        Añadir Otra Opción (Ej. Material)
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700">Stock de Variante</label>
                            <input
                                type="number"
                                className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                                value={variant.stock}
                                onChange={(e) => handleVariantStockChange(variantIndex, e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">Código de Barras (opcional)</label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                                value={variant.barcode || ''}
                                onChange={(e) => handleVariantBarcodeChange(variantIndex, e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={addVariant}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-semibold"
            >
                Añadir Nueva Variante (Ej. S/Rojo)
            </button>
        </div>
    );
}