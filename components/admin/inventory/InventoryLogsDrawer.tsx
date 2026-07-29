// File: frontend/components/admin/inventory/InventoryLogsDrawer.tsx
"use client";

import { useState, useTransition } from "react";
import { getInventoryLogsAction } from "@/actions/inventory-actions";
import { type InventoryLog } from "@/src/schemas/inventory.schema";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Table, Tr, Th, Td } from "@/components/ui/Typography";
import * as Typo from "@/components/ui/Typography";

export default function InventoryLogsDrawer() {
    const [open, setOpen] = useState(false);
    const [logs, setLogs] = useState<InventoryLog[]>([]);
    const [isPending, startTransition] = useTransition();

    const handleOpen = () => {
        setOpen(true);
        startTransition(async () => {
            const res = await getInventoryLogsAction(50);
            if (res.ok && res.data) {
                setLogs(res.data);
            }
        });
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs font-bold" onClick={handleOpen}>
                    Historial de Movimientos
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-2xl p-4 overflow-y-auto">
                <SheetHeader className="pb-4 border-b border-border">
                    {/* asChild delega la etiqueta HTML al elemento hijo <Typo.H3> */}
                    <SheetTitle asChild>
                        <Typo.H3>Auditoría de Movimientos de Stock</Typo.H3>
                    </SheetTitle>
                </SheetHeader>

                <div className="py-4">
                    {isPending ? (
                        <div className="py-12 text-center text-xs text-muted-foreground">
                            Cargando registros de auditoría...
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="py-12 text-center text-xs text-muted-foreground">
                            No hay movimientos registrados en el historial.
                        </div>
                    ) : (
                        <Table>
                            <thead>
                                <Tr>
                                    <Th>Fecha</Th>
                                    <Th>Producto</Th>
                                    <Th>Cambio</Th>
                                    <Th>Stock</Th>
                                    <Th>Motivo</Th>
                                    <Th>Usuario</Th>
                                </Tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => {
                                    const isPositive = log.quantityChange > 0;
                                    return (
                                        <Tr key={log._id}>
                                            <Td>
                                                <Typo.Small>{new Date(log.createdAt).toLocaleString("es-PE")}</Typo.Small>
                                            </Td>
                                            <Td>
                                                <span className="font-bold text-xs uppercase leading-tight">
                                                    {log.productId?.nombre || "Producto eliminado"}
                                                </span>
                                            </Td>
                                            <Td>
                                                <span className={`font-mono font-bold text-xs ${isPositive ? "text-emerald-600" : "text-destructive"}`}>
                                                    {isPositive ? `+${log.quantityChange}` : log.quantityChange}
                                                </span>
                                            </Td>
                                            <Td>
                                                <span className="font-mono text-xs text-muted-foreground">
                                                    {log.previousStock} → <strong className="text-foreground">{log.newStock}</strong>
                                                </span>
                                            </Td>
                                            <Td>
                                                <span className="text-xs">{log.reason}</span>
                                            </Td>
                                            <Td>
                                                <code className="text-[10px] font-mono bg-muted px-1 rounded">{log.actionBy}</code>
                                            </Td>
                                        </Tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}