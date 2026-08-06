// File: frontend/components/admin/discounts/DiscountSummarySidebar.tsx

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type DiscountTarget, type DiscountAppliesVia } from "@/src/schemas/discount.schema";

interface Props {
    type: "BUY_X_GET_Y" | "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
    appliesVia: DiscountAppliesVia;
    title: string;
    code?: string;
    value?: number;
    target: DiscountTarget;
    rawIdsInput?: string;
    // Props opcionales exclusivas de BXGY
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
}: Props) {
    const isAutomatic = appliesVia === "AUTOMATIC";

    // Formatear texto del alcance del producto
    const renderTargetText = () => {
        switch (target) {
            case "ALL_PRODUCTS": return "en todos los productos del catálogo";
            case "SPECIFIC_PRODUCTS": return "en productos específicos";
            case "SPECIFIC_CATEGORIES": return "en categorías específicas";
            case "SPECIFIC_COLLECTIONS": return "en colecciones específicas";
            case "SPECIFIC_BRANDS": return "en marcas específicas";
            case "SPECIFIC_LINES": return "en líneas específicas de producto";
            default: return "en los productos seleccionados";
        }
    };

    // Formatear texto del beneficio según el tipo de oferta
    const renderBenefitText = () => {
        if (type === "BUY_X_GET_Y") {
            if (getDiscountType === "FREE") return `Lleva ${getQuantity} producto(s) gratis`;
            if (getDiscountType === "PERCENTAGE") return `Lleva ${getQuantity} producto(s) con ${getDiscountValue}% de descuento`;
            return `Lleva ${getQuantity} producto(s) con S/ ${getDiscountValue?.toFixed(2)} de descuento`;
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
        <Card className="select-none">
            <CardHeader className="pb-3 border-b">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Resumen
                </CardTitle>
            </CardHeader>

            <CardContent className="pt-4 space-y-4 text-xs">
                <div className="space-y-1">
                    <p className="font-bold text-sm text-foreground">
                        {isAutomatic
                            ? title || "Título de la promoción"
                            : code || "CÓDIGO_PROMOCIONAL"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                        {isAutomatic ? "Promoción Automática" : "Código de Descuento Manual"}
                    </p>
                </div>

                <div className="border-t pt-3 space-y-3">
                    {type === "BUY_X_GET_Y" ? (
                        <>
                            <div>
                                <span className="font-semibold text-foreground block">
                                    Compra mínima
                                </span>
                                <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                                    Compra {buyQuantity} unidad(es) {renderTargetText()}.
                                </p>
                            </div>

                            <div>
                                <span className="font-semibold text-foreground block">
                                    Beneficio obtenido
                                </span>
                                <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
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
                            <span className="font-semibold text-foreground block">
                                Detalle del Descuento
                            </span>
                            <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                                {renderBenefitText()}
                            </p>
                        </div>
                    )}
                </div>

                <div className="border-t pt-3 text-[11px] text-muted-foreground">
                    <p>
                        Se aplicará en el carrito y checkout si se cumplen todas las condiciones.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}