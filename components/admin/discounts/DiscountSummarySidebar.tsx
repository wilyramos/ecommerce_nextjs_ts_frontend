"use client";

import { AdminCard } from "@/components/admin/layout/admin-card";
import { type DiscountTarget, type DiscountAppliesVia } from "@/src/schemas/discount.schema";

interface DiscountSummarySidebarProps {
    type: "BUY_X_GET_Y" | "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
    appliesVia: DiscountAppliesVia;
    title: string;
    code?: string;
    value?: number;
    target: DiscountTarget;
    rawIdsInput?: string;
    buyQuantity?: number;
    getQuantity?: number;
    getDiscountType?: string;
    getDiscountValue?: number;
    getProductsTarget?: "SAME_AS_BUY" | "SPECIFIC_PRODUCTS";
    getProductsRawInput?: string;
}

export default function DiscountSummarySidebar({
    type,
    appliesVia,
    title,
    code,
    value = 0,
    buyQuantity = 1,
    target,
    getQuantity = 1,
    getDiscountType = "FREE",
    getDiscountValue = 100,
    getProductsTarget = "SAME_AS_BUY",
}: DiscountSummarySidebarProps) {
    const isAutomatic = appliesVia === "AUTOMATIC";

    const renderTargetText = () => {
        switch (target) {
            case "ALL_PRODUCTS":
                return "en todos los productos del catálogo";
            case "SPECIFIC_PRODUCTS":
                return "en productos específicos";
            case "SPECIFIC_CATEGORIES":
                return "en categorías específicas";
            case "SPECIFIC_COLLECTIONS":
                return "en colecciones específicas";
            case "SPECIFIC_BRANDS":
                return "en marcas específicas";
            case "SPECIFIC_LINES":
                return "en líneas específicas de producto";
            default:
                return "en los productos seleccionados";
        }
    };

    const renderBenefitText = () => {
        if (type === "BUY_X_GET_Y") {
            if (getDiscountType === "FREE") {
                return `Lleva ${getQuantity} producto(s) gratis`;
            }
            if (getDiscountType === "PERCENTAGE") {
                return `Lleva ${getQuantity} producto(s) con ${getDiscountValue}% OFF`;
            }
            return `Lleva ${getQuantity} producto(s) con S/ ${getDiscountValue?.toFixed(2)} OFF`;
        }

        if (type === "PERCENTAGE") {
            return `${value}% de descuento ${renderTargetText()}`;
        }

        if (type === "FIXED_AMOUNT") {
            return `S/ ${value.toFixed(2)} de descuento ${renderTargetText()}`;
        }

        if (type === "FREE_SHIPPING") {
            return "Envío Gratuito en la orden";
        }

        return "";
    };

    return (
        <AdminCard title="Resumen" className="select-none bg-zinc-50/60 border-zinc-200/80">
            <div className="space-y-3 text-[11px]">
                <div className="space-y-0.5">
                    <p className="font-bold text-xs text-zinc-900 truncate">
                        {isAutomatic
                            ? title || "Título de la promoción"
                            : code || "CÓDIGO_PROMOCIONAL"}
                    </p>
                    <p className="text-[10px] text-zinc-500 font-medium">
                        {isAutomatic ? "Promoción Automática" : "Código de Descuento Manual"}
                    </p>
                </div>

                <div className="border-t border-zinc-200/80 pt-2.5 space-y-2.5">
                    {type === "BUY_X_GET_Y" ? (
                        <>
                            <div>
                                <span className="font-semibold text-zinc-900 block leading-tight">
                                    Requisito de compra
                                </span>
                                <p className="text-[10px] text-zinc-500 leading-tight mt-0.5">
                                    Compra {buyQuantity} unidad(es) {renderTargetText()}.
                                </p>
                            </div>

                            <div>
                                <span className="font-semibold text-zinc-900 block leading-tight">
                                    Beneficio asignado
                                </span>
                                <p className="text-[10px] text-zinc-500 leading-tight mt-0.5">
                                    {renderBenefitText()}{" "}
                                    {getProductsTarget === "SAME_AS_BUY"
                                        ? "(de la misma lista elegible)"
                                        : "(de la lista de regalos específicos)"}
                                    .
                                </p>
                            </div>
                        </>
                    ) : (
                        <div>
                            <span className="font-semibold text-zinc-900 block leading-tight">
                                Detalle del Descuento
                            </span>
                            <p className="text-[10px] text-zinc-500 leading-tight mt-0.5">
                                {renderBenefitText()}
                            </p>
                        </div>
                    )}
                </div>

                <div className="border-t border-zinc-200/80 pt-2 text-[10px] text-zinc-400 leading-tight">
                    <p>Se aplicará en carrito y checkout si se cumplen los criterios.</p>
                </div>
            </div>
        </AdminCard>
    );
}