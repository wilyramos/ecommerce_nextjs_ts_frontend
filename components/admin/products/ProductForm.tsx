"use client";

import { useState } from "react";
import type { ProductWithCategoryResponse } from "@/src/schemas";
import type { CategoryListResponse } from "@/src/schemas";
import type { TBrand } from "@/src/schemas/brands";
import type { ProductLine } from "@/src/schemas/line.schema";

import ClientCategoryAttributes from "./ClientCategoryAttributes";
import ProductSwitches from "./ProductSwitches";
import SpecificationsSection from "./SpecificationsSection";
import ProductDescriptionEditor from "./ProductDescriptionEditor";
import BrandCombobox from "./BrandCombobox";
import ProductVariantsForm from "./ProductVariantsForm";
import MediaLibraryDialog from "./MediaLibraryDialog";

import { Input } from "@/components/ui/input";
import { LabelWithTooltip } from "@/components/utils/LabelWithTooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { X, ImageIcon } from "lucide-react";
import ComplementaryProductsSection from "./ComplementaryProductsSection";

export default function ProductForm({
    product,
    categorias,
    brands,
    lines,
}: {
    product?: ProductWithCategoryResponse;
    categorias: CategoryListResponse;
    brands: TBrand[];
    lines: ProductLine[];
}) {
    // 1. Lógica para obtener IDs iniciales
    const initialBrandId = typeof product?.brand === 'object' ? product?.brand?._id : product?.brand;
    const initialLineId = typeof product?.line === 'object' ? product?.line?._id : product?.line;

    // Estados de Categoría y Marca
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(product?.categoria?._id);
    const [selectedBrandId, setSelectedBrandId] = useState<string | undefined>(initialBrandId);

    // 2. ESTADO MAESTRO DE IMÁGENES (Pool Global)
    // Usamos un Set en la inicialización para asegurar que no haya duplicados desde el inicio
    const [masterImages, setMasterImages] = useState<string[]>(() =>
        Array.from(new Set(product?.imagenes || []))
    );

    // Función para agregar imágenes nuevas al pool global sin duplicados
    const handleAddImagesToPool = (newImages: string[]) => {
        setMasterImages(prev => Array.from(new Set([...prev, ...newImages])));
    };

    // Filtro de líneas según marca
    const filteredLines = lines.filter(line => {
        if (!selectedBrandId) return false;
        const lineBrandId = typeof line.brand === 'object' ? line.brand._id : line.brand;
        return lineBrandId === selectedBrandId;
    });

    const currentCategory = categorias.find((c) => c._id === selectedCategoryId);
    const dynamicCategoryAttributes = currentCategory?.attributes || [];

    return (
        <div className="text-xs grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 space-y-1">
            {/* =================== FORM =================== */}
            <div className="col-span-1 sm:col-span-3 space-y-4">
                {/* Nombre */}
                <div className="space-y-1">
                    <LabelWithTooltip
                        htmlFor="nombre"
                        label="Nombre"
                        required
                        tooltip="Nombre público del producto que verá el cliente."
                    />
                    <Input
                        id="nombre"
                        name="nombre"
                        defaultValue={product?.nombre}
                        required
                    />
                </div>

                {/* Descripción */}
                <div className="space-y-1">
                    <LabelWithTooltip
                        htmlFor="descripcion"
                        label="Descripción"
                        tooltip="Descripción detallada del producto. Aparece en la página del producto."
                    />
                    <ProductDescriptionEditor
                        initialHTML={product?.descripcion || ""}
                    />
                </div>

                {/* Precios y stock */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <LabelWithTooltip
                            htmlFor="precio"
                            label="Precio"
                            tooltip="Precio final de venta al público."
                        />
                        <Input
                            type="number"
                            id="precio"
                            name="precio"
                            defaultValue={product?.precio}
                        />
                    </div>

                    <div className="space-y-1">
                        <LabelWithTooltip
                            htmlFor="costo"
                            label="Costo"
                            tooltip="Costo interno del producto (solo para administración)."
                        />
                        <Input
                            type="number"
                            id="costo"
                            name="costo"
                            defaultValue={product?.costo}
                        />
                    </div>

                    <div className="space-y-1">
                        <LabelWithTooltip
                            htmlFor="precioComparativo"
                            label="Precio comparativo"
                            tooltip="Precio anterior para mostrar descuentos o promociones."
                        />
                        <Input
                            type="number"
                            id="precioComparativo"
                            name="precioComparativo"
                            defaultValue={product?.precioComparativo}
                        />
                    </div>

                    <div className="space-y-1">
                        <LabelWithTooltip
                            htmlFor="stock"
                            label="Stock"
                            tooltip="Cantidad disponible del producto sin considerar variantes."
                        />
                        <Input
                            type="number"
                            id="stock"
                            name="stock"
                            defaultValue={product?.stock}
                        />
                    </div>

                    <div className="space-y-1">
                        <LabelWithTooltip
                            htmlFor="diasEnvio"
                            label="Días de envío"
                            tooltip="Tiempo estimado de despacho en días hábiles."
                        />
                        <Input
                            type="number"
                            id="diasEnvio"
                            name="diasEnvio"
                            min={1}
                            defaultValue={product?.diasEnvio ?? 1}
                        />
                    </div>
                </div>

                {/* SKU y Barcode */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <LabelWithTooltip
                            htmlFor="sku"
                            label="SKU"
                            tooltip="Código interno para la gestión de inventario (opcional)."
                        />
                        <Input
                            id="sku"
                            name="sku"
                            defaultValue={product?.sku}
                        />
                    </div>

                    <div className="space-y-1">
                        <LabelWithTooltip
                            htmlFor="barcode"
                            label="Código de barras"
                            tooltip="Código EAN, UPC u otro identificador del producto (opcional)."
                        />
                        <Input
                            id="barcode"
                            name="barcode"
                            defaultValue={product?.barcode}
                        />
                    </div>
                </div>

                {/* Marca y Línea */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Marca */}
                    <div className="space-y-1">
                        <LabelWithTooltip
                            htmlFor="brand"
                            label="Marca"
                            required
                            tooltip="Marca asociada al producto."
                        />
                        <BrandCombobox
                            brands={brands}
                            value={selectedBrandId}
                            onChange={(val) => setSelectedBrandId(val)}
                        />
                        {/* Input hidden para enviar el valor en el FormData */}
                        <input type="hidden" name="brand" value={selectedBrandId || ""} />
                    </div>

                    {/* LÍNEA DE PRODUCTO */}
                    <div className="space-y-1">
                        <LabelWithTooltip
                            htmlFor="line"
                            label="Línea"
                            tooltip="Línea o familia de productos (Depende de la marca seleccionada)."
                        />

                        <Select
                            key={selectedBrandId}
                            name="line"
                            defaultValue={initialLineId}
                        >
                            <SelectTrigger disabled={!selectedBrandId || filteredLines.length === 0}>
                                <SelectValue placeholder={
                                    !selectedBrandId
                                        ? "Selecciona una marca primero"
                                        : filteredLines.length === 0
                                            ? "Sin líneas disponibles"
                                            : "Selecciona una línea"
                                } />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredLines.map((line) => (
                                    <SelectItem key={line._id} value={line._id}>
                                        {line.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Categoría */}
                <ClientCategoryAttributes
                    categorias={categorias}
                    initialCategoryId={product?.categoria?._id}
                    currentAttributes={product?.atributos}
                    onCategoryChange={setSelectedCategoryId}
                />

                {/* Especificaciones 
                <SpecificationsSection
                    initial={product?.especificaciones}
                />*/}

                <ComplementaryProductsSection
                    initialItems={product?.complementarios || []}
                />
                {/* Galería Multimedia */}
                <div className="p-4 border rounded-xl bg-card space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-primary" />
                            <Label className="text-sm font-bold">Galería Multimedia del Producto</Label>
                        </div>
                        <MediaLibraryDialog
                            selectedImages={masterImages}
                            globalImagesPool={masterImages}
                            onConfirmSelection={setMasterImages}
                            onUploadSuccess={handleAddImagesToPool}
                            triggerLabel="Añadir Imágenes"
                        />
                    </div>

                    {/* Previsualización del Pool con Keys Únicas */}
                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 min-h-[100px] border-2 border-dashed rounded-lg p-3">
                        {masterImages.map((img) => (
                            <div key={`master-${img}`} className="relative aspect-square border rounded-md overflow-hidden group shadow-sm bg-white">
                                <Image
                                    src={img}
                                    alt="Product Pool"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                                <button
                                    type="button"
                                    onClick={() => setMasterImages(prev => prev.filter(i => i !== img))}
                                    className="absolute top-0.5 right-0.5 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                >
                                    <X size={10} />
                                </button>
                                {/* Input oculto para enviar al backend */}
                                <input type="hidden" name="imagenes[]" value={img} />
                            </div>
                        ))}
                        {masterImages.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center text-muted-foreground opacity-50 py-4">
                                <ImageIcon size={24} />
                                <p className="text-[10px] mt-1 font-medium">Sin imágenes en el pool</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Especificaciones Técnicas */}
                <SpecificationsSection initial={product?.especificaciones} />

                {/* Variantes del Producto */}
                <ProductVariantsForm
                    product={product}
                    categoryAttributes={dynamicCategoryAttributes}
                    globalImagesPool={masterImages}
                    onUploadToPool={handleAddImagesToPool}
                />
            </div>

            {/* =================== COLUMNA LATERAL (1/4) =================== */}
            <div className="space-y-4">
                <div className="sticky top-4">
                    <ProductSwitches product={product} />
                </div>
            </div>
        </div>
    );
}