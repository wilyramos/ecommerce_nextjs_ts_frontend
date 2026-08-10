// File: frontend/components/admin/discounts/DiscountDetailCard.tsx
"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import DiscountToggleStatusButton from "./DiscountToggleStatusButton";
import DiscountDeleteButton from "./DiscountDeleteButton";

import { AdminCard } from "@/components/admin/layout/admin-card";
import { AdminStatCard } from "@/components/admin/layout/admin-stat-card";
import { AdminDescriptionList } from "@/components/admin/layout/admin-description-list";
import { AdminResourceItem } from "@/components/admin/layout/admin-resource-item";
import { AdminCodeBlock } from "@/components/admin/layout/admin-code-block";

import { type DiscountResponse, type DiscountAnalyticsResponse } from "@/src/schemas/discount.schema";

interface Props {
    discount: DiscountResponse;
    analytics?: DiscountAnalyticsResponse | null;
}

export default function DiscountDetailCard({ discount, analytics }: Props) {
    const router = useRouter();
    const isAutomatic = discount.appliesVia === "AUTOMATIC";

    const usagePercent = discount.usageLimitTotal
        ? Math.min(100, Math.round((discount.currentUsageCount / discount.usageLimitTotal) * 100))
        : null;

    const formatTipo = (type: string) => {
        switch (type) {
            case "BUY_X_GET_Y": return "Compra X y Obtén Y (BXGY)";
            case "PERCENTAGE": return "Porcentaje (%)";
            case "FIXED_AMOUNT": return "Monto Fijo (S/)";
            case "FREE_SHIPPING": return "Envío Gratuito";
            default: return type;
        }
    };

    return (
        <div className="space-y-4 text-xs">
            {/* Header Principal */}
            <AdminCard bodyClassName="p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-zinc-100 pb-3">
                    <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                            <Badge variant={isAutomatic ? "secondary" : "outline"} className="text-[10px] h-5 px-1.5 font-medium">
                                {isAutomatic ? "Promoción Automática" : "Cupón por Código"}
                            </Badge>
                            <Badge variant={discount.isActive ? "default" : "destructive"} className="text-[10px] h-5 px-1.5 font-medium">
                                {discount.isActive ? "Activo" : "Inactivo"}
                            </Badge>
                        </div>
                        <h2 className="text-base font-bold text-zinc-900 tracking-tight leading-snug">{discount.title}</h2>
                        <p className="text-xs text-zinc-500">{discount.description || "Sin descripción corta registrada."}</p>
                    </div>

                    <div className="flex items-center gap-1.5 self-start sm:self-center">
                        <DiscountToggleStatusButton id={discount._id} isActive={discount.isActive} />
                        <DiscountDeleteButton id={discount._id} title={discount.title} />
                    </div>
                </div>

                {!isAutomatic && discount.code && (
                    <AdminCodeBlock label="Código" code={discount.code} />
                )}
            </AdminCard>

            {/* Métricas Reutilizables */}
            {analytics && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <AdminStatCard label="Órdenes Generadas" value={analytics.ordersPlaced} />
                    <AdminStatCard label="Ingresos Generados" value={`S/ ${analytics.revenueGenerated.toFixed(2)}`} />
                    <AdminStatCard label="Descuentos Otorgados" value={`S/ ${analytics.discountsGiven.toFixed(2)}`} />
                </div>
            )}

            {/* Configuración BXGY */}
            {discount.type === "BUY_X_GET_Y" && discount.bxgyConfig && (
                <AdminCard title="Configuración Compra X y Obtén Y" bodyClassName="p-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="bg-zinc-50/80 p-2.5 rounded-md border border-zinc-200/70">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Requisito (X)</span>
                            <span className="text-xs font-bold text-zinc-900 mt-0.5 block">
                                Comprar {discount.bxgyConfig.buyQuantity} unidad(es)
                            </span>
                        </div>

                        <div className="bg-zinc-50/80 p-2.5 rounded-md border border-zinc-200/70">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Beneficio (Y)</span>
                            <span className="text-xs font-bold text-zinc-900 mt-0.5 block">
                                Lleva {discount.bxgyConfig.getQuantity} unidad(es){" "}
                                {discount.bxgyConfig.getDiscountType === "FREE"
                                    ? "Gratis (100%)"
                                    : discount.bxgyConfig.getDiscountType === "PERCENTAGE"
                                        ? `con ${discount.bxgyConfig.getDiscountValue}% OFF`
                                        : `con S/ ${discount.bxgyConfig.getDiscountValue} OFF`}
                            </span>
                        </div>
                    </div>
                </AdminCard>
            )}

            {/* Productos Elegibles */}
            {discount.target === "SPECIFIC_PRODUCTS" && discount.applicableProductsDetails && discount.applicableProductsDetails.length > 0 && (
                <AdminCard title="Productos Elegibles (Compra)" bodyClassName="p-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {discount.applicableProductsDetails.map((product) => (
                            <AdminResourceItem
                                key={product._id}
                                title={product.nombre}
                                subtitle={product.sku ? `SKU: ${product.sku}` : undefined}
                                imageUrl={product.imagenes?.[0]}
                                price={product.precio}
                            />
                        ))}
                    </div>
                </AdminCard>
            )}

            {/* Productos de Regalo */}
            {discount.type === "BUY_X_GET_Y" && discount.bxgyConfig?.getProducts && discount.giftProductsDetails && discount.giftProductsDetails.length > 0 && (
                <AdminCard title="Productos de Regalo (Beneficio)" bodyClassName="p-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {discount.giftProductsDetails.map((product) => (
                            <AdminResourceItem
                                key={product._id}
                                title={product.nombre}
                                subtitle={product.sku ? `SKU: ${product.sku}` : undefined}
                                imageUrl={product.imagenes?.[0]}
                                price={product.precio}
                                badge={
                                    <Badge variant="secondary" className="text-[9px] h-4 px-1 bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold">
                                        Regalo
                                    </Badge>
                                }
                            />
                        ))}
                    </div>
                </AdminCard>
            )}

            {/* Ficha Técnica: Capacidad y Cobertura */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <AdminCard title="Capacidad y Límites de Uso" bodyClassName="p-3">
                    <div className="space-y-2">
                        <AdminDescriptionList
                            items={[
                                { label: "Usos Actuales", value: discount.currentUsageCount, isMono: true },
                                { label: "Límite Global", value: discount.usageLimitTotal ?? "Ilimitado", isMono: true },
                                { label: "Usos por Cliente", value: `${discount.usageLimitPerCustomer} uso(s)`, isMono: true },
                            ]}
                        />
                        {usagePercent !== null && (
                            <div className="space-y-1 pt-1.5 border-t border-zinc-100">
                                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                                    <span>Capacidad Consumida</span>
                                    <span>{usagePercent}%</span>
                                </div>
                                <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-zinc-900 h-full transition-all" style={{ width: `${usagePercent}%` }} />
                                </div>
                            </div>
                        )}
                    </div>
                </AdminCard>

                <AdminCard title="Cobertura y Fechas" bodyClassName="p-3">
                    <AdminDescriptionList
                        items={[
                            { label: "Tipo de Oferta", value: formatTipo(discount.type) },
                            {
                                label: "Compra Mínima",
                                value: discount.minPurchaseAmount > 0 ? `S/ ${discount.minPurchaseAmount.toFixed(2)}` : "Sin Mínimo",
                                isMono: true,
                            },
                            {
                                label: "Fecha de Inicio",
                                value: new Date(discount.startDate).toLocaleDateString("es-PE"),
                                isMono: true,
                            },
                            {
                                label: "Fecha Expiración",
                                value: discount.endDate ? new Date(discount.endDate).toLocaleDateString("es-PE") : "Sin Expiración",
                                isMono: true,
                            },
                        ]}
                    />
                </AdminCard>
            </div>

            <div className="flex justify-start pt-1">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/discounts")}
                    className="h-8 text-xs font-medium"
                >
                    Volver a la Lista
                </Button>
            </div>
        </div>
    );
}