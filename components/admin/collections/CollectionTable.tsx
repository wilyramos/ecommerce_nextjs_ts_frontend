// File: frontend/components/admin/collections/CollectionTable.tsx
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Collection, CollectionType } from "@/src/schemas/collection.schema";
import { CollectionActionsMenu } from "./CollectionActionsMenu";

interface CollectionTableProps {
    collections: Collection[];
    PromotionDates: React.ComponentType<{ col: Collection }>;
}

const COLLECTION_TYPE_LABELS: Record<CollectionType, string> = {
    promotion: "Promoción",
    theme:     "Temática",
    editorial: "Editorial",
    seasonal:  "Temporada",
};

const COLLECTION_TYPE_VARIANTS: Record<CollectionType, "default" | "secondary" | "outline" | "destructive"> = {
    promotion: "destructive",
    theme:     "default",
    editorial: "secondary",
    seasonal:  "outline",
};

export function CollectionTable({ collections, PromotionDates }: CollectionTableProps) {
    if (collections.length === 0) {
        return (
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell className="h-24 text-center text-muted-foreground text-xs font-medium">
                            No hay colecciones creadas actualmente.
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        );
    }

    return (
        <Table>
            <TableHeader className="bg-background-secondary/50">
                <TableRow className="hover:bg-transparent border-border/60">
                    <TableHead className="font-bold text-xs uppercase text-foreground">Nombre</TableHead>
                    <TableHead className="font-bold text-xs uppercase text-foreground">Tipo</TableHead>
                    <TableHead className="font-bold text-xs uppercase text-foreground">Slug</TableHead>
                    <TableHead className="font-bold text-xs uppercase text-foreground">Badge</TableHead>
                    <TableHead className="font-bold text-xs uppercase text-foreground">Orden</TableHead>
                    <TableHead className="font-bold text-xs uppercase text-foreground">Estado</TableHead>
                    <TableHead className="text-right font-bold text-xs uppercase text-foreground w-[60px]">Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/40">
                {collections.map((col) => (
                    <TableRow key={col._id} className="hover:bg-background-secondary/40 transition-colors">
                        <TableCell className="font-bold text-sm text-foreground">
                            <div className="flex items-center gap-2">
                                {col.color && (
                                    <span
                                        className="w-2 h-2 rounded-full shrink-0"
                                        style={{ backgroundColor: col.color }}
                                    />
                                )}
                                {col.icon && (
                                    <span className="text-base leading-none">{col.icon}</span>
                                )}
                                <div>
                                    <span>{col.name}</span>
                                    <PromotionDates col={col} />
                                </div>
                            </div>
                        </TableCell>

                        <TableCell>
                            <Badge
                                variant={COLLECTION_TYPE_VARIANTS[col.type]}
                                className="text-[10px] uppercase tracking-wider"
                            >
                                {COLLECTION_TYPE_LABELS[col.type]}
                            </Badge>
                        </TableCell>

                        <TableCell className="text-xs text-muted-foreground font-mono">
                            {col.slug}
                        </TableCell>

                        <TableCell>
                            {col.badgeLabel ? (
                                <span
                                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm"
                                    style={{
                                        backgroundColor: col.badgeColor ?? "#ef4444",
                                        color: "#fff",
                                    }}
                                >
                                    {col.badgeLabel}
                                </span>
                              ) : (
                                <span className="text-muted-foreground text-xs">—</span>
                            )}
                        </TableCell>

                        <TableCell className="text-sm text-foreground">
                            {col.order}
                        </TableCell>

                        <TableCell>
                            <Badge
                                variant={col.isActive ? "default" : "destructive"}
                                className="text-[10px] uppercase"
                            >
                                {col.isActive ? "Activo" : "Inactivo"}
                            </Badge>
                        </TableCell>

                        <TableCell className="text-right">
                            <CollectionActionsMenu 
                                id={col._id} 
                                slug={col.slug} 
                                isActive={col.isActive} 
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}