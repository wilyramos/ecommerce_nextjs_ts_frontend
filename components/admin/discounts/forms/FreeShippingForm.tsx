// File: frontend/components/admin/discounts/forms/FreeShippingForm.tsx

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

export default function FreeShippingForm() {
    const router = useRouter();

    const [appliesVia, setAppliesVia] = useState<DiscountAppliesVia>("CODE");
    const [title, setTitle] = useState<string>("");
    const [code, setCode] = useState<string>("");

    const [state, formAction] = useActionState<ActionState<null>, FormData>(
        createDiscountAction,
        null
    );

    useEffect(() => {
        if (!state) return;

        if (state.ok) {
            toast.success(state.message || "Promoción de envío gratis creada exitosamente.");
            router.push("/admin/discounts");
        } else if (state.error) {
            toast.error(state.error);
        }
    }, [state, router]);

    return (
        <form action={formAction} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <input type="hidden" name="type" value="FREE_SHIPPING" />
            <input type="hidden" name="appliesVia" value={appliesVia} />
            <input type="hidden" name="target" value="ALL_PRODUCTS" />
            <input type="hidden" name="value" value="0" />

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
                                        El cliente ingresa un código para bonificar el flete.
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
                                        Se aplica automáticamente al flete al cumplir la condición.
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
                                placeholder="Ej. Envío Gratis en compras mayores a S/ 200"
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

                {/* 2. Beneficio de Envío Gratis */}
                <Card>
                    <CardHeader>
                        <CardTitle>Beneficio de Flete Bonificado</CardTitle>
                        <CardDescription>
                            Esta promoción bonificará el 100% del costo de envío cuando la compra cumpla las restricciones configuradas.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Label htmlFor="effect" className="text-xs font-bold">Efecto Aplicado en el Checkout</Label>
                        <Input
                            id="effect"
                            type="text"
                            value="Costo de Envío: S/ 0.00 (100% Bonificado)"
                            disabled
                            className="text-xs bg-muted/40 cursor-not-allowed font-medium text-foreground"
                        />
                    </CardContent>
                </Card>

                {/* 3. Restricciones Generales y Fechas */}
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
                    type="FREE_SHIPPING"
                    appliesVia={appliesVia}
                    title={title}
                    code={code}
                    value={0}
                    target="ALL_PRODUCTS"
                />
            </div>
        </form>
    );
}