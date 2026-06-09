"use client";

import { Sale } from "@/src/schemas/sale.schema";
import { format } from "date-fns";
import { SaleDetailsModal } from "./sale-details-modal";
import { cn } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const statusStyles: Record<string, string> = {
    COMPLETED: "bg-success/10 text-success border-success/20",
    REFUNDED: "bg-error/10 text-error border-error/20",
    QUOTE: "bg-accent-warm-light text-accent-warm-hover border-accent-warm/30",
    CANCELED: "bg-bg-tertiary text-text-tertiary border-border-default",
    PARTIALLY_REFUNDED: "bg-warning/10 text-warning border-warning/20",
};

export function SalesTable({ initialData }: { initialData: Sale[] }) {
    return (
        <div className="w-full overflow-x-auto ">
            <Table className="w-full text-sm text-left">
                <TableHeader className="bg-bg-secondary border-b border-border-default">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="px-4 py-3 font-medium text-text-secondary h-auto">Fecha</TableHead>
                        <TableHead className="px-4 py-3 font-medium text-text-secondary h-auto">Comprobante</TableHead>
                        <TableHead className="px-4 py-3 font-medium text-text-secondary h-auto">Cliente</TableHead>
                        <TableHead className="px-4 py-3 font-medium text-text-secondary h-auto">Método</TableHead>
                        <TableHead className="px-4 py-3 font-medium text-text-secondary h-auto">Estado</TableHead>
                        <TableHead className="px-4 py-3 font-medium text-text-secondary text-right h-auto">Total</TableHead>
                        <TableHead className="px-4 py-3 font-medium text-text-secondary text-center h-auto">Detalle</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="divide-y">
                    {initialData.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={7} className="px-4 py-10 text-center text-text-tertiary bg-bg-primary">
                                No se encontraron ventas con los filtros aplicados.
                            </TableCell>
                        </TableRow>
                    ) : (
                        initialData.map((sale) => (
                            <TableRow 
                                key={sale._id} 
                                className="hover:bg-bg-tertiary transition-colors border-border-default"
                            >
                                <TableCell className="px-4 py-3 text-text-secondary">
                                    {format(new Date(sale.createdAt!), "dd/MM/yy HH:mm")}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-xs font-bold text-text-primary">
                                    {sale.receiptNumber}
                                </TableCell>
                                <TableCell className="px-4 py-3">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-text-primary">
                                            {sale.customerSnapshot?.nombre || "Cliente Varios"}
                                        </span>
                                        <span className="text-text-tertiary text-xs">
                                            {sale.customerSnapshot?.numeroDocumento || "S/D"}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-xs">
                                    <span className="bg-bg-tertiary px-2 py-0.5 rounded border border-border-subtle text-text-primary font-medium">
                                        {sale.paymentMethod}
                                    </span>
                                </TableCell>
                                <TableCell className="px-4 py-3">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-full text-[10px] font-bold border block w-fit tracking-wide uppercase",
                                        statusStyles[sale.status] || "bg-bg-tertiary text-text-secondary border-border-default"
                                    )}>
                                        {sale.status}
                                    </span>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-right font-bold text-text-primary">
                                    S/ {sale.totalPrice.toFixed(2)}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-center">
                                    <SaleDetailsModal sale={sale} />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}