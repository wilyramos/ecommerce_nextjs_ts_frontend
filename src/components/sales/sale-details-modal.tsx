"use client";

import * as React from "react";
import { format } from "date-fns";
import { Eye, Receipt, Printer, RotateCcw, AlertTriangle, FileText } from "lucide-react";
import { Sale } from "@/src/schemas/sale.schema";
import { refundSaleAction, getSaleDetailsAction } from "@/src/actions/sale-actions";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SpinnerLoading from "@/components/ui/SpinnerLoading";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Props {
    sale: Sale;
}

export function SaleDetailsModal({ sale: initialSale }: Props) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [sale, setSale] = React.useState<Sale>(initialSale);
    const [isLoading, setIsLoading] = React.useState(false);

    const [isPending, startTransition] = React.useTransition();
    const [showRefundConfirm, setShowRefundConfirm] = React.useState(false);
    const [refundReason, setRefundReason] = React.useState("Devolución solicitada por cliente");

    React.useEffect(() => {
        if (isOpen && initialSale._id) {
            setIsLoading(true);
            getSaleDetailsAction(initialSale._id)
                .then((result) => {
                    if (result.success && result.data) {
                        setSale(result.data);
                    } else {
                        toast.error(result.message || "Error al obtener los nombres detallados del producto");
                    }
                })
                .catch(() => {
                    toast.error("Error de red al intentar cargar detalles del producto");
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else if (!isOpen) {
            setSale(initialSale);
        }
    }, [isOpen, initialSale]);

    const handleRefund = async () => {
        startTransition(async () => {
            const result = await refundSaleAction(sale._id!, refundReason);
            if (result.success) {
                setShowRefundConfirm(false);
                toast.success("Venta anulada exitosamente");
                setSale((prev) => ({ ...prev, status: "REFUNDED" }));
            } else {
                toast.error("Error al anular la venta: " + result.message);
            }
        });
    };

    const isRefundable = sale.status === "COMPLETED";

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Eye className="size-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Receipt className="size-5" />
                            Detalle de Venta: {sale.receiptNumber}
                        </DialogTitle>
                        <DialogDescription>
                            Realizada el {sale.createdAt ? format(new Date(sale.createdAt), "dd/MM/yyyy HH:mm") : "-"} por {typeof sale.employee === 'object' ? sale.employee?.nombre : 'Empleado'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4 max-h-[60vh] overflow-y-auto pr-2 relative">
                        {isLoading && (
                            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                                <SpinnerLoading />
                            </div>
                        )}

                        {/* Datos del Cliente */}
                        <div className="grid gap-2 border-b pb-4">
                            <h4 className="text-sm font-semibold">Información del Cliente</h4>
                            <div className="grid grid-cols-2 text-sm">
                                <span className="text-[var(--color-text-secondary)]">Nombre:</span>
                                <span>{sale.customerSnapshot?.nombre || "Cliente Varios"}</span>
                                <span className="text-[var(--color-text-secondary)]">Documento:</span>
                                <span>{sale.customerSnapshot?.numeroDocumento || "-"}</span>
                            </div>
                        </div>

                        {/* Listado de Productos */}
                        <div className="grid gap-2">
                            <h4 className="text-sm font-semibold">Productos</h4>
                            <div className="rounded-md border border-[var(--color-border-default)] overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-[var(--color-bg-secondary)]">
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="px-4 py-2 text-left h-auto">Item</TableHead>
                                            <TableHead className="px-4 py-2 text-center h-auto">Cant.</TableHead>
                                            <TableHead className="px-4 py-2 text-right h-auto">Precio</TableHead>
                                            <TableHead className="px-4 py-2 text-right h-auto">Subtotal</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sale.items.map((item, idx) => (
                                            <TableRow key={idx} className="hover:bg-transparent border-border-default">
                                                <TableCell className="px-4 py-2">
                                                    {typeof item.product === 'object' ? item.product.nombre : 'Producto'}
                                                </TableCell>
                                                <TableCell className="px-4 py-2 text-center">{item.quantity}</TableCell>
                                                <TableCell className="px-4 py-2 text-right">S/ {item.price.toFixed(2)}</TableCell>
                                                <TableCell className="px-4 py-2 text-right">S/ {(item.price * item.quantity).toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* Totales */}
                        <div className="flex flex-col items-end gap-1 px-4">
                            <div className="flex w-full max-w-[200px] justify-between text-sm">
                                <span className="text-[var(--color-text-secondary)]">Subtotal:</span>
                                <span>S/ {sale.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex w-full max-w-[200px] justify-between font-bold text-lg border-t border-[var(--color-border-default)] mt-1 pt-1">
                                <span>Total:</span>
                                <span>S/ {sale.totalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Historial de Auditoría */}
                        <div className="grid gap-2 bg-[var(--color-bg-secondary)] p-3 rounded-md">
                            <h4 className="text-xs font-semibold uppercase text-[var(--color-text-tertiary)] tracking-wider">Historial de Auditoría</h4>
                            {sale.statusHistory?.map((history, idx) => (
                                <div key={idx} className="flex justify-between text-xs">
                                    <span className={history.status === 'REFUNDED' ? 'text-red-500 font-bold' : 'font-medium'}>
                                        {history.status}
                                    </span>
                                    <span className="text-[var(--color-text-tertiary)]">{format(new Date(history.changedAt), "dd/MM/yyyy HH:mm:ss")}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        {isRefundable && (
                            <Button
                                variant="outline"
                                className="text-red-500 hover:bg-red-50 hover:text-red-600 border-red-200"
                                onClick={() => setShowRefundConfirm(true)}
                            >
                                <RotateCcw className="size-4 mr-2" />
                                Anular Venta
                            </Button>
                        )}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <Printer className="size-4 mr-2" />
                                    Imprimir
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => window.open(`/api/sales/${sale._id}/ticket`, '_blank')}>
                                    <Printer className="size-4 mr-2 text-text-secondary" />
                                    <span>Ticket 80mm</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => window.open(`/api/sales/${sale._id}/pdf`, '_blank')}>
                                    <FileText className="size-4 mr-2 text-text-secondary" />
                                    <span>Documento A4</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* MODAL DE CONFIRMACIÓN DE ANULACIÓN */}
            <Dialog open={showRefundConfirm} onOpenChange={setShowRefundConfirm}>
                <DialogContent className="sm:max-w-[400px] border-red-200">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="size-5" />
                            Confirmar Anulación
                        </DialogTitle>
                        <DialogDescription>
                            Esta acción restablecerá el stock de los productos y ajustará el balance de caja actual.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-3">
                        <label className="text-sm font-medium">Motivo de la anulación:</label>
                        <Input
                            value={refundReason}
                            onChange={(e) => setRefundReason(e.target.value)}
                            placeholder="Ej: Error en cobro, devolución..."
                        />
                    </div>

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setShowRefundConfirm(false)} disabled={isPending}>
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleRefund}
                            disabled={isPending || !refundReason}
                        >
                            {isPending ? <SpinnerLoading /> : <RotateCcw className="size-4 mr-2" />}
                            Confirmar Anulación
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}