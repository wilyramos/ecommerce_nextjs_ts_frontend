"use client";

import { useState, useMemo, useCallback } from "react";
import { Info, Zap } from "lucide-react";

// Types
import type { ProductWithCategoryResponse } from "@/src/schemas";
import type { CategoryListResponse } from "@/src/schemas/category.schema";
import type { TBrand } from "@/src/schemas/brands";
import type { ProductLine } from "@/src/schemas/line.schema";
import type { Collection } from "@/src/schemas/collection.schema";

// UI Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LabelWithTooltip } from "@/components/utils/LabelWithTooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Pricing Rules
import { PRICING_RULES, calculateSuggestedPrice } from "@/lib/pricing-rules";

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
import BarcodeInput from "./BarcodeInput";
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

    // States for categorization
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(product?.categoria?._id);
    const [selectedBrandId, setSelectedBrandId] = useState<string | undefined>(initialBrandId);
    const [masterImages] = useState<string[]>(() => Array.from(new Set(product?.imagenes || [])));

    // States for pricing logic
    const [costValue, setCostValue] = useState<number>(product?.costo ? parseFloat(product.costo.toString()) : 0);
    const [priceValue, setPriceValue] = useState<number>(product?.precio ? parseFloat(product.precio.toString()) : 0);
    const [manualPriceOverride, setManualPriceOverride] = useState<boolean>(!!product?.precio);
    const [, setBarcode] = useState(product?.barcode || "");

    // Filtered lines based on selected brand
    const filteredLines = useMemo(() => {
        if (!selectedBrandId) return [];
        return lines.filter(line => {
            const lineBrandId = typeof line.brand === "object" ? line.brand._id : line.brand;
            return lineBrandId === selectedBrandId;
        });
    }, [selectedBrandId, lines]);

    // Category attributes
    const currentCategory = useMemo(
        () => categorias.find((c) => c._id === selectedCategoryId),
        [selectedCategoryId, categorias]
    );
    const dynamicCategoryAttributes = currentCategory?.attributes || [];

    // Find applicable pricing rule based on cost
    const applicablePricingRule = useMemo(() => {
        return PRICING_RULES.find(rule => costValue >= rule.minCost && costValue < rule.maxCost);
    }, [costValue]);

    // Calculate suggested price
    const suggestedPrice = useMemo(() => {
        if (costValue <= 0 || !applicablePricingRule) return 0;
        return calculateSuggestedPrice(costValue, applicablePricingRule.defaultMargin);
    }, [costValue, applicablePricingRule]);

    // Handle cost change
    const handleCostChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value ? parseFloat(e.target.value) : 0;
        setCostValue(value);

        // Only update price if user hasn't manually overridden it
        if (!manualPriceOverride) {
            setPriceValue(suggestedPrice);
        }
    }, [manualPriceOverride, suggestedPrice]);

    // Handle price change (user manually entering)
    const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value ? parseFloat(e.target.value) : 0;
        setPriceValue(value);
        setManualPriceOverride(true);
    }, []);

    // Calculate profit margin
    const profitMargin = useMemo(() => {
        if (costValue <= 0 || priceValue <= 0) return 0;
        return ((priceValue - costValue) / priceValue) * 100;
    }, [costValue, priceValue]);

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
                        {/* Product Name */}
                        <div className="space-y-1">
                            <LabelWithTooltip
                                htmlFor="nombre"
                                label="Nombre del Producto"
                                required
                                tooltip="El nombre del producto que se mostrará en la tienda."
                            />
                            <Input
                                id="nombre"
                                name="nombre"
                                defaultValue={product?.nombre}
                                className="h-10 text-xs font-medium bg-background-secondary border border-border/40 focus:border-muted-foreground/60 transition-colors"
                            />
                        </div>

                        {/* Category, Brand, Line Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <ClientCategoryAttributes
                                categorias={categorias}
                                initialCategoryId={product?.categoria?._id}
                                currentAttributes={product?.atributos}
                                onCategoryChange={setSelectedCategoryId}
                            />
                            <div className="space-y-1">
                                <LabelWithTooltip
                                    htmlFor="brand"
                                    label="Marca"
                                    required
                                    tooltip="La marca a la que pertenece el producto."
                                />
                                <BrandCombobox
                                    brands={brands}
                                    value={selectedBrandId}
                                    onChange={(val) => setSelectedBrandId(val)}
                                />
                                <input type="hidden" name="brand" value={selectedBrandId || ""} />
                            </div>

                            <div className="space-y-1">
                                <LabelWithTooltip
                                    htmlFor="line"
                                    label="Línea / Familia"
                                    tooltip="La línea o familia a la que pertenece el producto."
                                />
                                <Select key={selectedBrandId} name="line" defaultValue={initialLineId}>
                                    <SelectTrigger
                                        disabled={!selectedBrandId || filteredLines.length === 0}
                                        className="w-full"
                                    >
                                        <SelectValue
                                            placeholder={!selectedBrandId ? "Selecciona marca" : "Selecciona línea"}
                                        />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background border border-border text-foreground">
                                        {filteredLines.map((line) => (
                                            <SelectItem key={line._id} value={line._id}>
                                                {line.nombre}
                                            </SelectItem>
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
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                        Descripción Detallada
                    </Label>
                    <ProductDescriptionEditor initialHTML={product?.descripcion || ""} />
                </section>

                {/* 4. PRECIOS E INVENTARIO - REORGANIZADO CON PRICING RULES */}
                <section className="p-5 border border-border/60 bg-background space-y-5">

                    {/* Pricing Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-action-cta" />
                            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                                Precios y Márgenes
                            </h3>
                        </div>

                        {/* Cost & Suggested Price Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Costo Unitario */}
                            <div className="space-y-1">
                                <LabelWithTooltip
                                    htmlFor="costo"
                                    label="Costo Unitario"
                                    required
                                    tooltip="El costo unitario del producto. Esto calcula automáticamente el precio sugerido."
                                />
                                <Input
                                    type="number"
                                    id="costo"
                                    name="costo"
                                    value={costValue || ""}
                                    onChange={handleCostChange}
                                    placeholder="0.00"
                                    className="h-10 bg-background-secondary border border-border/40 focus:border-muted-foreground/60 text-xs font-medium"
                                    step="0.01"
                                />
                            </div>

                            {/* Precio Sugerido (Read-only) */}
                            <div className="space-y-1">
                                <LabelWithTooltip
                                    htmlFor="suggestedPrice"
                                    label="Precio Sugerido"
                                    tooltip={`Basado en margen: ${applicablePricingRule?.defaultMargin || 0}%. ${applicablePricingRule?.label || "Ingresa un costo válido"}`}
                                />
                                <div className="relative">
                                    <Input
                                        type="number"
                                        id="suggestedPrice"
                                        value={suggestedPrice > 0 ? suggestedPrice.toFixed(2) : ""}
                                        disabled
                                        placeholder="—"
                                        className="h-10 bg-muted text-xs font-medium border border-border/40"
                                    />
                                    {suggestedPrice > 0 && (
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-action-cta">
                                            {applicablePricingRule?.defaultMargin}% margen
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Precio de Venta (Editable) */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between gap-2">
                                    <LabelWithTooltip
                                        htmlFor="precio"
                                        label="Precio de Venta"
                                        required
                                        tooltip="Precio final de venta. Edita este campo para sobrescribir la sugerencia automática."
                                    />
                                    {manualPriceOverride && suggestedPrice > 0 && (
                                        <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                                            Manual
                                        </span>
                                    )}
                                </div>
                                <Input
                                    type="number"
                                    id="precio"
                                    name="precio"
                                    value={priceValue || ""}
                                    onChange={handlePriceChange}
                                    placeholder="0.00"
                                    className="h-10 font-bold text-foreground bg-background-secondary border border-border/40 focus:border-muted-foreground/60 text-xs"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        {/* Profit Margin Display */}
                        {priceValue > 0 && costValue > 0 && (
                            <div className="p-3 bg-muted/50 rounded border border-border/40 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-muted-foreground">Margen de Ganancia Real:</span>
                                    <span className="text-sm font-bold text-foreground">
                                        {profitMargin.toFixed(2)}%
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-muted-foreground">Ganancia Unitaria:</span>
                                    <span className="text-sm font-bold text-foreground">
                                        S/. {(priceValue - costValue).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Precio Comparativo (Optional) */}
                        <div className="space-y-1">
                            <LabelWithTooltip
                                htmlFor="precioComparativo"
                                label="Precio Regular (Tachado)"
                                tooltip="Precio anterior o precio regular. Se mostrará tachado para destacar el descuento."
                            />
                            <Input
                                type="number"
                                id="precioComparativo"
                                name="precioComparativo"
                                defaultValue={product?.precioComparativo}
                                placeholder="Opcional"
                                className="h-10 text-muted-foreground/80 bg-background-secondary border border-border/40 focus:border-muted-foreground/60 text-xs"
                                step="0.01"
                            />
                        </div>
                    </div>

                    {/* Inventory Section */}
                    <div className="pt-4 border-t border-border/40 space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Stock Global */}
                            <div className="space-y-1">
                                <LabelWithTooltip
                                    htmlFor="stock"
                                    label="Stock Global"
                                    tooltip="La cantidad disponible del producto en inventario."
                                />
                                <Input
                                    type="number"
                                    id="stock"
                                    name="stock"
                                    defaultValue={product?.stock}
                                    className="h-10 bg-background-secondary border border-border/40 focus:border-muted-foreground/60 text-xs"
                                    min="0"
                                />
                            </div>

                            {/* SKU */}
                            <div className="space-y-1">
                                <LabelWithTooltip
                                    htmlFor="sku"
                                    label="SKU"
                                    required
                                    tooltip="El código de identificación único del producto."
                                />
                                <Input
                                    id="sku"
                                    name="sku"
                                    defaultValue={product?.sku}
                                    placeholder="Ejem: IPH-15-TI"
                                    className="h-10 bg-background-secondary border border-border/40 focus:border-muted-foreground/60 text-xs font-mono"
                                />
                            </div>

                            {/* Barcode Scanner */}
                            <BarcodeInput
                                defaultValue={product?.barcode}
                                onChange={(value) => setBarcode(value)}
                            />

                            {/* Shipping Days */}
                            <div className="space-y-1">
                                <LabelWithTooltip
                                    htmlFor="diasEnvio"
                                    label="Días de Despacho"
                                    tooltip="El número de días que toma el envío del producto."
                                />
                                <Input
                                    type="number"
                                    id="diasEnvio"
                                    name="diasEnvio"
                                    defaultValue={product?.diasEnvio ?? 1}
                                    className="h-10 bg-background-secondary border border-border/40 focus:border-muted-foreground/60 text-xs"
                                    min="1"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. VARIANTES */}
                <section className="p-5 border border-border/60 bg-background">
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
                    <div className="p-4 border border-border/60 bg-background">
                        <ProductSwitches product={product} allCollections={allCollections} />
                    </div>
                    <div className="p-4 border border-border/60 bg-background">
                        <TagsInput initial={product?.tags || []} />
                    </div>
                    <ShippingDimensions product={product} />
                    <SEOProduct product={product} />
                </div>
            </aside>
        </div>
    );
}