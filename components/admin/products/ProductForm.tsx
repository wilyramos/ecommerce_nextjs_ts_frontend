import type { ProductWithCategoryResponse } from "@/src/schemas";
import type { CategoryListResponse } from "@/src/schemas";
import UploadProductImage from "./UploadProductImage";
import ClientCategoryAttributes from "./ClientCategoryAttributes";
import ProductSwitches from "./ProductSwitches";
import SpecificationsSection from "./SpecificationsSection";
import ProductDescriptionEditor from "./ProductDescriptionEditor";
import type { TBrand } from "@/src/schemas/brands";
import BrandCombobox from "./BrandCombobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProductVariantsForm from "./ProductVariantsForm";

export default function ProductForm({
    product,
    categorias,
    brands,
}: {
    product?: ProductWithCategoryResponse;
    categorias: CategoryListResponse;
    brands: TBrand[];
}) {


    console.log('categorias y sus atributos:', categorias);
    const selectedCategory = categorias.find((c) => c._id === product?.categoria?._id);
    const categoryAttributes = selectedCategory?.attributes || [];
    console.log('atributos de la categoría seleccionada:', categoryAttributes);
    return (
        <div className="text-xs grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 space-y-1">
            <div className="col-span-1 sm:col-span-3">
                {/* Nombre */}
                <div className="py-1 space-y-1">
                    <Label htmlFor="nombre">Nombre
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="text"
                        id="nombre"
                        name="nombre"
                        defaultValue={product?.nombre}
                        required
                    />
                </div>

                {/* Descripción */}
                <div className="py-1 space-y-1">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <ProductDescriptionEditor initialHTML={product?.descripcion || ""} />
                </div>

                {/* Precios y stock */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="py-1 space-y-1">
                        <Label htmlFor="precio">Precio</Label>
                        <Input
                            type="number"
                            id="precio"
                            name="precio"
                            defaultValue={product?.precio}
                        />
                    </div>

                    <div className="py-1 space-y-1">
                        <Label htmlFor="costo">Costo</Label>
                        <Input
                            type="number"
                            id="costo"
                            name="costo"
                            defaultValue={product?.costo}
                        />
                    </div>

                    <div className="py-1 space-y-1">
                        <Label htmlFor="precioComparativo">Precio comparativo</Label>
                        <Input
                            type="number"
                            id="precioComparativo"
                            name="precioComparativo"
                            defaultValue={product?.precioComparativo}
                        />
                    </div>

                    <div className="py-1 space-y-1">
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                            type="number"
                            id="stock"
                            name="stock"
                            defaultValue={product?.stock}
                        />
                    </div>
                    <div className="py-1 space-y-1">
                        <Label htmlFor="diasEnvio">Días de envío</Label>
                        <Input
                            type="number"
                            id="diasEnvio"
                            name="diasEnvio"
                            min={1}
                            defaultValue={product?.diasEnvio ?? 1}
                        />
                    </div>
                </div>

                {/* SKU y Código de barras */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="py-1 space-y-1">
                        <Label htmlFor="sku">SKU (opcional)</Label>
                        <Input
                            type="text"
                            id="sku"
                            name="sku"
                            defaultValue={product?.sku}
                        />
                    </div>

                    <div className="py-1 space-y-1">
                        <Label htmlFor="barcode">Código de barras (opcional)</Label>
                        <Input
                            type="text"
                            id="barcode"
                            name="barcode"
                            defaultValue={product?.barcode}
                        />
                    </div>
                </div>

                {/* Marca */}
                <div className="py-1 space-y-1">
                    <Label htmlFor="brand">Marca</Label>
                    <BrandCombobox brands={brands} value={product?.brand?._id} />
                </div>

                {/* Categoría + atributos dinámicos */}
                <ClientCategoryAttributes
                    categorias={categorias}
                    initialCategoryId={product?.categoria?._id}
                    currentAttributes={product?.atributos}
                />

                {/* Imagenes */}
                <UploadProductImage CurrentImagenes={product?.imagenes} />

                {/* Especificaciones */}
                <SpecificationsSection initial={product?.especificaciones} />

                <ProductVariantsForm
                    product={product}
                    categoryAttributes={categoryAttributes}
                />
            </div>

            {/* Switches */}
            <div>
                <ProductSwitches product={product} />
            </div>
        </div>
    );
}
