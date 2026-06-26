"use client";

import { useState, useEffect } from "react";
import { Info } from "lucide-react";

// Configuración de Pricing Modular (Buenos Precios)
import { PRICING_RULES, calculateSuggestedPrice } from "@/lib/pricing-rules";

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

    // Estado local para mantener el valor sincronizado del código de barras
    const [, setBarcode] = useState(product?.barcode || "");

    // --- ESTADOS PARA MOTOR DE PRECIOS AGRESIVOS ---
    const [costo, setCosto] = useState<number>(product?.costo || 0);
    const [precioVenta, setPrecioVenta] = useState<string>(product?.precio?.toString() || "");
    const [precioRegular, setPrecioRegular] = useState<string>(product?.precioComparativo?.toString() || "");
    const [targetMargin, setTargetMargin] = useState<string>("18");
    const [activeRuleLabel, setActiveRuleLabel] = useState<string>("");

    // Determinar la regla inicial (Flujo de Edición)
    useEffect(() => {
        if (product?.costo) {
            const currentCost = product.costo;
            const matchedRule = PRICING_RULES.find(
                (rule) => currentCost >= rule.minCost && currentCost < rule.maxCost
            );
            if (matchedRule) {
                setActiveRuleLabel(matchedRule.label);
                if (product.precio) {
                    setTargetMargin(matchedRule.defaultMargin.toString());
                }
            }
        }
    }, [product]);

    // Auto-calculador inteligente (Sólo para productos nuevos)
    useEffect(() => {
        if (costo > 0 && !product?.precio) {
            const matchedRule = PRICING_RULES.find(
                (rule) => costo >= rule.minCost && costo < rule.maxCost
            );

            if (matchedRule) {
                setTargetMargin(matchedRule.defaultMargin.toString());
                setActiveRuleLabel(matchedRule.label);

                const venta = calculateSuggestedPrice(costo, matchedRule.defaultMargin);
                const regular = venta / 0.85;

                setPrecioVenta(venta.toFixed(2));
                setPrecioRegular(regular.toFixed(2));
            }
        }
    }, [costo, product?.precio]);

    const handleMarginChange = (newMargin: string) => {
        setTargetMargin(newMargin);
        if (costo > 0) {
            const venta = calculateSuggestedPrice(costo, parseFloat(newMargin));
            const regular = venta / 0.85;
            setPrecioVenta(venta.toFixed(2));
            setPrecioRegular(regular.toFixed(2));
        }
    };

    const filteredLines = lines.filter(line => {
        if (!selectedBrandId) return false;
        const lineBrandId = typeof line.brand === "object" ? line.brand._id : line.brand;
        return lineBrandId === selectedBrandId;
    });

    const currentCategory = categorias.find((c) => c._id === selectedCategoryId);
    const dynamicCategoryAttributes = currentCategory?.attributes || [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-0 w-full text-foreground h-auto items-start">

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

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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

                            <div className="space-y-1 sm:col-span-2 md:col-span-1">
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

                {/* 4. PRECIOS COMPETITIVOS, INVENTARIO E IDENTIFICACIÓN */}
                <section className="p-5 border border-border/60 bg-background space-y-4">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2">
                        <div className="flex items-center gap-2">
                            <Info className="w-4 h-4 text-action-cta" />
                            <h2 className="text-[11px] font-bold uppercase tracking-wider text-foreground">Estructura Comercial de Precios</h2>
                        </div>
                        {activeRuleLabel && (
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 font-bold uppercase tracking-wider">
                                {activeRuleLabel}
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                        {/* COSTO */}
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="costo" label="Costo de Adquisición" required tooltip="Costo real neto del artículo en almacén." />
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-xs text-muted-foreground font-semibold">S/</span>
                                <Input
                                    type="number"
                                    id="costo"
                                    name="costo"
                                    step="0.01"
                                    value={costo || ""}
                                    onChange={(e) => setCosto(parseFloat(e.target.value) || 0)}
                                    className="h-10 pl-8 bg-background-secondary border border-border/40 text-xs font-bold text-foreground"
                                />
                            </div>
                        </div>

                        {/* MARGEN DE RETORNO COMPETITIVO */}
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="targetMargin" label="Margen Comercial Sugerido" tooltip="Estrategia de ganancia neta optimizada para tecnología." />
                            <Select value={targetMargin} onValueChange={handleMarginChange}>
                                <SelectTrigger id="targetMargin" className="w-full h-10 text-xs bg-background-secondary font-semibold">
                                    <SelectValue placeholder="Margen" />
                                </SelectTrigger>
                                <SelectContent className="bg-background text-foreground text-xs">
                                    <SelectItem value="35">35% Margen Agresivo (Accesorios Económicos)</SelectItem>
                                    <SelectItem value="25">25% Margen Competitivo (Accesorios Premium)</SelectItem>
                                    <SelectItem value="18">18% Margen Ajustado (Gama Media / Gadgets)</SelectItem>
                                    <SelectItem value="10">10% Margen Ajustado (Tablets / Gama Alta)</SelectItem>
                                    <SelectItem value="6">6% Margen de Volumen (iPhones / Laptops)</SelectItem>
                                    <SelectItem value="4">4% Margen Rompe Precios (Liquidación Directa)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* PRECIO VENTA FINAL */}
                        <div className="space-y-1 relative">
                            <LabelWithTooltip htmlFor="precio" label="Precio Venta Final" tooltip="Monto neto visible y editable. Sincronizado automáticamente con decimales psicológicos." />
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-xs text-foreground font-bold">S/</span>
                                <Input
                                    type="number"
                                    id="precio"
                                    name="precio"
                                    step="0.01"
                                    value={precioVenta}
                                    onChange={(e) => setPrecioVenta(e.target.value)}
                                    className="h-10 pl-8 font-black text-foreground bg-background-secondary border border-border/40 text-xs"
                                />
                            </div>
                            {costo > 0 && parseFloat(precioVenta) > 0 && (
                                <span className="absolute right-2 -bottom-5 text-[9px] text-emerald-500 font-bold font-mono whitespace-nowrap">
                                    Utilidad: +S/ {(parseFloat(precioVenta) - costo).toFixed(2)}
                                </span>
                            )}
                        </div>

                        {/* PRECIO REGULAR (TACHADO) */}
                        <div className="space-y-1 relative mt-4 sm:mt-0">
                            <LabelWithTooltip htmlFor="precioComparativo" label="Precio Regular (Tachado)" tooltip="Precio de referencia estándar del mercado peruano." />
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">S/</span>
                                <Input
                                    type="number"
                                    id="precioComparativo"
                                    name="precioComparativo"
                                    step="0.01"
                                    value={precioRegular}
                                    onChange={(e) => setPrecioRegular(e.target.value)}
                                    className="h-10 pl-8 text-muted-foreground/80 bg-background-secondary border border-border/40 text-xs line-through"
                                />
                            </div>
                            {parseFloat(precioRegular) > parseFloat(precioVenta) && (
                                <span className="absolute right-2 -bottom-5 text-[9px] text-action-cta font-bold whitespace-nowrap">
                                    Oferta Visible: -{Math.round(((parseFloat(precioRegular) - parseFloat(precioVenta)) / parseFloat(precioRegular)) * 100)}%
                                </span>
                            )}
                        </div>
                    </div>

                    {/* CONTROL LOGÍSTICO Y OPERATIVO */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-border/40">
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="stock" label="Stock Global" tooltip="La cantidad disponible del producto en inventario." />
                            <Input type="number" id="stock" name="stock" defaultValue={product?.stock} className="h-10 bg-background-secondary border border-border/40 text-xs" />
                        </div>
                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="sku" label="SKU" tooltip="El código de identificación único del producto." />
                            <Input id="sku" name="sku" defaultValue={product?.sku} placeholder="Ejem: IPH-15-TI" className="h-10 bg-background-secondary border border-border/40 text-xs font-mono" />
                        </div>

                        <BarcodeInput
                            defaultValue={product?.barcode}
                            onChange={(value) => setBarcode(value)}
                        />

                        <div className="space-y-1">
                            <LabelWithTooltip htmlFor="diasEnvio" label="Días de despacho" tooltip="El número de días que toma el envío del producto." />
                            <Input type="number" id="diasEnvio" name="diasEnvio" defaultValue={product?.diasEnvio ?? 1} className="h-10 bg-background-secondary border border-border/40 text-xs" />
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

                {/* 3. DESCRIPCIÓN DETALLADA (Reordenado dentro del flujo principal de la izquierda) */}
                <section className="p-5 border border-border/60 bg-background space-y-3">
                    <Label className="text-[11px] font-bold uppercase tracking-wider text-foreground">Descripción Detallada</Label>
                    <ProductDescriptionEditor initialHTML={product?.descripcion || ""} />
                </section>
            </div>

            {/* =================== COLUMNA LATERAL (1/4) =================== */}
            <aside className="space-y-4 h-auto lg:sticky lg:top-4">
                <div className="p-4 border border-border/60 bg-background">
                    <ProductSwitches product={product} allCollections={allCollections} />
                </div>
                <div className="p-4 border border-border/60 bg-background">
                    <TagsInput initial={product?.tags || []} />
                </div>
                <ShippingDimensions product={product} />
                <SEOProduct product={product} />
            </aside>
        </div>
    );
}