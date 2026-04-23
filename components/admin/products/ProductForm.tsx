"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ImageIcon, LayoutGrid, Info } from "lucide-react";

// Types
import type { ProductWithCategoryResponse, CategoryListResponse } from "@/src/schemas";
import type { TBrand } from "@/src/schemas/brands";
import type { ProductLine } from "@/src/schemas/line.schema";

// UI Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LabelWithTooltip } from "@/components/utils/LabelWithTooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Custom Form Components
import ClientCategoryAttributes from "./ClientCategoryAttributes";
import ProductSwitches from "./ProductSwitches";
import SpecificationsSection from "./SpecificationsSection";
import ProductDescriptionEditor from "./ProductDescriptionEditor";
import BrandCombobox from "./BrandCombobox";
import ProductVariantsForm from "./ProductVariantsForm";
import MediaLibraryDialog from "./MediaLibraryDialog";
import ComplementaryProductsSection from "./ComplementaryProductsSection";
import SEOProduct from "./SEOproduct";
import TagsInput from "./TagsInput";
import ShippingDimensions from "./ShippingDimensions";


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
    const initialBrandId = typeof product?.brand === 'object' ? product?.brand?._id : product?.brand;
    const initialLineId = typeof product?.line === 'object' ? product?.line?._id : product?.line;

    const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(product?.categoria?._id);
    const [selectedBrandId, setSelectedBrandId] = useState<string | undefined>(initialBrandId);
    const [masterImages, setMasterImages] = useState<string[]>(() => Array.from(new Set(product?.imagenes || [])));

    const handleAddImagesToPool = (newImages: string[]) => {
        setMasterImages(prev => Array.from(new Set([...prev, ...newImages])));
    };

    const filteredLines = lines.filter(line => {
        if (!selectedBrandId) return false;
        const lineBrandId = typeof line.brand === 'object' ? line.brand._id : line.brand;
        return lineBrandId === selectedBrandId;
    });

    const currentCategory = categorias.find((c) => c._id === selectedCategoryId);
    const dynamicCategoryAttributes = currentCategory?.attributes || [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 bg-[var(--color-bg-secondary)] min-h-screen">

            {/* =================== COLUMNA PRINCIPAL (3/4) =================== */}
            <div className="lg:col-span-3 space-y-6">

                {/* 1. INFORMACIÓN BÁSICA Y CATEGORIZACIÓN */}
                <section className="p-6 border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4 text-[var(--color-accent-warm)]" />
                        <h2 className="text-[11px] font-bold uppercase tracking-widest">Información General</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="nombre" label="Nombre del Producto" required tooltip="El nombre del producto que se mostrará en la tienda." />
                            <Input id="nombre" name="nombre" defaultValue={product?.nombre} className="h-11 text-sm font-medium" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <LabelWithTooltip htmlFor="brand" label="Marca" required tooltip="La marca a la que pertenece el producto." />
                                <BrandCombobox brands={brands} value={selectedBrandId} onChange={(val) => setSelectedBrandId(val)} />
                                <input type="hidden" name="brand" value={selectedBrandId || ""} />
                            </div>

                            <div className="space-y-1">
                                <LabelWithTooltip htmlFor="line" label="Línea / Familia" tooltip="La línea o familia a la que pertenece el producto." />
                                <Select key={selectedBrandId} name="line" defaultValue={initialLineId}>
                                    <SelectTrigger disabled={!selectedBrandId || filteredLines.length === 0} className="h-10">
                                        <SelectValue placeholder={!selectedBrandId ? "Selecciona marca" : "Selecciona línea"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredLines.map((line) => (
                                            <SelectItem key={line._id} value={line._id}>{line.nombre}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <ClientCategoryAttributes
                            categorias={categorias}
                            initialCategoryId={product?.categoria?._id}
                            currentAttributes={product?.atributos}
                            onCategoryChange={setSelectedCategoryId}
                        />
                    </div>
                </section>

                {/* 2. CONTENIDO VISUAL (GALERÍA) */}
                <section className="p-6 border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-[var(--color-text-secondary)]" />
                            <h2 className="text-[11px] font-bold uppercase tracking-widest">Galería Multimedia</h2>
                        </div>
                        <MediaLibraryDialog
                            selectedImages={masterImages}
                            globalImagesPool={masterImages}
                            onConfirmSelection={setMasterImages}
                            onUploadSuccess={handleAddImagesToPool}
                            triggerLabel="Gestionar Imágenes"
                        />
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3 p-4 border-2 border-dashed border-[var(--color-border-default)]">
                        {masterImages.map((img) => (
                            <div key={img} className="relative aspect-square border group bg-white overflow-hidden">
                                <Image src={img} alt="Product" fill className="object-cover" unoptimized />
                                <button
                                    type="button"
                                    onClick={() => setMasterImages(prev => prev.filter(i => i !== img))}
                                    className="absolute top-1 right-1 bg-black/70 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={12} />
                                </button>
                                <input type="hidden" name="imagenes[]" value={img} />
                            </div>
                        ))}
                        {masterImages.length === 0 && (
                            <div className="col-span-full py-8 text-center text-[var(--color-text-tertiary)] italic">
                                No hay imágenes seleccionadas
                            </div>
                        )}
                    </div>
                </section>

                {/* 3. DESCRIPCIÓN ENRIQUECIDA */}
                <section className="p-6 border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] space-y-3">
                    <Label className="text-[11px] font-bold uppercase tracking-widest">Descripción Detallada</Label>
                    <ProductDescriptionEditor initialHTML={product?.descripcion || ""} />
                </section>

                {/* 4. PRECIOS, INVENTARIO E IDENTIFICACIÓN */}
                <section className="p-6 border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="precio" label="Precio Venta" tooltip="El precio de venta del producto." />
                            <Input type="number" id="precio" name="precio" defaultValue={product?.precio} className="h-10 font-bold text-emerald-600" />
                        </div>
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="precioComparativo" label="Precio Regular (Tachado)" tooltip="El precio regular del producto antes de la oferta." />
                            <Input type="number" id="precioComparativo" name="precioComparativo" defaultValue={product?.precioComparativo} className="h-10 opacity-70" />
                        </div>
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="costo" label="Costo Unitario" tooltip="El costo unitario del producto." />
                            <Input type="number" id="costo" name="costo" defaultValue={product?.costo} className="h-10" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[var(--color-border-default)]">
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="stock" label="Stock Global" tooltip="La cantidad disponible del producto en inventario." />
                            <Input type="number" id="stock" name="stock" defaultValue={product?.stock} />
                        </div>
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="sku" label="SKU" tooltip="El código de identificación único del producto." />
                            <Input id="sku" name="sku" defaultValue={product?.sku} placeholder="Ejem: IPH-15-TI" />
                        </div>
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="barcode" label="Código de Barras" tooltip="El código de barras del producto." />
                            <Input id="barcode" name="barcode" defaultValue={product?.barcode} />
                        </div>
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="diasEnvio" label="Días de despacho" tooltip="El número de días que toma el envío del producto." />
                            <Input type="number" id="diasEnvio" name="diasEnvio" defaultValue={product?.diasEnvio ?? 1} />
                        </div>
                    </div>
                </section>

                {/* 5. VARIANTES (AL FINAL POR SU COMPLEJIDAD) */}
                <section className="p-6 border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]">
                    <div className="flex items-center gap-2 mb-4">
                        <LayoutGrid className="w-4 h-4 text-[var(--color-text-secondary)]" />
                        <h2 className="text-[11px] font-bold uppercase tracking-widest">Variantes de Producto</h2>
                    </div>
                    <ProductVariantsForm
                        product={product}
                        categoryAttributes={dynamicCategoryAttributes}
                        globalImagesPool={masterImages}
                        onUploadToPool={handleAddImagesToPool}
                    />
                </section>

                {/* 6. DETALLES TÉCNICOS Y RELACIONADOS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SpecificationsSection initial={product?.especificaciones} />
                    <ComplementaryProductsSection initialItems={product?.complementarios || []} />
                </div>
            </div>

            {/* =================== COLUMNA LATERAL (1/4) =================== */}
            <aside className="space-y-6">
                <div className="sticky top-6 space-y-6">

                    {/* Estatus y Visibilidad */}
                    <div className="p-4 border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]">
                        <ProductSwitches product={product} />
                    </div>

                    {/* Organización */}
                    <div className="p-4 border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]">
                        <TagsInput initial={product?.tags || []} />
                    </div>

                    {/* Logística */}
                    <ShippingDimensions product={product} />

                    {/* SEO Metadata */}
                    <SEOProduct product={product} />

                </div>
            </aside>
        </div>
    );
}