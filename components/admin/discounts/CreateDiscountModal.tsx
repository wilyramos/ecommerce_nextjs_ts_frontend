// File: frontend/components/admin/discounts/CreateDiscountModal.tsx
"use client";

import { useState, useTransition } from "react";
import { createDiscountAction } from "@/actions/discount-actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import * as Typo from "@/components/ui/Typography";

export default function CreateDiscountModal() {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const [code, setCode] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState<"PERCENTAGE" | "FIXED_AMOUNT">("PERCENTAGE");
    const [value, setValue] = useState<number>(10);
    const [minPurchaseAmount, setMinPurchaseAmount] = useState<number>(0);
    const [usageLimitTotal, setUsageLimitTotal] = useState<string>("");
    const [usageLimitPerCustomer, setUsageLimitPerCustomer] = useState<number>(1);
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [endDate, setEndDate] = useState<string>("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!code.trim()) {
            toast.error("Ingresa el código del cupón.");
            return;
        }

        startTransition(async () => {
            const res = await createDiscountAction({
                code: code.toUpperCase().trim(),
                description: description.trim(),
                type,
                value: Number(value),
                target: "ALL_PRODUCTS",
                minPurchaseAmount: Number(minPurchaseAmount),
                usageLimitTotal: usageLimitTotal ? Number(usageLimitTotal) : null,
                usageLimitPerCustomer: Number(usageLimitPerCustomer),
                startDate,
                endDate: endDate || null,
            });

            if (res.ok) {
                toast.success(res.message);
                setOpen(false);
                setCode("");
                setDescription("");
                setValue(10);
                setMinPurchaseAmount(0);
                setUsageLimitTotal("");
            } else {
                toast.error(res.error);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="h-8 text-xs font-bold">
                    Crear Cupón
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle asChild>
                        <Typo.H3>Nuevo Cupón de Descuento</Typo.H3>
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-foreground">Código</label>
                            <Input
                                type="text"
                                placeholder="Ej. BIENVENIDA10"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                className="font-mono text-xs uppercase"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-foreground">Tipo de Descuento</label>
                            <Select value={type} onValueChange={(val: "PERCENTAGE" | "FIXED_AMOUNT") => setType(val)}>
                                <SelectTrigger className="h-9 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PERCENTAGE">Porcentaje (%)</SelectItem>
                                    <SelectItem value="FIXED_AMOUNT">Monto Fijo (S/)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-foreground">Descripción / Nombre Interno</label>
                        <Input
                            type="text"
                            placeholder="Ej. 10% de descuento por primera compra"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="text-xs"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-foreground">
                                Valor ({type === "PERCENTAGE" ? "%" : "S/"})
                            </label>
                            <Input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={value}
                                onChange={(e) => setValue(Number(e.target.value))}
                                className="font-mono text-xs"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-foreground">Compra Mínima (S/)</label>
                            <Input
                                type="number"
                                min="0"
                                value={minPurchaseAmount}
                                onChange={(e) => setMinPurchaseAmount(Number(e.target.value))}
                                className="font-mono text-xs"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-foreground">Usos Totales (Opcional)</label>
                            <Input
                                type="number"
                                min="1"
                                placeholder="Ilimitado"
                                value={usageLimitTotal}
                                onChange={(e) => setUsageLimitTotal(e.target.value)}
                                className="font-mono text-xs"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-foreground">Usos por Cliente</label>
                            <Input
                                type="number"
                                min="1"
                                value={usageLimitPerCustomer}
                                onChange={(e) => setUsageLimitPerCustomer(Number(e.target.value))}
                                className="font-mono text-xs"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-foreground">Fecha Inicio</label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="text-xs"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-foreground">Fecha Fin (Opcional)</label>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="text-xs"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-border">
                        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" size="sm" disabled={isPending}>
                            {isPending ? "Guardando..." : "Guardar Cupón"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}