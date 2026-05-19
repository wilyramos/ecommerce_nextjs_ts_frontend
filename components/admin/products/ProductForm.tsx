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
    const initialBrandId = typeof product?.brand === "object" ? product?.brand?._id : product?.brand;
    const initialLineId = typeof product?.line === "object" ? product?.line?._id : product?.line;

    const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(product?.categoria?._id);
    const [selectedBrandId, setSelectedBrandId] = useState<string | undefined>(initialBrandId);
    const [masterImages, setMasterImages] = useState<string[]>(() => Array.from(new Set(product?.imagenes || [])));

    const handleAddImagesToPool = (newImages: string[]) => {
        setMasterImages(prev => Array.from(new Set([...prev, ...newImages])));
    };

    const filteredLines = lines.filter(line => {
        if (!selectedBrandId) return false;
        const lineBrandId = typeof line.brand === "object" ? line.brand._id : line.brand;
        return lineBrandId === selectedBrandId;
    });

    const currentCategory = categorias.find((c) => c._id === selectedCategoryId);
    const dynamicCategoryAttributes = currentCategory?.attributes || [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-0 select-none bg-background text-foreground">

            {/* =================== COLUMNA PRINCIPAL (3/4) =================== */}
            <div className="lg:col-span-3 space-y-4">

                {/* 1. INFORMACIÓN BÁSICA Y CATEGORIZACIÓN */}
                <section className="p-5 border border-border/60 bg-background rounded-sm space-y-5">
                    <div className="flex items-center gap-2 mb-1">
                        <Info className="w-4 h-4 text-action-cta" />
                        <h2 className="text-[11px] font-bold uppercase tracking-wider text-foreground">Información General</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="nombre" label="Nombre del Producto" required tooltip="El nombre del producto que se mostrará en la tienda." />
                            <Input id="nombre" name="nombre" defaultValue={product?.nombre} className="h-10 text-xs font-medium bg-background-secondary border border-border/40 focus:border-muted-foreground/60 transition-colors rounded-sm" />
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
                                    <SelectTrigger disabled={!selectedBrandId || filteredLines.length === 0} className="h-10 text-xs bg-background-secondary border border-border/40 rounded-sm">
                                        <SelectValue placeholder={!selectedBrandId ? "Selecciona marca" : "Selecciona línea"} />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background border border-border rounded-sm text-foreground">
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
                <section className="p-5 border border-border/60 bg-background rounded-sm space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-muted-foreground/80" />
                            <h2 className="text-[11px] font-bold uppercase tracking-wider text-foreground">Galería Multimedia</h2>
                        </div>
                        <MediaLibraryDialog
                            selectedImages={masterImages}
                            globalImagesPool={masterImages}
                            onConfirmSelection={setMasterImages}
                            onUploadSuccess={handleAddImagesToPool}
                            triggerLabel="Gestionar Imágenes"
                        />
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3 p-4 border border-dashed border-border/60 bg-background-secondary/30 rounded-sm">
                        {masterImages.map((img) => (
                            <div key={img} className="relative aspect-square border border-border/40 bg-background rounded-sm overflow-hidden group">
                                <Image src={img} alt="Product" fill className="object-contain p-1 mix-blend-multiply" unoptimized />
                                <button
                                    type="button"
                                    onClick={() => setMasterImages(prev => prev.filter(i => i !== img))}
                                    className="absolute top-1 right-1 bg-foreground/80 text-background p-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-full outline-none cursor-pointer"
                                >
                                    <X size={10} />
                                </button>
                                <input type="hidden" name="imagenes[]" value={img} />
                            </div>
                        ))}
                        {masterImages.length === 0 && (
                            <div className="col-span-full py-6 text-center text-muted-foreground/60 text-xs font-medium">
                                No hay imágenes seleccionadas
                            </div>
                        )}
                    </div>
                </section>

                {/* 3. DESCRIPCIÓN ENRIQUECIDA */}
                <section className="p-5 border border-border/60 bg-background rounded-sm space-y-3">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-foreground">Descripción Detallada</Label>
                    <ProductDescriptionEditor initialHTML={product?.descripcion || ""} />
                </section>

                {/* 4. PRECIOS, INVENTARIO E IDENTIFICACIÓN */}
                <section className="p-5 border border-border/60 bg-background rounded-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="precio" label="Precio Venta" tooltip="El precio de venta del producto." />
                            <Input type="number" id="precio" name="precio" defaultValue={product?.precio} className="h-10 font-bold text-foreground bg-background-secondary border border-border/40 focus:border-muted-foreground/60 rounded-sm text-xs" />
                        </div>
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="precioComparativo" label="Precio Regular (Tachado)" tooltip="El precio regular del producto antes de la oferta." />
                            <Input type="number" id="precioComparativo" name="precioComparativo" defaultValue={product?.precioComparativo} className="h-10 text-muted-foreground/80 bg-background-secondary border border-border/40 focus:border-muted-foreground/60 rounded-sm text-xs" />
                        </div>
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="costo" label="Costo Unitario" tooltip="El costo unitario del producto." />
                            <Input type="number" id="costo" name="costo" defaultValue={product?.costo} className="h-10 bg-background-secondary border border-border/40 focus:border-muted-foreground/60 rounded-sm text-xs" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/40">
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="stock" label="Stock Global" tooltip="La cantidad disponible del producto en inventario." />
                            <Input type="number" id="stock" name="stock" defaultValue={product?.stock} className="h-10 bg-background-secondary border border-border/40 focus:border-muted-foreground/60 rounded-sm text-xs" />
                        </div>
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="sku" label="SKU" tooltip="El código de identificación único del producto." />
                            <Input id="sku" name="sku" defaultValue={product?.sku} placeholder="Ejem: IPH-15-TI" className="h-10 bg-background-secondary border border-border/40 focus:border-muted-foreground/60 rounded-sm text-xs font-mono" />
                        </div>
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="barcode" label="Código de Barras" tooltip="El código de barras del producto." />
                            <Input id="barcode" name="barcode" defaultValue={product?.barcode} className="h-10 bg-background-secondary border border-border/40 focus:border-muted-foreground/60 rounded-sm text-xs font-mono" />
                        </div>
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="diasEnvio" label="Días de despacho" tooltip="El número de días que toma el envío del producto." />
                            <Input type="number" id="diasEnvio" name="diasEnvio" defaultValue={product?.diasEnvio ?? 1} className="h-10 bg-background-secondary border border-border/40 focus:border-muted-foreground/60 rounded-sm text-xs" />
                        </div>
                    </div>
                </section>

                {/* 5. VARIANTES */}
                <section className="p-5 border border-border/60 bg-background rounded-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <LayoutGrid className="w-4 h-4 text-muted-foreground/80" />
                        <h2 className="text-[11px] font-bold uppercase tracking-wider text-foreground">Variantes de Producto</h2>
                    </div>
                    <ProductVariantsForm
                        product={product}
                        categoryAttributes={dynamicCategoryAttributes}
                        globalImagesPool={masterImages}
                        onUploadToPool={handleAddImagesToPool}
                    />
                </section>

                {/* 6. DETALLES TÉCNICOS Y RELACIONADOS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SpecificationsSection initial={product?.especificaciones} />
                    <ComplementaryProductsSection initialItems={product?.complementarios || []} />
                </div>
            </div>

            {/* =================== COLUMNA LATERAL (1/4) =================== */}
            <aside className="space-y-4">
                <div className="sticky top-6 space-y-4">

                    {/* Estatus y Visibilidad */}
                    <div className="p-4 border border-border/60 bg-background rounded-sm">
                        <ProductSwitches product={product} />
                    </div>

                    {/* Organización */}
                    <div className="p-4 border border-border/60 bg-background rounded-sm">
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