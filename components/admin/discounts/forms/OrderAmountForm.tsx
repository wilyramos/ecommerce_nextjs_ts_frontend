// File: frontend/components/admin/discounts/forms/OrderAmountForm.tsx

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
import { type DiscountAppliesVia } from "@/src/schemas/discount.schema";

export default function OrderAmountForm() {
    const router = useRouter();

    const [appliesVia, setAppliesVia] = useState<DiscountAppliesVia>("CODE");
    const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED_AMOUNT">("PERCENTAGE");
    const [value, setValue] = useState<number>(10);
    const [title, setTitle] = useState<string>("");
    const [code, setCode] = useState<string>("");

    const [state, formAction] = useActionState<ActionState<null>, FormData>(
        createDiscountAction,
        null
    );

    useEffect(() => {
        if (!state) return;

        if (state.ok) {
            toast.success(state.message || "Descuento en pedido creado exitosamente.");
            router.push("/admin/discounts");
        } else if (state.error) {
            toast.error(state.error);
        }
    }, [state, router]);

    return (
        <form action={formAction} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <input type="hidden" name="type" value={discountType} />
            <input type="hidden" name="appliesVia" value={appliesVia} />
            <input type="hidden" name="target" value="ALL_PRODUCTS" />

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
                                        Se aplica automáticamente al subtotal general del carrito.
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
                                placeholder="Ej. 10% de descuento en el subtotal de tu orden"
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

                {/* 2. Regla Específica: Deducción sobre el Subtotal del Pedido */}
                <Card>
                    <CardHeader>
                        <CardTitle>Deducción sobre la Orden Completa</CardTitle>
                        <CardDescription>
                            Especifica si el descuento al subtotal total será por porcentaje o por monto fijo.
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
                                        Resta un porcentaje sobre el subtotal de la compra.
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
                                        Resta un monto en Soles directo del total del pedido.
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
                                placeholder={discountType === "PERCENTAGE" ? "Ej. 10" : "Ej. 30"}
                                required
                                className="text-xs font-mono"
                            />
                            {state?.errors?.value && (
                                <p className="text-xs font-medium text-destructive">
                                    {state.errors.value[0]}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Restricciones y Fechas Base */}
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
                    target="ALL_PRODUCTS"
                />
            </div>
        </form>
    );
}