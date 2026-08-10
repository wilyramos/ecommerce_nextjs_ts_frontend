"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminCard } from "@/components/admin/layout/admin-card";
import { type ActionState } from "@/actions/discount-actions";
import { type DiscountAppliesVia } from "@/src/schemas/discount.schema";

interface BaseDiscountFormFieldsProps {
    appliesVia: DiscountAppliesVia;
    state: ActionState<null>;
    code?: string;
    onCodeChange?: (val: string) => void;
}

export default function BaseDiscountFormFields({
    appliesVia,
    state,
    code = "",
    onCodeChange,
}: BaseDiscountFormFieldsProps) {
    const isAutomatic = appliesVia === "AUTOMATIC";

    return (
        <div className="space-y-4">
            {/* Información General */}
            <AdminCard title="Información General">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <Label htmlFor="code" className="text-[11px] font-semibold text-zinc-800">
                            Código del Cupón {!isAutomatic && "*"}
                        </Label>
                        {!isAutomatic ? (
                            <Input
                                id="code"
                                name="code"
                                value={code}
                                onChange={(e) => onCodeChange?.(e.target.value.toUpperCase())}
                                placeholder="Ej. LLEVA3PAGA2"
                                maxLength={20}
                                className="h-8 text-xs font-mono uppercase bg-white border-zinc-200"
                            />
                        ) : (
                            <Input
                                id="code"
                                value="Aplica Automáticamente (Sin Código)"
                                disabled
                                className="h-8 text-xs bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed"
                            />
                        )}
                        {state?.errors?.code && (
                            <p className="text-[10px] font-medium text-red-500">
                                {state.errors.code[0]}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="description" className="text-[11px] font-semibold text-zinc-800">
                            Descripción Interna *
                        </Label>
                        <Input
                            id="description"
                            name="description"
                            defaultValue=""
                            placeholder="Notas administrativas sobre la campaña"
                            required
                            className="h-8 text-xs bg-white border-zinc-200"
                        />
                        {state?.errors?.description && (
                            <p className="text-[10px] font-medium text-red-500">
                                {state.errors.description[0]}
                            </p>
                        )}
                    </div>
                </div>
            </AdminCard>

            {/* Restricciones y Fechas */}
            <AdminCard title="Restricciones y Fechas">
                <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label htmlFor="minPurchaseAmount" className="text-[11px] font-semibold text-zinc-800">
                                Monto Mínimo de Compra (S/)
                            </Label>
                            <Input
                                id="minPurchaseAmount"
                                type="number"
                                name="minPurchaseAmount"
                                min="0"
                                step="0.01"
                                defaultValue={0}
                                className="h-8 text-xs bg-white border-zinc-200"
                            />
                            {state?.errors?.minPurchaseAmount && (
                                <p className="text-[10px] font-medium text-red-500">
                                    {state.errors.minPurchaseAmount[0]}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="usageLimitTotal" className="text-[11px] font-semibold text-zinc-800">
                                Límite de Usos Totales (Global)
                            </Label>
                            <Input
                                id="usageLimitTotal"
                                type="number"
                                name="usageLimitTotal"
                                min="1"
                                defaultValue=""
                                placeholder="Ilimitado"
                                className="h-8 text-xs bg-white border-zinc-200"
                            />
                            {state?.errors?.usageLimitTotal && (
                                <p className="text-[10px] font-medium text-red-500">
                                    {state.errors.usageLimitTotal[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1">
                            <Label htmlFor="usageLimitPerCustomer" className="text-[11px] font-semibold text-zinc-800">
                                Usos por Cliente *
                            </Label>
                            <Input
                                id="usageLimitPerCustomer"
                                type="number"
                                name="usageLimitPerCustomer"
                                min="1"
                                defaultValue={1}
                                required
                                className="h-8 text-xs bg-white border-zinc-200"
                            />
                            {state?.errors?.usageLimitPerCustomer && (
                                <p className="text-[10px] font-medium text-red-500">
                                    {state.errors.usageLimitPerCustomer[0]}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="startDate" className="text-[11px] font-semibold text-zinc-800">
                                Fecha de Inicio *
                            </Label>
                            <Input
                                id="startDate"
                                type="date"
                                name="startDate"
                                defaultValue={new Date().toISOString().split("T")[0]}
                                required
                                className="h-8 text-xs bg-white border-zinc-200"
                            />
                            {state?.errors?.startDate && (
                                <p className="text-[10px] font-medium text-red-500">
                                    {state.errors.startDate[0]}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="endDate" className="text-[11px] font-semibold text-zinc-800">
                                Fecha de Expiración
                            </Label>
                            <Input
                                id="endDate"
                                type="date"
                                name="endDate"
                                defaultValue=""
                                className="h-8 text-xs bg-white border-zinc-200"
                            />
                            {state?.errors?.endDate && (
                                <p className="text-[10px] font-medium text-red-500">
                                    {state.errors.endDate[0]}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </AdminCard>
        </div>
    );
}