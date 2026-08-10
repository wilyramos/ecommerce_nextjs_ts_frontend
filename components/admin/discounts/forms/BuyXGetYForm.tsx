"use client";

import { useState, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";

import { createDiscountAction, type ActionState } from "@/actions/discount-actions";
import BaseDiscountFormFields from "./BaseDiscountFormFields";
import SubmitButtonDiscount from "./SubmitButtonDiscount";
import DiscountSummarySidebar from "../DiscountSummarySidebar";

import { AdminFormSplitLayout } from "@/components/admin/layout/admin-form-split-layout";
import { AdminCard } from "@/components/admin/layout/admin-card";

import { AdminEntitySearchInput } from "@/src/features/v3/admin-search/components/admin-entity-search-input";
import { searchAdminProductsAction } from "@/actions/product-actions-v3";
import type { ProductSearchResult } from "@/src/schemas/product-v3.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { type DiscountTarget, type DiscountAppliesVia } from "@/src/schemas/discount.schema";

export default function BuyXGetYForm() {
    const router = useRouter();

    const [appliesVia, setAppliesVia] = useState<DiscountAppliesVia>("CODE");
    const [title, setTitle] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const [buyQuantity, setBuyQuantity] = useState<number>(1);
    const [target, setTarget] = useState<DiscountTarget>("SPECIFIC_PRODUCTS");
    
    const [getQuantity, setGetQuantity] = useState<number>(1);
    const [getDiscountType, setGetDiscountType] = useState<string>("FREE");
    const [getDiscountValue, setGetDiscountValue] = useState<number>(100);
    const [getProductsTarget, setGetProductsTarget] = useState<"SAME_AS_BUY" | "SPECIFIC_PRODUCTS">("SAME_AS_BUY");

    const [buySelectedProducts, setBuySelectedProducts] = useState<ProductSearchResult[]>([]);
    const [getSelectedProducts, setGetSelectedProducts] = useState<ProductSearchResult[]>([]);

    const [state, formAction] = useActionState<ActionState<null>, FormData>(
        createDiscountAction,
        null
    );

    useEffect(() => {
        if (!state) return;
        if (state.ok) {
            toast.success(state.message || "Promoción creada exitosamente.");
            router.push("/admin/discounts");
        } else if (state.error) {
            toast.error(state.error);
        }
    }, [state, router]);

    const rawIdsInput = buySelectedProducts.map((p) => p._id).join(",");
    const getProductsRawInput = getSelectedProducts.map((p) => p._id).join(",");

    return (
        <form action={formAction} className="text-xs">
            {/* Campos Ocultos para envío confiable al FormData */}
            <input type="hidden" name="type" value="BUY_X_GET_Y" />
            <input type="hidden" name="appliesVia" value={appliesVia} />
            <input type="hidden" name="target" value={target} />
            <input type="hidden" name="buyQuantity" value={buyQuantity} />
            <input type="hidden" name="rawIdsInput" value={rawIdsInput} />
            <input type="hidden" name="getProductsTarget" value={getProductsTarget} />
            <input type="hidden" name="getProductsRawInput" value={getProductsRawInput} />
            <input type="hidden" name="getQuantity" value={getQuantity} />
            <input type="hidden" name="getDiscountType" value={getDiscountType} />
            <input type="hidden" name="getDiscountValue" value={getDiscountValue} />

            <AdminFormSplitLayout 
                main={
                    <>
                        <AdminCard title="Método de Aplicación">
                            <div className="space-y-3">
                                <RadioGroup
                                    value={appliesVia}
                                    onValueChange={(val) => setAppliesVia(val as DiscountAppliesVia)}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-2"
                                >
                                    <label className={`flex items-start gap-2.5 p-2.5 rounded-md border cursor-pointer transition-all ${appliesVia === "CODE" ? "border-zinc-900 bg-zinc-50/80 shadow-2xs" : "border-zinc-200/80 hover:bg-zinc-50/50"}`}>
                                        <RadioGroupItem value="CODE" className="mt-0.5" />
                                        <div className="space-y-0.5">
                                            <span className="text-xs font-semibold text-zinc-900 block leading-tight">Código de Descuento</span>
                                            <span className="text-[10px] text-zinc-500 block leading-tight">El cliente ingresa un cupón en el checkout.</span>
                                        </div>
                                    </label>

                                    <label className={`flex items-start gap-2.5 p-2.5 rounded-md border cursor-pointer transition-all ${appliesVia === "AUTOMATIC" ? "border-zinc-900 bg-zinc-50/80 shadow-2xs" : "border-zinc-200/80 hover:bg-zinc-50/50"}`}>
                                        <RadioGroupItem value="AUTOMATIC" className="mt-0.5" />
                                        <div className="space-y-0.5">
                                            <span className="text-xs font-semibold text-zinc-900 block leading-tight">Descuento Automático</span>
                                            <span className="text-[10px] text-zinc-500 block leading-tight">Se liquida automáticamente en carrito.</span>
                                        </div>
                                    </label>
                                </RadioGroup>

                                <div className="space-y-1 pt-1">
                                    <Label htmlFor="title" className="text-[11px] font-semibold text-zinc-800">Título Promocional (Público) *</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Ej. Llevas 2 Audífonos y obtienes un Cable Gratis"
                                        required
                                        className="h-8 text-xs bg-white border-zinc-200"
                                    />
                                    {state?.errors?.title && <p className="text-[10px] font-medium text-red-500">{state.errors.title[0]}</p>}
                                </div>
                            </div>
                        </AdminCard>

                        <AdminCard 
                            title="1. El cliente compra (Producto X)" 
                            description="Define las cantidades mínimas requeridas y los productos elegibles."
                        >
                            <div className="space-y-3.5">
                                <div className="space-y-1">
                                    <Label htmlFor="buyQuantityInput" className="text-[11px] font-semibold text-zinc-800">Cantidad mínima a comprar (X) *</Label>
                                    <Input
                                        id="buyQuantityInput"
                                        type="number"
                                        min="1"
                                        value={buyQuantity || ""}
                                        onChange={(e) => setBuyQuantity(e.target.value === "" ? 1 : Math.max(1, Number(e.target.value)))}
                                        required
                                        className="h-8 text-xs bg-white border-zinc-200 max-w-xs"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-[11px] font-semibold text-zinc-800">Productos Elegibles (X)</Label>
                                    <RadioGroup
                                        value={target}
                                        onValueChange={(val: DiscountTarget) => setTarget(val)}
                                        className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                                    >
                                        <label className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-all ${target === "ALL_PRODUCTS" ? "border-zinc-900 bg-zinc-50/80" : "border-zinc-200/80 hover:bg-zinc-50/50"}`}>
                                            <RadioGroupItem value="ALL_PRODUCTS" />
                                            <span className="text-xs font-medium text-zinc-900">Todos los Productos</span>
                                        </label>
                                        <label className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-all ${target === "SPECIFIC_PRODUCTS" ? "border-zinc-900 bg-zinc-50/80" : "border-zinc-200/80 hover:bg-zinc-50/50"}`}>
                                            <RadioGroupItem value="SPECIFIC_PRODUCTS" />
                                            <span className="text-xs font-medium text-zinc-900">Productos Específicos</span>
                                        </label>
                                    </RadioGroup>
                                </div>

                                {target === "SPECIFIC_PRODUCTS" && (
                                    <div className="pt-2 border-t border-zinc-100">
                                        <AdminEntitySearchInput<ProductSearchResult>
                                            title="Seleccionar Productos Elegibles (Compra X)"
                                            placeholder="Busca por nombre o SKU..."
                                            buttonLabel="Añadir Productos"
                                            emptyMessage="Debes seleccionar al menos un producto elegible."
                                            multiple={true}
                                            selectedItems={buySelectedProducts}
                                            onChange={setBuySelectedProducts}
                                            searchAction={searchAdminProductsAction}
                                            keyExtractor={(product) => product._id}
                                            renderSelectedCard={(product) => ({
                                                title: product.nombre,
                                                subtitle: `SKU: ${product.sku || "N/A"}`,
                                                imageUrl: product.imagenes?.[0]
                                            })}
                                            renderItem={(product, isSelected) => (
                                                <div className="flex items-center gap-2.5 w-full">
                                                    <div className="relative h-8 w-8 flex-shrink-0 bg-white rounded border border-zinc-200/80 overflow-hidden flex items-center justify-center">
                                                        {product.imagenes?.[0] ? (
                                                            <Image 
                                                                src={product.imagenes[0]} 
                                                                alt={product.nombre} 
                                                                fill
                                                                sizes="32px"
                                                                className="object-cover" 
                                                            />
                                                        ) : (
                                                            <ImageIcon className="w-3.5 h-3.5 text-zinc-300" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col flex-1 min-w-0">
                                                        <span className={`text-xs truncate ${isSelected ? "font-bold text-zinc-900" : "font-medium text-zinc-800"}`}>
                                                            {product.nombre}
                                                        </span>
                                                        <span className="text-[10px] text-zinc-500 leading-none mt-0.5">
                                                            SKU: {product.sku || 'N/A'} • Stock: {product.stock}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs font-mono font-medium text-zinc-900">
                                                        S/ {product.precio?.toFixed(2) || '0.00'}
                                                    </div>
                                                </div>
                                            )}
                                        />
                                        {buySelectedProducts.length === 0 && state?.errors?.rawIdsInput && (
                                            <p className="text-[10px] font-medium text-red-500 mt-1">Selecciona productos elegibles.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </AdminCard>

                        <AdminCard title="2. El cliente obtiene (Producto Y)" description="Especifica las unidades de regalo/descuento y el valor descontado.">
                            <div className="space-y-3.5">
                                <div className="space-y-1">
                                    <Label htmlFor="getQuantityInput" className="text-[11px] font-semibold text-zinc-800">Cantidad bonificada (Y) *</Label>
                                    <Input
                                        id="getQuantityInput"
                                        type="number"
                                        min="1"
                                        value={getQuantity || ""}
                                        onChange={(e) => setGetQuantity(e.target.value === "" ? 1 : Math.max(1, Number(e.target.value)))}
                                        required
                                        className="h-8 text-xs bg-white border-zinc-200 max-w-xs"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-[11px] font-semibold text-zinc-800">Tipo de Valor Descontado</Label>
                                    <RadioGroup
                                        value={getDiscountType}
                                        onValueChange={(val) => setGetDiscountType(val)}
                                        className="grid grid-cols-1 sm:grid-cols-3 gap-2"
                                    >
                                        <label className={`flex items-start gap-2 p-2.5 rounded-md border cursor-pointer transition-all ${getDiscountType === "FREE" ? "border-zinc-900 bg-zinc-50/80 shadow-2xs" : "border-zinc-200/80 hover:bg-zinc-50/50"}`}>
                                            <RadioGroupItem value="FREE" className="mt-0.5" />
                                            <div className="space-y-0.5">
                                                <span className="text-xs font-bold block text-zinc-900">Gratis</span>
                                                <span className="text-[10px] text-zinc-500 block">100% Bonificado</span>
                                            </div>
                                        </label>

                                        <label className={`flex items-start gap-2 p-2.5 rounded-md border cursor-pointer transition-all ${getDiscountType === "PERCENTAGE" ? "border-zinc-900 bg-zinc-50/80 shadow-2xs" : "border-zinc-200/80 hover:bg-zinc-50/50"}`}>
                                            <RadioGroupItem value="PERCENTAGE" className="mt-0.5" />
                                            <div className="space-y-0.5">
                                                <span className="text-xs font-bold block text-zinc-900">Porcentaje</span>
                                                <span className="text-[10px] text-zinc-500 block">Descuento %</span>
                                            </div>
                                        </label>

                                        <label className={`flex items-start gap-2 p-2.5 rounded-md border cursor-pointer transition-all ${getDiscountType === "FIXED_AMOUNT" ? "border-zinc-900 bg-zinc-50/80 shadow-2xs" : "border-zinc-200/80 hover:bg-zinc-50/50"}`}>
                                            <RadioGroupItem value="FIXED_AMOUNT" className="mt-0.5" />
                                            <div className="space-y-0.5">
                                                <span className="text-xs font-bold block text-zinc-900">Monto Fijo</span>
                                                <span className="text-[10px] text-zinc-500 block">Descuento S/</span>
                                            </div>
                                        </label>
                                    </RadioGroup>
                                </div>

                                {getDiscountType !== "FREE" && (
                                    <div className="space-y-1">
                                        <Label htmlFor="getDiscountValueInput" className="text-[11px] font-semibold text-zinc-800">
                                            Valor Descontado ({getDiscountType === "PERCENTAGE" ? "%" : "S/"}) *
                                        </Label>
                                        <Input
                                            id="getDiscountValueInput"
                                            type="number"
                                            min="0.01"
                                            step="0.01"
                                            value={getDiscountValue || ""}
                                            onChange={(e) => setGetDiscountValue(e.target.value === "" ? 0 : Number(e.target.value))}
                                            required
                                            className="h-8 text-xs bg-white border-zinc-200 max-w-xs"
                                        />
                                    </div>
                                )}

                                <div className="space-y-1 pt-2 border-t border-zinc-100">
                                    <Label className="text-[11px] font-semibold text-zinc-800">Origen de los Productos Bonificados (Y)</Label>
                                    <RadioGroup
                                        value={getProductsTarget}
                                        onValueChange={(val: "SAME_AS_BUY" | "SPECIFIC_PRODUCTS") => setGetProductsTarget(val)}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-2"
                                    >
                                        <label className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-all ${getProductsTarget === "SAME_AS_BUY" ? "border-zinc-900 bg-zinc-50/80" : "border-zinc-200/80 hover:bg-zinc-50/50"}`}>
                                            <RadioGroupItem value="SAME_AS_BUY" />
                                            <span className="text-xs font-medium text-zinc-900">Mismos productos elegibles</span>
                                        </label>
                                        <label className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-all ${getProductsTarget === "SPECIFIC_PRODUCTS" ? "border-zinc-900 bg-zinc-50/80" : "border-zinc-200/80 hover:bg-zinc-50/50"}`}>
                                            <RadioGroupItem value="SPECIFIC_PRODUCTS" />
                                            <span className="text-xs font-medium text-zinc-900">Productos regalo específicos</span>
                                        </label>
                                    </RadioGroup>
                                </div>

                                {getProductsTarget === "SPECIFIC_PRODUCTS" && (
                                    <div className="pt-2 border-t border-zinc-100">
                                        <AdminEntitySearchInput<ProductSearchResult>
                                            title="Seleccionar Productos de Regalo (Y)"
                                            placeholder="Busca por nombre o SKU..."
                                            buttonLabel="Añadir Regalos"
                                            emptyMessage="Debes seleccionar al menos un producto de regalo."
                                            multiple={true}
                                            selectedItems={getSelectedProducts}
                                            onChange={setGetSelectedProducts}
                                            searchAction={searchAdminProductsAction}
                                            keyExtractor={(product) => product._id}
                                            renderSelectedCard={(product) => ({
                                                title: product.nombre,
                                                subtitle: `SKU: ${product.sku || "N/A"}`,
                                                imageUrl: product.imagenes?.[0]
                                            })}
                                            renderItem={(product, isSelected) => (
                                                <div className="flex items-center gap-2.5 w-full">
                                                    <div className="relative h-8 w-8 flex-shrink-0 bg-white rounded border border-zinc-200/80 overflow-hidden flex items-center justify-center">
                                                        {product.imagenes?.[0] ? (
                                                            <Image 
                                                                src={product.imagenes[0]} 
                                                                alt={product.nombre} 
                                                                fill
                                                                sizes="32px"
                                                                className="object-cover" 
                                                            />
                                                        ) : (
                                                            <ImageIcon className="w-3.5 h-3.5 text-zinc-300" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col flex-1 min-w-0">
                                                        <span className={`text-xs truncate ${isSelected ? "font-bold text-zinc-900" : "font-medium text-zinc-800"}`}>
                                                            {product.nombre}
                                                        </span>
                                                        <span className="text-[10px] text-zinc-500 leading-none mt-0.5">
                                                            SKU: {product.sku || 'N/A'} • Stock: {product.stock}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs font-semibold text-emerald-600">
                                                        Regalo
                                                    </div>
                                                </div>
                                            )}
                                        />
                                        {getSelectedProducts.length === 0 && state?.errors?.getProductsRawInput && (
                                            <p className="text-[10px] font-medium text-red-500 mt-1">Selecciona productos de regalo.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </AdminCard>

                        <BaseDiscountFormFields
                            appliesVia={appliesVia}
                            state={state}
                            code={code}
                            onCodeChange={setCode}
                        />

                        <div className="flex items-center justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={() => router.push("/admin/discounts")} className="h-8 text-xs font-medium">
                                Cancelar
                            </Button>
                            <SubmitButtonDiscount />
                        </div>
                    </>
                }
                sidebar={
                    <div className="sticky top-6">
                        <DiscountSummarySidebar
                            type="BUY_X_GET_Y"
                            appliesVia={appliesVia}
                            title={title}
                            code={code}
                            buyQuantity={buyQuantity}
                            target={target}
                            getQuantity={getQuantity}
                            getDiscountType={getDiscountType}
                            getDiscountValue={getDiscountValue}
                            getProductsTarget={getProductsTarget}
                        />
                    </div>
                }
            />
        </form>
    );
}