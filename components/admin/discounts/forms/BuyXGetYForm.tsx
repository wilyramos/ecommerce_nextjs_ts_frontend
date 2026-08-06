// File: frontend/components/admin/discounts/forms/BuyXGetYForm.tsx

"use client";

import { useState, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createDiscountAction, type ActionState } from "@/actions/discount-actions";
import BaseDiscountFormFields from "./BaseDiscountFormFields";
import SubmitButtonDiscount from "./SubmitButtonDiscount";
import DiscountSummarySidebar from "../DiscountSummarySidebar";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { type DiscountTarget, type DiscountAppliesVia } from "@/src/schemas/discount.schema";

export default function BuyXGetYForm() {
    const router = useRouter();

    const [appliesVia, setAppliesVia] = useState<DiscountAppliesVia>("CODE");
    const [title, setTitle] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const [buyQuantity, setBuyQuantity] = useState<number>(2);
    const [target, setTarget] = useState<DiscountTarget>("SPECIFIC_PRODUCTS");
    const [rawIdsInput, setRawIdsInput] = useState<string>("");

    const [getQuantity, setGetQuantity] = useState<number>(1);
    const [getDiscountType, setGetDiscountType] = useState<string>("FREE");
    const [getDiscountValue, setGetDiscountValue] = useState<number>(100);
    const [getProductsTarget, setGetProductsTarget] = useState<"SAME_AS_BUY" | "SPECIFIC_PRODUCTS">("SAME_AS_BUY");
    const [getProductsRawInput, setGetProductsRawInput] = useState<string>("");

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

    return (
        <form action={formAction} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <input type="hidden" name="type" value="BUY_X_GET_Y" />
            <input type="hidden" name="appliesVia" value={appliesVia} />

            {/* COLUMNA IZQUIERDA: FORMULARIO PRINCIPAL */}
            <div className="lg:col-span-2 space-y-6">
                {/* 1. Método de Aplicación */}
                <Card>
                    <CardHeader>
                        <CardTitle>Método de Aplicación</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <RadioGroup
                            value={appliesVia}
                            onValueChange={(val) => setAppliesVia(val as DiscountAppliesVia)}
                            className="grid grid-cols-1 md:grid-cols-2 gap-3"
                        >
                            <label
                                className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                                    appliesVia === "CODE"
                                        ? "border-foreground bg-accent/30 shadow-sm"
                                        : "border-border hover:bg-accent/10"
                                }`}
                            >
                                <RadioGroupItem value="CODE" id="method-code" className="mt-0.5" />
                                <div className="space-y-0.5">
                                    <span className="text-xs font-bold leading-none text-foreground block">
                                        Código de Descuento
                                    </span>
                                    <span className="text-[11px] text-muted-foreground block">
                                        El cliente debe ingresar un código en el checkout.
                                    </span>
                                </div>
                            </label>

                            <label
                                className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                                    appliesVia === "AUTOMATIC"
                                        ? "border-foreground bg-accent/30 shadow-sm"
                                        : "border-border hover:bg-accent/10"
                                }`}
                            >
                                <RadioGroupItem value="AUTOMATIC" id="method-auto" className="mt-0.5" />
                                <div className="space-y-0.5">
                                    <span className="text-xs font-bold leading-none text-foreground block">
                                        Descuento Automático
                                    </span>
                                    <span className="text-[11px] text-muted-foreground block">
                                        Se aplica automáticamente si el carrito cumple la condición.
                                    </span>
                                </div>
                            </label>
                        </RadioGroup>

                        <div className="space-y-2 pt-2">
                            <Label htmlFor="title" className="text-xs font-bold">Título Promocional (Público) *</Label>
                            <Input
                                id="title"
                                type="text"
                                name="title"
                                value={title ?? ""}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ej. Llevas 2 Audífonos y obtienes un Cable Gratis"
                                required
                                className="text-xs"
                            />
                            {state?.errors?.title && (
                                <p className="text-xs font-medium text-destructive">
                                    {state.errors.title[0]}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Condición: El cliente compra (X) */}
                <Card>
                    <CardHeader>
                        <CardTitle>1. El cliente compra (Producto X)</CardTitle>
                        <CardDescription>
                            Define la cantidad requerida y los productos o categorías elegibles.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="buyQuantity" className="text-xs font-bold">Cantidad mínima a comprar (X) *</Label>
                            <Input
                                id="buyQuantity"
                                type="number"
                                name="buyQuantity"
                                min="1"
                                value={buyQuantity || ""}
                                onChange={(e) => setBuyQuantity(e.target.value === "" ? 0 : Number(e.target.value))}
                                required
                                className="text-xs"
                            />
                        </div>

                        {/* Selección por RadioGroup en lugar de Select */}
                        <div className="space-y-2 pt-2">
                            <Label className="text-xs font-bold">Productos o Categorías Elegibles (X)</Label>
                            <input type="hidden" name="target" value={target} />

                            <RadioGroup
                                value={target}
                                onValueChange={(val: DiscountTarget) => setTarget(val)}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                            >
                                <label
                                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                        target === "ALL_PRODUCTS"
                                            ? "border-foreground bg-accent/30 shadow-sm"
                                            : "border-border hover:bg-accent/10"
                                    }`}
                                >
                                    <RadioGroupItem value="ALL_PRODUCTS" className="mt-0.5" />
                                    <div className="space-y-0.5">
                                        <span className="text-xs font-bold block text-foreground">Todos los Productos</span>
                                        <span className="text-[11px] text-muted-foreground block">Aplica a cualquier producto de la tienda.</span>
                                    </div>
                                </label>

                                <label
                                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                        target === "SPECIFIC_PRODUCTS"
                                            ? "border-foreground bg-accent/30 shadow-sm"
                                            : "border-border hover:bg-accent/10"
                                    }`}
                                >
                                    <RadioGroupItem value="SPECIFIC_PRODUCTS" className="mt-0.5" />
                                    <div className="space-y-0.5">
                                        <span className="text-xs font-bold block text-foreground">Productos Específicos</span>
                                        <span className="text-[11px] text-muted-foreground block">Solo productos delimitados por ID.</span>
                                    </div>
                                </label>

                                <label
                                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                        target === "SPECIFIC_CATEGORIES"
                                            ? "border-foreground bg-accent/30 shadow-sm"
                                            : "border-border hover:bg-accent/10"
                                    }`}
                                >
                                    <RadioGroupItem value="SPECIFIC_CATEGORIES" className="mt-0.5" />
                                    <div className="space-y-0.5">
                                        <span className="text-xs font-bold block text-foreground">Categorías Específicas</span>
                                        <span className="text-[11px] text-muted-foreground block">Aplica a categorías completas.</span>
                                    </div>
                                </label>

                                <label
                                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                        target === "SPECIFIC_COLLECTIONS"
                                            ? "border-foreground bg-accent/30 shadow-sm"
                                            : "border-border hover:bg-accent/10"
                                    }`}
                                >
                                    <RadioGroupItem value="SPECIFIC_COLLECTIONS" className="mt-0.5" />
                                    <div className="space-y-0.5">
                                        <span className="text-xs font-bold block text-foreground">Colecciones Específicas</span>
                                        <span className="text-[11px] text-muted-foreground block">Aplica a colecciones promocionales.</span>
                                    </div>
                                </label>
                            </RadioGroup>
                        </div>

                        {target !== "ALL_PRODUCTS" && (
                            <div className="space-y-2 pt-1">
                                <Label htmlFor="rawIdsInput" className="text-xs font-bold">
                                    IDs de {target === "SPECIFIC_PRODUCTS" ? "Productos" : "Categorías/Colecciones"} Comprados X *
                                </Label>
                                <Input
                                    id="rawIdsInput"
                                    type="text"
                                    name="rawIdsInput"
                                    value={rawIdsInput ?? ""}
                                    onChange={(e) => setRawIdsInput(e.target.value)}
                                    placeholder="IDs de MongoDB separados por coma (ej. 66a..., 66b...)"
                                    required
                                    className="text-xs font-mono"
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* 3. Beneficio: El cliente obtiene (Y) */}
                <Card>
                    <CardHeader>
                        <CardTitle>2. El cliente obtiene (Producto Y)</CardTitle>
                        <CardDescription>
                            Especifica la cantidad bonificada y el tipo de descuento asignado.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="getQuantity" className="text-xs font-bold">Cantidad bonificada (Y) *</Label>
                            <Input
                                id="getQuantity"
                                type="number"
                                name="getQuantity"
                                min="1"
                                value={getQuantity || ""}
                                onChange={(e) => setGetQuantity(e.target.value === "" ? 0 : Number(e.target.value))}
                                required
                                className="text-xs"
                            />
                        </div>

                        {/* Tipo de Valor Descontado por RadioGroup */}
                        <div className="space-y-2 pt-2">
                            <Label className="text-xs font-bold">Tipo de Valor Descontado</Label>
                            <input type="hidden" name="getDiscountType" value={getDiscountType} />

                            <RadioGroup
                                value={getDiscountType}
                                onValueChange={(val) => setGetDiscountType(val)}
                                className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                            >
                                <label
                                    className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-all ${
                                        getDiscountType === "FREE"
                                            ? "border-foreground bg-accent/30 shadow-sm"
                                            : "border-border hover:bg-accent/10"
                                    }`}
                                >
                                    <RadioGroupItem value="FREE" className="mt-0.5" />
                                    <div className="space-y-0.5">
                                        <span className="text-xs font-bold block text-foreground">Gratis</span>
                                        <span className="text-[11px] text-muted-foreground block">100% Bonificado</span>
                                    </div>
                                </label>

                                <label
                                    className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-all ${
                                        getDiscountType === "PERCENTAGE"
                                            ? "border-foreground bg-accent/30 shadow-sm"
                                            : "border-border hover:bg-accent/10"
                                    }`}
                                >
                                    <RadioGroupItem value="PERCENTAGE" className="mt-0.5" />
                                    <div className="space-y-0.5">
                                        <span className="text-xs font-bold block text-foreground">Porcentaje</span>
                                        <span className="text-[11px] text-muted-foreground block">Descuento %</span>
                                    </div>
                                </label>

                                <label
                                    className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-all ${
                                        getDiscountType === "FIXED_AMOUNT"
                                            ? "border-foreground bg-accent/30 shadow-sm"
                                            : "border-border hover:bg-accent/10"
                                    }`}
                                >
                                    <RadioGroupItem value="FIXED_AMOUNT" className="mt-0.5" />
                                    <div className="space-y-0.5">
                                        <span className="text-xs font-bold block text-foreground">Monto Fijo</span>
                                        <span className="text-[11px] text-muted-foreground block">Descuento en S/</span>
                                    </div>
                                </label>
                            </RadioGroup>
                        </div>

                        {getDiscountType !== "FREE" && (
                            <div className="space-y-2">
                                <Label htmlFor="getDiscountValue" className="text-xs font-bold">
                                    Valor Descontado por Producto ({getDiscountType === "PERCENTAGE" ? "%" : "S/"}) *
                                </Label>
                                <Input
                                    id="getDiscountValue"
                                    type="number"
                                    name="getDiscountValue"
                                    min="0.01"
                                    step="0.01"
                                    value={getDiscountValue || ""}
                                    onChange={(e) => setGetDiscountValue(e.target.value === "" ? 0 : Number(e.target.value))}
                                    required
                                    className="text-xs"
                                />
                            </div>
                        )}

                        {/* Origen de Productos Bonificados por RadioGroup */}
                        <div className="space-y-2 pt-2 border-t border-border">
                            <Label className="text-xs font-bold">Origen de los Productos Bonificados (Y)</Label>
                            <RadioGroup
                                value={getProductsTarget}
                                onValueChange={(val: "SAME_AS_BUY" | "SPECIFIC_PRODUCTS") => setGetProductsTarget(val)}
                                className="grid grid-cols-1 md:grid-cols-2 gap-3"
                            >
                                <label
                                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                        getProductsTarget === "SAME_AS_BUY"
                                            ? "border-foreground bg-accent/30 shadow-sm"
                                            : "border-border hover:bg-accent/10"
                                    }`}
                                >
                                    <RadioGroupItem value="SAME_AS_BUY" className="mt-0.5" />
                                    <div className="space-y-0.5">
                                        <span className="text-xs font-bold block text-foreground">Mismos productos elegibles</span>
                                        <span className="text-[11px] text-muted-foreground block">Ejemplo: Oferta 3x2 o 2x1.</span>
                                    </div>
                                </label>

                                <label
                                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                        getProductsTarget === "SPECIFIC_PRODUCTS"
                                            ? "border-foreground bg-accent/30 shadow-sm"
                                            : "border-border hover:bg-accent/10"
                                    }`}
                                >
                                    <RadioGroupItem value="SPECIFIC_PRODUCTS" className="mt-0.5" />
                                    <div className="space-y-0.5">
                                        <span className="text-xs font-bold block text-foreground">Productos regalo específicos</span>
                                        <span className="text-[11px] text-muted-foreground block">Ejemplo: Compra X y lleva regalo Y.</span>
                                    </div>
                                </label>
                            </RadioGroup>
                        </div>

                        {getProductsTarget === "SPECIFIC_PRODUCTS" && (
                            <div className="space-y-2">
                                <Label htmlFor="getProductsRawInput" className="text-xs font-bold">
                                    IDs de los Productos Bonificados/Regalo (Y) *
                                </Label>
                                <Input
                                    id="getProductsRawInput"
                                    type="text"
                                    name="getProductsRawInput"
                                    value={getProductsRawInput ?? ""}
                                    onChange={(e) => setGetProductsRawInput(e.target.value)}
                                    placeholder="IDs de MongoDB separados por coma"
                                    required
                                    className="text-xs font-mono"
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* 4. Restricciones Generales y Fechas */}
                <BaseDiscountFormFields
                    appliesVia={appliesVia}
                    state={state}
                    code={code}
                    onCodeChange={setCode}
                />

                {/* Botones de Acción */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/admin/discounts")}
                        className="text-xs h-9"
                    >
                        Cancelar
                    </Button>

                    <SubmitButtonDiscount />
                </div>
            </div>

            {/* COLUMNA DERECHA: RESUMEN DINÁMICO EN TIEMPO REAL */}
            <div className="lg:col-span-1 lg:sticky lg:top-6">
                <DiscountSummarySidebar
                    type="BUY_X_GET_Y"
                    appliesVia={appliesVia}
                    title={title}
                    code={code}
                    buyQuantity={buyQuantity}
                    target={target}
                    rawIdsInput={rawIdsInput}
                    getQuantity={getQuantity}
                    getDiscountType={getDiscountType}
                    getDiscountValue={getDiscountValue}
                    getProductsTarget={getProductsTarget}
                    getProductsRawInput={getProductsRawInput}
                />
            </div>
        </form>
    );
}