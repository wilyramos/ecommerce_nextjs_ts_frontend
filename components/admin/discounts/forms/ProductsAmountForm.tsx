// File: frontend/components/admin/discounts/forms/ProductsAmountForm.tsx

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

export default function ProductsAmountForm() {
    const router = useRouter();

    const [appliesVia, setAppliesVia] = useState<DiscountAppliesVia>("CODE");
    const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED_AMOUNT">("PERCENTAGE");
    const [value, setValue] = useState<number>(10);
    const [title, setTitle] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const [target, setTarget] = useState<DiscountTarget>("SPECIFIC_PRODUCTS");
    const [rawIdsInput, setRawIdsInput] = useState<string>("");

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
            <input type="hidden" name="type" value={discountType} />
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
                                        El cliente ingresa un código al finalizar la compra.
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
                                        Se aplica automáticamente al cumplir la condición en el carrito.
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
                                placeholder="Ej. 15% de Descuento en Audífonos Seleccionados"
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

                {/* 2. Valor y Tipo de Descuento */}
                <Card>
                    <CardHeader>
                        <CardTitle>Valor del Descuento</CardTitle>
                        <CardDescription>
                            Elige si se descontará un porcentaje o un monto fijo monetario sobre los productos.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <RadioGroup
                            value={discountType}
                            onValueChange={(val) => setDiscountType(val as "PERCENTAGE" | "FIXED_AMOUNT")}
                            className="grid grid-cols-1 md:grid-cols-2 gap-3"
                        >
                            <label
                                className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                                    discountType === "PERCENTAGE"
                                        ? "border-foreground bg-accent/30 shadow-sm"
                                        : "border-border hover:bg-accent/10"
                                }`}
                            >
                                <RadioGroupItem value="PERCENTAGE" id="type-percentage" className="mt-0.5" />
                                <div className="space-y-0.5">
                                    <span className="text-xs font-bold leading-none text-foreground block">
                                        Porcentaje (%)
                                    </span>
                                    <span className="text-[11px] text-muted-foreground block">
                                        Resta un porcentaje del precio de los productos participantes.
                                    </span>
                                </div>
                            </label>

                            <label
                                className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                                    discountType === "FIXED_AMOUNT"
                                        ? "border-foreground bg-accent/30 shadow-sm"
                                        : "border-border hover:bg-accent/10"
                                }`}
                            >
                                <RadioGroupItem value="FIXED_AMOUNT" id="type-fixed" className="mt-0.5" />
                                <div className="space-y-0.5">
                                    <span className="text-xs font-bold leading-none text-foreground block">
                                        Monto Fijo (S/)
                                    </span>
                                    <span className="text-[11px] text-muted-foreground block">
                                        Resta un monto en Soles sobre los productos participantes.
                                    </span>
                                </div>
                            </label>
                        </RadioGroup>

                        <div className="space-y-2 pt-2">
                            <Label htmlFor="value" className="text-xs font-bold">
                                Valor a Descontar ({discountType === "PERCENTAGE" ? "%" : "S/"}) *
                            </Label>
                            <Input
                                id="value"
                                type="number"
                                name="value"
                                min="0.01"
                                step="0.01"
                                value={value || ""}
                                onChange={(e) => setValue(e.target.value === "" ? 0 : Number(e.target.value))}
                                placeholder={discountType === "PERCENTAGE" ? "Ej. 15" : "Ej. 50"}
                                required
                                className="text-xs"
                            />
                            {state?.errors?.value && (
                                <p className="text-xs font-medium text-destructive">
                                    {state.errors.value[0]}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Cobertura de Productos o Colecciones */}
                <Card>
                    <CardHeader>
                        <CardTitle>Cobertura de Productos</CardTitle>
                        <CardDescription>
                            Selecciona los productos, categorías o colecciones a los que aplicará el descuento.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <input type="hidden" name="target" value={target} />

                        <RadioGroup
                            value={target}
                            onValueChange={(val: DiscountTarget) => setTarget(val)}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                        >
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
                                    <span className="text-[11px] text-muted-foreground block">Aplica solo a productos delimitados por ID.</span>
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

                            <label
                                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                    target === "SPECIFIC_BRANDS"
                                        ? "border-foreground bg-accent/30 shadow-sm"
                                        : "border-border hover:bg-accent/10"
                                }`}
                            >
                                <RadioGroupItem value="SPECIFIC_BRANDS" className="mt-0.5" />
                                <div className="space-y-0.5">
                                    <span className="text-xs font-bold block text-foreground">Marcas Específicas</span>
                                    <span className="text-[11px] text-muted-foreground block">Aplica a marcas específicas.</span>
                                </div>
                            </label>

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
                                    <span className="text-[11px] text-muted-foreground block">Aplica a todo el catálogo sin restricción.</span>
                                </div>
                            </label>
                        </RadioGroup>

                        {target !== "ALL_PRODUCTS" && (
                            <div className="space-y-2 pt-2">
                                <Label htmlFor="rawIdsInput" className="text-xs font-bold">
                                    IDs Elegibles de {
                                        target === "SPECIFIC_PRODUCTS" ? "Productos" :
                                        target === "SPECIFIC_CATEGORIES" ? "Categorías" :
                                        target === "SPECIFIC_BRANDS" ? "Marcas" : "Colecciones"
                                    } *
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
                    type={discountType}
                    appliesVia={appliesVia}
                    title={title}
                    code={code}
                    value={value}
                    target={target}
                    rawIdsInput={rawIdsInput}
                />
            </div>
        </form>
    );
}   