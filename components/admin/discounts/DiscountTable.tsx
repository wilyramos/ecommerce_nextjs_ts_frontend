// File: frontend/components/admin/discounts/DiscountTable.tsx
"use client";

import { useTransition } from "react";
import { Table, Tr, Th, Td } from "@/components/ui/Typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type DiscountResponse } from "@/src/schemas/discount.schema";
import { toggleDiscountStatusAction, deleteDiscountAction } from "@/actions/discount-actions";
import { toast } from "sonner";

interface Props {
    discounts: DiscountResponse[];
}

export default function DiscountTable({ discounts }: Props) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = (id: string) => {
        startTransition(async () => {
            const res = await toggleDiscountStatusAction(id);
            if (res.ok) {
                toast.success(res.message);
            } else {
                toast.error(res.error);
            }
        });
    };

    const handleDelete = (id: string, code: string) => {
        if (!confirm(`¿Eliminar permanentemente el cupón ${code}?`)) return;

        startTransition(async () => {
            const res = await deleteDiscountAction(id);
            if (res.ok) {
                toast.success(res.message);
            } else {
                toast.error(res.error);
            }
        });
    };

    if (discounts.length === 0) {
        return (
            <div className="py-12 text-center text-muted-foreground text-xs">
                No se encontraron cupones registrados.
            </div>
        );
    }

    return (
        <Table>
            <thead>
                <Tr>
                    <Th>Código / Descripción</Th>
                    <Th>Descuento</Th>
                    <Th>Condición</Th>

                    <Th>Usos</Th>
                    <Th>Vigencia</Th>
                    <Th>Estado</Th>
                    <Th className="text-right">Acciones</Th>
                </Tr>
            </thead>
            <tbody>
                {discounts.map((disc) => {
                    const isPercentage = disc.type === "PERCENTAGE";
                    const formattedValue = isPercentage ? `${disc.value}%` : `S/ ${disc.value.toFixed(2)}`;

                    return (
                        <Tr key={disc._id}>
                            <Td>
                                <div className="flex flex-col">
                                    <code className="font-mono text-xs font-bold text-foreground select-all w-fit">
                                        {disc.code}
                                    </code>
                                    <span className="text-[11px] text-muted-foreground">{disc.description}</span>
                                </div>
                            </Td>
                            <Td>
                                <span className="font-mono font-bold text-xs text-foreground">{formattedValue}</span>
                            </Td>
                            <Td>
                                <span className="text-xs font-mono">
                                    {disc.minPurchaseAmount > 0 ? `Min S/ ${disc.minPurchaseAmount.toFixed(2)}` : "Sin mínimo"}
                                </span>
                            </Td>
                            <Td>
                                <span className="font-mono text-xs">
                                    {disc.currentUsageCount} / {disc.usageLimitTotal ?? "∞"}
                                </span>
                            </Td>
                            <Td>
                                <div className="flex flex-col text-[11px] font-mono text-muted-foreground">
                                    <span>Desde: {new Date(disc.startDate).toLocaleDateString("es-PE")}</span>
                                    <span>
                                        Hasta: {disc.endDate ? new Date(disc.endDate).toLocaleDateString("es-PE") : "Sin expiración"}
                                    </span>
                                </div>
                            </Td>
                            <Td>
                                {disc.isActive ? (
                                    <Badge variant="success" size="sm" className="font-bold uppercase">
                                        Activo
                                    </Badge>
                                ) : (
                                    <Badge variant="neutral" size="sm" className="font-bold uppercase">
                                        Inactivo
                                    </Badge>
                                )}
                            </Td>
                            <Td className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleToggle(disc._id)}
                                        disabled={isPending}
                                        className="h-7 text-[11px] font-bold"
                                    >
                                        {disc.isActive ? "Desactivar" : "Activar"}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(disc._id, disc.code)}
                                        disabled={isPending}
                                        className="h-7 text-[11px] font-bold text-destructive hover:text-destructive"
                                    >
                                        Eliminar
                                    </Button>
                                </div>
                            </Td>
                        </Tr>
                    );
                })}
            </tbody>
        </Table>
    );
}