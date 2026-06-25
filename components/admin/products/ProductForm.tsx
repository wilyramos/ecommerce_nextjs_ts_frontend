"use client";

import { useState } from "react";
import { Info } from "lucide-react";

// Types
import type { ProductWithCategoryResponse } from "@/src/schemas";
import type { CategoryListResponse } from "@/src/schemas/category.schema";

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
import ComplementaryProductsSection from "./ComplementaryProductsSection";
import SEOProduct from "./SEOproduct";
import TagsInput from "./TagsInput";
import ShippingDimensions from "./ShippingDimensions";
import type { Collection } from "@/src/schemas/collection.schema";
import BarcodeInput from "./BarcodeInput";

// Componente Unificado de Medios
import { FormMediaField } from "@/components/form/FormMediaField";

export default function ProductForm({
    product,
    categorias,
    brands,
    lines,
    allCollections,
}: {
    product?: ProductWithCategoryResponse;
    categorias: CategoryListResponse;
    brands: TBrand[];
    lines: ProductLine[];
    allCollections: Collection[];
}) {
    const initialBrandId = typeof product?.brand === "object" ? product?.brand?._id : product?.brand;
    const initialLineId = typeof product?.line === "object" ? product?.line?._id : product?.line;

    const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(product?.categoria?._id);
    const [selectedBrandId, setSelectedBrandId] = useState<string | undefined>(initialBrandId);
    const [masterImages] = useState<string[]>(() => Array.from(new Set(product?.imagenes || [])));

    // Estado local para mantener el valor sincronizado del código de barras si es requerido antes del submit
    const [, setBarcode] = useState(product?.barcode || "");

    const filteredLines = lines.filter(line => {
        if (!selectedBrandId) return false;
        const lineBrandId = typeof line.brand === "object" ? line.brand._id : line.brand;
        return lineBrandId === selectedBrandId;
    });

    const currentCategory = categorias.find((c) => c._id === selectedCategoryId);
    const dynamicCategoryAttributes = currentCategory?.attributes || [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-0 select-none text-foreground">

            {/* =================== COLUMNA PRINCIPAL (3/4) =================== */}
            <div className="lg:col-span-3 space-y-4">

                {/* 1. INFORMACIÓN BÁSICA Y CATEGORIZACIÓN */}
                <section className="p-5 border border-border/60 bg-background space-y-5">
                    <div className="flex items-center gap-2 mb-1">
                        <Info className="w-4 h-4 text-action-cta" />
                        <h2 className="text-[11px] font-bold uppercase tracking-wider text-foreground">Información General</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="nombre" label="Nombre del Producto" required tooltip="El nombre del producto que se mostrará en la tienda." />
                            <Input id="nombre" name="nombre" defaultValue={product?.nombre} className="h-10 text-xs font-medium bg-background-secondary border border-border/40 focus:border-muted-foreground/60 transition-colors " />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <ClientCategoryAttributes
                                categorias={categorias}
                                initialCategoryId={product?.categoria?._id}
                                currentAttributes={product?.atributos}
                                onCategoryChange={setSelectedCategoryId}
                            />
                            <div className="space-y-1">
                                <LabelWithTooltip htmlFor="brand" label="Marca" required tooltip="La marca a la que pertenece el producto." />
                                <BrandCombobox brands={brands} value={selectedBrandId} onChange={(val) => setSelectedBrandId(val)} />
                                <input type="hidden" name="brand" value={selectedBrandId || ""} />
                            </div>

                            <div className="space-y-1">
                                <LabelWithTooltip htmlFor="line" label="Línea / Familia" tooltip="La línea o familia a la que pertenece el producto." />
                                <Select key={selectedBrandId} name="line" defaultValue={initialLineId}>
                                    <SelectTrigger disabled={!selectedBrandId || filteredLines.length === 0} className="w-full">
                                        <SelectValue placeholder={!selectedBrandId ? "Selecciona marca" : "Selecciona línea"} />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background border border-border text-foreground">
                                        {filteredLines.map((line) => (
                                            <SelectItem key={line._id} value={line._id}>{line.nombre}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. CONTENIDO VISUAL - GALERÍA MULTIMEDIA UNIFICADA */}
                <section className="p-5 border border-border/60 bg-background space-y-4">
                    <FormMediaField
                        name="imagenes"
                        label="Galería Multimedia"
                        folder="products"
                        defaultValue={masterImages}
                        multiple={true}
                        maxFiles={15}
                        accept="both"
                    />
                </section>

                {/* 3. DESCRIPCIÓN ENRIQUECIDA */}
                <section className="p-5 border border-border/60 bg-background space-y-3">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-foreground">Descripción Detallada</Label>
                    <ProductDescriptionEditor initialHTML={product?.descripcion || ""} />
                </section>

                {/* 4. PRECIOS, INVENTARIO E IDENTIFICACIÓN */}
                <section className="p-5 border border-border/60 bg-background ">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="precio" label="Precio Venta" tooltip="El precio de venta del producto." />
                            <Input type="number" id="precio" name="precio" defaultValue={product?.precio} className="h-10 font-bold text-foreground bg-background-secondary border border-border/40 focus:border-muted-foreground/60 text-xs" />
                        </div>
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="precioComparativo" label="Precio Regular (Tachado)" tooltip="El precio regular del producto antes de la oferta." />
                            <Input type="number" id="precioComparativo" name="precioComparativo" defaultValue={product?.precioComparativo} className="h-10 text-muted-foreground/80 bg-background-secondary border border-border/40 focus:border-muted-foreground/60 text-xs" />
                        </div>
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="costo" label="Costo Unitario" tooltip="El costo unitario del producto." />
                            <Input type="number" id="costo" name="costo" defaultValue={product?.costo} className="h-10 bg-background-secondary border border-border/40 focus:border-muted-foreground/60 text-xs" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/40">
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="stock" label="Stock Global" tooltip="La cantidad disponible del producto en inventario." />
                            <Input type="number" id="stock" name="stock" defaultValue={product?.stock} className="h-10 bg-background-secondary border border-border/40 focus:border-muted-foreground/60 text-xs" />
                        </div>
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="sku" label="SKU" tooltip="El código de identificación único del producto." />
                            <Input id="sku" name="sku" defaultValue={product?.sku} placeholder="Ejem: IPH-15-TI" className="h-10 bg-background-secondary border border-border/40 focus:border-muted-foreground/60 text-xs font-mono" />
                        </div>

                        {/* INPUT CON ESCÁNER DE CÓDIGO DE BARRAS INTEGRADO */}
                        <BarcodeInput
                            defaultValue={product?.barcode}
                            onChange={(value) => setBarcode(value)}
                        />

                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="diasEnvio" label="Días de despacho" tooltip="El número de días que toma el envío del producto." />
                            <Input type="number" id="diasEnvio" name="diasEnvio" defaultValue={product?.diasEnvio ?? 1} className="h-10 bg-background-secondary border border-border/40 focus:border-muted-foreground/60 text-xs" />
                        </div>
                    </div>
                </section>

                {/* 5. VARIANTES */}
                <section className="p-5 border border-border/60 bg-background ">
                    <ProductVariantsForm
                        product={product}
                        categoryAttributes={dynamicCategoryAttributes}
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
                    <div className="p-4 border border-border/60 bg-background ">
                        <ProductSwitches product={product} allCollections={allCollections} />
                    </div>
                    <div className="p-4 border border-border/60 bg-background ">
                        <TagsInput initial={product?.tags || []} />
                    </div>
                    <ShippingDimensions product={product} />
                    <SEOProduct product={product} />
                </div>
            </aside>
        </div>
    );
}