// File: frontend/components/admin/discounts/DiscountTable.tsx

"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { type DiscountResponse } from "@/src/schemas/discount.schema";
import DiscountToggleStatusButton from "./DiscountToggleStatusButton";
import DiscountDeleteButton from "./DiscountDeleteButton";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";

interface Props {
    discounts: DiscountResponse[];
}

export default function DiscountTable({ discounts }: Props) {
    const formatValor = (disc: DiscountResponse) => {
        if (disc.type === "BUY_X_GET_Y") {
            const buy = disc.bxgyConfig?.buyQuantity ?? "X";
            const get = disc.bxgyConfig?.getQuantity ?? "Y";
            return `Compra ${buy} Obtén ${get}`;
        }
        if (disc.type === "FREE_SHIPPING") {
            return "Envío Gratis";
        }
        if (disc.type === "PERCENTAGE") {
            return `${disc.value}%`;
        }
        return `S/ ${disc.value.toFixed(2)}`;
    };

    if (discounts.length === 0) {
        return (
            <div className="py-12 text-center text-muted-foreground text-sm">
                No se encontraron cupones o promociones registradas.
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Promoción / Aplicación</TableHead>
                    <TableHead>Tipo / Valor</TableHead>
                    <TableHead>Monto Mínimo</TableHead>
                    <TableHead>Usos</TableHead>
                    <TableHead>Vigencia</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {discounts.map((disc) => {
                    const isAutomatic = disc.appliesVia === "AUTOMATIC";

                    return (
                        <TableRow key={disc._id}>
                            {/* Promoción y Método de aplicación */}
                            <TableCell>
                                <div className="flex flex-col space-y-1">
                                    <span className="font-semibold text-sm text-foreground">
                                        {disc.title}
                                    </span>

                                    <div className="flex items-center gap-2">
                                        {isAutomatic ? (
                                            <Badge variant="secondary" className="text-[10px]">
                                                Automático
                                            </Badge>
                                        ) : (
                                            <code className="font-mono text-xs font-bold bg-muted px-1.5 py-0.5 rounded text-foreground select-all">
                                                {disc.code}
                                            </code>
                                        )}
                                        {disc.description && (
                                            <span className="text-xs text-muted-foreground line-clamp-1">
                                                {disc.description}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </TableCell>

                            {/* Valor del descuento */}
                            <TableCell>
                                <span className="font-mono font-bold text-xs">
                                    {formatValor(disc)}
                                </span>
                            </TableCell>

                            {/* Condición mínima de compra */}
                            <TableCell>
                                <span className="text-xs font-mono">
                                    {disc.minPurchaseAmount > 0
                                        ? `Min S/ ${disc.minPurchaseAmount.toFixed(2)}`
                                        : "Sin mínimo"}
                                </span>
                            </TableCell>

                            {/* Contador de usos */}
                            <TableCell>
                                <span className="font-mono text-xs">
                                    {disc.currentUsageCount} / {disc.usageLimitTotal ?? "∞"}
                                </span>
                            </TableCell>

                            {/* Fechas de vigencia */}
                            <TableCell>
                                <div className="flex flex-col text-[11px] font-mono text-muted-foreground">
                                    <span>
                                        Desde: {new Date(disc.startDate).toLocaleDateString("es-PE")}
                                    </span>
                                    <span>
                                        Hasta:{" "}
                                        {disc.endDate
                                            ? new Date(disc.endDate).toLocaleDateString("es-PE")
                                            : "Sin expiración"}
                                    </span>
                                </div>
                            </TableCell>

                            {/* Estado activo/inactivo */}
                            <TableCell>
                                <Badge variant={disc.isActive ? "default" : "outline"}>
                                    {disc.isActive ? "Activo" : "Inactivo"}
                                </Badge>
                            </TableCell>


                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                    {/* Navegación a la página de detalle propia */}
                                    <Link href={`/admin/discounts/${disc._id}`}>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                            title="Ver detalle de la promoción"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                        </Button>
                                    </Link>

                                    <DiscountToggleStatusButton
                                        id={disc._id}
                                        isActive={disc.isActive}
                                    />
                                    <DiscountDeleteButton
                                        id={disc._id}
                                        title={disc.title}
                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}