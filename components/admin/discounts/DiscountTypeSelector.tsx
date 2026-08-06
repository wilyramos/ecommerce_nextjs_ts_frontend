// File: frontend/components/admin/discounts/DiscountTypeSelector.tsx

"use client";

import { Tag, ShoppingCart, Percent, Truck } from "lucide-react";

export type DiscountOptionType = 
    | "PRODUCTS_AMOUNT"  // Monto de descuento en productos
    | "BUY_X_GET_Y"      // Compra X y obtén Y
    | "ORDER_AMOUNT"     // Monto de descuento en el pedido
    | "FREE_SHIPPING";   // Envío gratis

interface Props {
    onSelect: (selectedOption: DiscountOptionType) => void;
}

const DISCOUNT_OPTIONS = [
    {
        id: "PRODUCTS_AMOUNT" as DiscountOptionType,
        title: "Monto de descuento en productos",
        description: "Aplicar descuento a productos o colecciones de productos específicos",
        icon: Tag,
    },
    {
        id: "BUY_X_GET_Y" as DiscountOptionType,
        title: "Compra X y obtén Y",
        description: "Ofrecer descuentos o productos bonificados al comprar productos específicos",
        icon: ShoppingCart,
    },
    {
        id: "ORDER_AMOUNT" as DiscountOptionType,
        title: "Monto de descuento en el pedido",
        description: "Aplicar descuento al monto total del pedido en el checkout",
        icon: Percent,
    },
    {
        id: "FREE_SHIPPING" as DiscountOptionType,
        title: "Envío gratis",
        description: "Ofrecer costo de envío bonificado en una orden",
        icon: Truck,
    },
];

export default function DiscountTypeSelector({ onSelect }: Props) {
    return (
        <div className="space-y-4">
            <h2 className="text-sm font-bold text-foreground">
                Selecciona el tipo de descuento que deseas crear
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DISCOUNT_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    return (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => onSelect(option.id)}
                            className="flex items-start gap-4 p-5 rounded-lg border border-border bg-card hover:border-primary hover:shadow-md transition-all text-left group"
                        >
                            <div className="p-2.5 rounded-md bg-muted text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                                    {option.title}
                                </h3>
                                <p className="text-[11px] text-muted-foreground leading-relaxed">
                                    {option.description}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}