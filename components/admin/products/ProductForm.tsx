"use client";

import { useState } from "react";
import type { ProductWithCategoryResponse } from "@/src/schemas";
import type { CategoryListResponse } from "@/src/schemas";
import type { TBrand } from "@/src/schemas/brands";

import ClientCategoryAttributes from "./ClientCategoryAttributes";
import ProductSwitches from "./ProductSwitches";
import SpecificationsSection from "./SpecificationsSection";
import ProductDescriptionEditor from "./ProductDescriptionEditor";
import BrandCombobox from "./BrandCombobox";
import ProductVariantsForm from "./ProductVariantsForm";
import UploadProductImageDialog from "./UploadProductImageDialog";

import { Input } from "@/components/ui/input";
import { LabelWithTooltip } from "@/components/utils/LabelWithTooltip";

export default function ProductForm({
    product,
    categorias,
    brands,
}: {
    product?: ProductWithCategoryResponse;
    categorias: CategoryListResponse;
    brands: TBrand[];
}) {
    const [selectedCategoryId, setSelectedCategoryId] = useState<
        string | undefined
    >(product?.categoria?._id);

    const currentCategory = categorias.find(
        (c) => c._id === selectedCategoryId
    );

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

                {/* Marca */}
                <div className="space-y-1">
                    <LabelWithTooltip
                        htmlFor="brand"
                        label="Marca"
                        tooltip="Marca asociada al producto."
                    />
                    <BrandCombobox
                        brands={brands}
                        value={product?.brand?._id}
                    />
                </div>

                {/* Categoría + atributos dinámicos */}
                <ClientCategoryAttributes
                    categorias={categorias}
                    initialCategoryId={product?.categoria?._id}
                    currentAttributes={product?.atributos}
                    onCategoryChange={setSelectedCategoryId}
                />

                {/* Imágenes */}
                <UploadProductImageDialog
                    CurrentImagenes={product?.imagenes}
                />

                {/* Especificaciones */}
                <SpecificationsSection
                    initial={product?.especificaciones}
                />

                {/* Variantes */}
                <ProductVariantsForm
                    product={product}
                    categoryAttributes={dynamicCategoryAttributes}
                />
            </div>

            {/* =================== SWITCHES =================== */}
            <div>
                <ProductSwitches product={product} />
            </div>
        </div>
    );
}
