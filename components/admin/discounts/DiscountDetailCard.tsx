// File: frontend/components/admin/discounts/DiscountDetailCard.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DiscountToggleStatusButton from "./DiscountToggleStatusButton";
import DiscountDeleteButton from "./DiscountDeleteButton";
import { type DiscountResponse, type DiscountAnalyticsResponse } from "@/src/schemas/discount.schema";

interface Props {
    discount: DiscountResponse;
    analytics?: DiscountAnalyticsResponse | null;
}

export default function DiscountDetailCard({ discount, analytics }: Props) {
    const router = useRouter();
    const [copied, setCopied] = useState(false);

    const isAutomatic = discount.appliesVia === "AUTOMATIC";

    const handleCopyCode = () => {
        if (!discount.code) return;
        navigator.clipboard.writeText(discount.code);
        setCopied(true);
        toast.success("Código copiado al portapapeles");
        setTimeout(() => setCopied(false), 2000);
    };

    const usagePercent = discount.usageLimitTotal
        ? Math.min(100, Math.round((discount.currentUsageCount / discount.usageLimitTotal) * 100))
        : null;

    const formatTipo = (type: string) => {
        switch (type) {
            case "BUY_X_GET_Y": return "Compra X y Obtén Y (BXGY)";
            case "PERCENTAGE": return "Porcentaje de Descuento";
            case "FIXED_AMOUNT": return "Monto Fijo de Descuento";
            case "FREE_SHIPPING": return "Envío Gratuito";
            default: return type;
        }
    };

    return (
        <div className="space-y-6">
            {/* Tarjeta Principal y Acciones Atómicas */}
            <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={isAutomatic ? "secondary" : "outline"}>
                                {isAutomatic ? "Promoción Automática" : "Cupón por Código"}
                            </Badge>
                            <Badge variant={discount.isActive ? "default" : "destructive"}>
                                {discount.isActive ? "Activo" : "Inactivo"}
                            </Badge>
                        </div>
                        <CardTitle>{discount.title}</CardTitle>
                        <CardDescription>{discount.description || "Sin descripción corta registrada."}</CardDescription>
                    </div>

                    {/* Botones Atómicos de Gestión de Estado y Eliminación */}
                    <div className="flex items-center gap-2 pt-2 sm:pt-0">
                        <DiscountToggleStatusButton
                            id={discount._id}
                            isActive={discount.isActive}
                        />

                        <DiscountDeleteButton
                            id={discount._id}
                            title={discount.title}
                        />
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {!isAutomatic && discount.code && (
                        <div className="flex items-center justify-between bg-muted p-3 rounded-md border">
                            <div className="space-y-0.5">
                                <span className="text-[11px] text-muted-foreground uppercase font-semibold block">
                                    Código del Cupón
                                </span>
                                <code className="font-mono text-base font-bold text-foreground">
                                    {discount.code}
                                </code>
                            </div>
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={handleCopyCode}
                            >
                                {copied ? "Copiado" : "Copiar Código"}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Métrica de Auditoría y Ventas */}
            {analytics && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader>
                            <CardDescription>Órdenes Generadas</CardDescription>
                            <CardTitle className="font-mono text-xl">{analytics.ordersPlaced}</CardTitle>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardDescription>Ingresos Generados</CardDescription>
                            <CardTitle className="font-mono text-xl">S/ {analytics.revenueGenerated.toFixed(2)}</CardTitle>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardDescription>Descuentos Otorgados</CardDescription>
                            <CardTitle className="font-mono text-xl">S/ {analytics.discountsGiven.toFixed(2)}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>
            )}

            {/* Configuración de la Regla de Descuento */}
            {discount.type === "BUY_X_GET_Y" && discount.bxgyConfig && (
                <Card>
                    <CardHeader>
                        <CardTitle>Configuración Compra X y Obtén Y</CardTitle>
                        <CardDescription>Reglas de bonificación aplicadas al carrito</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-muted/40 p-3 rounded-md border space-y-1">
                            <span className="text-[11px] font-semibold text-muted-foreground uppercase block">
                                Requisito de Compra (X)
                            </span>
                            <span className="text-sm font-bold text-foreground">
                                Comprar {discount.bxgyConfig.buyQuantity} unidad(es)
                            </span>
                        </div>

                        <div className="bg-muted/40 p-3 rounded-md border space-y-1">
                            <span className="text-[11px] font-semibold text-muted-foreground uppercase block">
                                Beneficio Obtenido (Y)
                            </span>
                            <span className="text-sm font-bold text-foreground">
                                Lleva {discount.bxgyConfig.getQuantity} unidad(es){" "}
                                {discount.bxgyConfig.getDiscountType === "FREE"
                                    ? "Gratis (100%)"
                                    : discount.bxgyConfig.getDiscountType === "PERCENTAGE"
                                        ? `con ${discount.bxgyConfig.getDiscountValue}% de descuento`
                                        : `con S/ ${discount.bxgyConfig.getDiscountValue} de descuento`}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Ficha Técnica: Capacidad, Cobertura y Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Capacidad y Límites de Uso</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-xs">
                        <div className="flex justify-between py-1.5 border-b">
                            <span className="text-muted-foreground">Usos Actuales:</span>
                            <span className="font-mono font-bold text-foreground">{discount.currentUsageCount}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b">
                            <span className="text-muted-foreground">Límite Global:</span>
                            <span className="font-mono font-bold text-foreground">{discount.usageLimitTotal ?? "Ilimitado"}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b">
                            <span className="text-muted-foreground">Usos por Cliente:</span>
                            <span className="font-mono font-bold text-foreground">{discount.usageLimitPerCustomer} uso(s)</span>
                        </div>

                        {usagePercent !== null && (
                            <div className="space-y-1 pt-2">
                                <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
                                    <span>Capacidad Consumida</span>
                                    <span>{usagePercent}%</span>
                                </div>
                                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-primary h-full transition-all"
                                        style={{ width: `${usagePercent}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Cobertura y Fechas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-xs">
                        <div className="flex justify-between py-1.5 border-b">
                            <span className="text-muted-foreground">Tipo de Oferta:</span>
                            <span className="font-semibold text-foreground">{formatTipo(discount.type)}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b">
                            <span className="text-muted-foreground">Compra Mínima:</span>
                            <span className="font-mono font-bold text-foreground">
                                {discount.minPurchaseAmount > 0
                                    ? `S/ ${discount.minPurchaseAmount.toFixed(2)}`
                                    : "Sin Mínimo"}
                            </span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b">
                            <span className="text-muted-foreground">Fecha de Inicio:</span>
                            <span className="font-mono text-foreground">{new Date(discount.startDate).toLocaleDateString("es-PE")}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b">
                            <span className="text-muted-foreground">Fecha de Expiración:</span>
                            <span className="font-mono text-foreground">
                                {discount.endDate
                                    ? new Date(discount.endDate).toLocaleDateString("es-PE")
                                    : "Sin Expiración"}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Navegación */}
            <div className="flex justify-start">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/discounts")}
                >
                    Volver a la Lista
                </Button>
            </div>
        </div>
    );
}