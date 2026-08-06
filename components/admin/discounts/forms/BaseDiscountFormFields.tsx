// File: frontend/components/admin/discounts/forms/BaseDiscountFormFields.tsx

"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ActionState } from "@/actions/discount-actions";
import { type DiscountAppliesVia } from "@/src/schemas/discount.schema";

interface Props {
    appliesVia: DiscountAppliesVia;
    state: ActionState<null>;
    code?: string;
    onCodeChange?: (val: string) => void;
}

export default function BaseDiscountFormFields({ appliesVia, state, code = "", onCodeChange }: Props) {
    const isAutomatic = appliesVia === "AUTOMATIC";

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Información General</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="code" className="text-xs font-bold">
                            Código del Cupón {!isAutomatic && "*"}
                        </Label>
                        {!isAutomatic ? (
                            <Input
                                id="code"
                                name="code"
                                value={code ?? ""}
                                onChange={(e) => onCodeChange?.(e.target.value.toUpperCase())}
                                placeholder="Ej. LLEVA3PAGA2"
                                maxLength={20}
                                className="text-xs font-mono uppercase"
                            />
                        ) : (
                            <Input
                                id="code"
                                value="Aplica Automáticamente (Sin Código)"
                                disabled
                                className="text-xs bg-muted"
                            />
                        )}
                        {state?.errors?.code && (
                            <p className="text-xs font-medium text-destructive">
                                {state.errors.code[0]}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-xs font-bold">Descripción Interna *</Label>
                        <Input
                            id="description"
                            name="description"
                            defaultValue=""
                            placeholder="Notas administrativas sobre la campaña"
                            required
                            className="text-xs"
                        />
                        {state?.errors?.description && (
                            <p className="text-xs font-medium text-destructive">
                                {state.errors.description[0]}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Restricciones y Fechas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="minPurchaseAmount" className="text-xs font-bold">Monto Mínimo de Compra (S/)</Label>
                            <Input
                                id="minPurchaseAmount"
                                type="number"
                                name="minPurchaseAmount"
                                min="0"
                                step="0.01"
                                defaultValue={0}
                                className="text-xs"
                            />
                            {state?.errors?.minPurchaseAmount && (
                                <p className="text-xs font-medium text-destructive">
                                    {state.errors.minPurchaseAmount[0]}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="usageLimitTotal" className="text-xs font-bold">Límite de Usos Totales (Global)</Label>
                            <Input
                                id="usageLimitTotal"
                                type="number"
                                name="usageLimitTotal"
                                min="1"
                                defaultValue=""
                                placeholder="Ilimitado"
                                className="text-xs"
                            />
                            {state?.errors?.usageLimitTotal && (
                                <p className="text-xs font-medium text-destructive">
                                    {state.errors.usageLimitTotal[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="usageLimitPerCustomer" className="text-xs font-bold">Usos por Cliente *</Label>
                            <Input
                                id="usageLimitPerCustomer"
                                type="number"
                                name="usageLimitPerCustomer"
                                min="1"
                                defaultValue={1}
                                required
                                className="text-xs"
                            />
                            {state?.errors?.usageLimitPerCustomer && (
                                <p className="text-xs font-medium text-destructive">
                                    {state.errors.usageLimitPerCustomer[0]}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="startDate" className="text-xs font-bold">Fecha de Inicio *</Label>
                            <Input
                                id="startDate"
                                type="date"
                                name="startDate"
                                defaultValue={new Date().toISOString().split("T")[0]}
                                required
                                className="text-xs"
                            />
                            {state?.errors?.startDate && (
                                <p className="text-xs font-medium text-destructive">
                                    {state.errors.startDate[0]}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="endDate" className="text-xs font-bold">Fecha de Expiración</Label>
                            <Input
                                id="endDate"
                                type="date"
                                name="endDate"
                                defaultValue=""
                                className="text-xs"
                            />
                            {state?.errors?.endDate && (
                                <p className="text-xs font-medium text-destructive">
                                    {state.errors.endDate[0]}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}