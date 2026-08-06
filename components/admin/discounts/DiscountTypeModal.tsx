// File: frontend/components/admin/discounts/DiscountTypeModal.tsx

"use client";

import { useRouter } from "next/navigation";
import { Tag, ShoppingCart, Percent, Truck } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DISCOUNT_OPTIONS = [
    {
        title: "Monto de descuento en productos",
        description: "Aplicar descuento a productos o colecciones de productos específicos",
        icon: Tag,
        href: "/admin/discounts/new/amount-products",
    },
    {
        title: "Compra X y obtén Y",
        description: "Ofrecer descuentos o productos bonificados al comprar ítems específicos",
        icon: ShoppingCart,
        href: "/admin/discounts/new/buy-x-get-y",
    },
    {
        title: "Monto de descuento en el pedido",
        description: "Aplicar descuento al monto total del pedido",
        icon: Percent,
        href: "/admin/discounts/new/amount-order",
    },
    {
        title: "Envío gratis",
        description: "Ofrecer costo de envío bonificado en un pedido",
        icon: Truck,
        href: "/admin/discounts/new/free-shipping",
    },
];

export default function DiscountTypeModal({ open, onOpenChange }: Props) {
    const router = useRouter();

    const handleSelectRoute = (href: string) => {
        onOpenChange(false);
        router.push(href);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="text-base font-bold text-foreground">
                        Seleccionar tipo de descuento
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Elige la regla de negocio que aplicará este cupón.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {DISCOUNT_OPTIONS.map((option) => {
                        const Icon = option.icon;
                        return (
                            <button
                                key={option.href}
                                type="button"
                                onClick={() => handleSelectRoute(option.href)}
                                className="flex items-start gap-3 p-4 rounded-lg border border-border bg-background hover:border-primary hover:bg-muted/40 transition-all text-left group"
                            >
                                <div className="p-2 rounded-md bg-muted text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                                    <Icon className="w-4 h-4" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                                        {option.title}
                                    </h4>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                                        {option.description}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
}