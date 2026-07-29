// File: frontend/components/admin/inventory/AdjustStockModal.tsx
"use client";

import { useState, useTransition } from "react";
import { adjustStockAction } from "@/actions/inventory-actions";
import { InventoryItem } from "@/src/schemas/inventory.schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import * as Typo from "@/components/ui/Typography";

interface Props {
    item: InventoryItem;
}

export default function AdjustStockModal({ item }: Props) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [newStock, setNewStock] = useState<number>(item.stock);
    const [reason, setReason] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (newStock < 0) {
            toast.error("El stock debe ser 0 o superior.");
            return;
        }

        if (!reason.trim()) {
            toast.error("Ingresa un motivo para la auditoría.");
            return;
        }

        startTransition(async () => {
            const res = await adjustStockAction({
                productId: item.productId,
                variantId: item.variantId || undefined,
                newStock: Number(newStock),
                reason: reason.trim(),
            });

            if (res.ok) {
                toast.success(res.message);
                setOpen(false);
            } else {
                toast.error(res.error);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 text-[11px] font-bold">
                    Ajustar
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    {/* asChild evita la renderización anidada <h2><h3>...</h3></h2> */}
                    <DialogTitle asChild>
                        <Typo.H3>Ajuste Manual de Inventario</Typo.H3>
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="bg-muted/40 p-2.5 rounded border border-border/60">
                        <Typo.P className="font-bold text-foreground">{item.nombre}</Typo.P>
                        <Typo.Muted className="font-mono">SKU: {item.sku}</Typo.Muted>
                        <Typo.Muted className="mt-1">Stock Actual: <strong className="text-foreground font-mono">{item.stock} un.</strong></Typo.Muted>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground">Nuevo Stock Disponible</label>
                        <Input
                            type="number"
                            min="0"
                            value={newStock}
                            onChange={(e) => setNewStock(Number(e.target.value))}
                            className="font-mono text-sm"
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground">Motivo del Ajuste (Auditoría)</label>
                        <Input
                            type="text"
                            placeholder="Ej. Compra proveedor / Merma / Recuento físico"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="text-xs"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" size="sm" disabled={isPending}>
                            {isPending ? "Guardando..." : "Guardar Cambio"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}