// File: frontend/components/admin/inventory/InventoryTable.tsx

import Image from "next/image";
import { Table, Tr, Th, Td } from "@/components/ui/Typography";
import { InventoryItem } from "@/src/schemas/inventory.schema";
import AdjustStockModal from "./AdjustStockModal";
import InventoryStatusBadge from "./InventoryStatusBadge";

interface Props {
    items: InventoryItem[];
}

export default function InventoryTable({ items }: Props) {
    if (items.length === 0) {
        return (
            <div className="py-12 text-center text-muted-foreground text-xs">
                No se encontraron registros de inventario con los filtros aplicados.
            </div>
        );
    }

    return (
        <Table>
            <thead>
                <Tr>
                    <Th>Producto / Variante</Th>
                    <Th>SKU</Th>
                    <Th>Precio Unitario</Th>
                    <Th>Stock Disponible</Th>
                    <Th>Estado</Th>
                    <Th className="text-right">Acción</Th>
                </Tr>
            </thead>
            <tbody>
                {items.map((item, idx) => (
                    <Tr key={`${item.productId}_${item.variantId || idx}`}>
                        <Td className="flex items-center gap-3">
                            <div className="relative w-9 h-9 rounded bg-white border border-border shrink-0 flex items-center justify-center overflow-hidden p-0.5">
                                <Image
                                    src={item.imagen || "/placeholder.png"}
                                    alt={item.nombre}
                                    width={32}
                                    height={32}
                                    className="object-contain"
                                    unoptimized
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-foreground text-xs uppercase leading-tight">
                                    {item.nombre}
                                </span>
                                {item.hasVariants && (
                                    <span className="text-[10px] text-muted-foreground font-semibold">
                                        Variante
                                    </span>
                                )}
                            </div>
                        </Td>
                        <Td>
                            <code className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded border border-border/40 select-all">
                                {item.sku}
                            </code>
                        </Td>
                        <Td>
                            <span className="font-mono text-xs font-bold text-foreground">
                                S/ {item.price.toFixed(2)}
                            </span>
                        </Td>
                        <Td>
                            <span className="font-mono font-black text-xs text-foreground">
                                {item.stock} un.
                            </span>
                        </Td>
                        <Td>
                            <InventoryStatusBadge stock={item.stock} />
                        </Td>
                        <Td className="text-right">
                            <AdjustStockModal item={item} />
                        </Td>
                    </Tr>
                ))}
            </tbody>
        </Table>
    );
}