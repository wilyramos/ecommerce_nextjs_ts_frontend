import { collectionService } from "@/src/services/collection-service";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import DeleteCollectionButton from "@/components/admin/collections/delete-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import CollectionModalWrapper from "@/components/admin/collections/CollectionModalWrapper";

export const dynamic = "force-dynamic";

interface Props {
    searchParams: Promise<{ modal?: string; editId?: string }>;
}

export default async function AdminCollectionsPage({ searchParams }: Props) {
    const { modal, editId } = await searchParams;
    const collections = await collectionService.getAll();

    const collectionToEdit = editId
        ? collections.find((c) => c._id === editId) || null
        : null;

    const isModalOpen = modal === "new" || !!editId;

    return (
        <AdminPageWrapper
            title="Colecciones Temáticas"
            
            actions={
                <Link href="/admin/collections?modal=new">
                    <Button size="sm" className="text-xs font-bold uppercase tracking-wider">
                        + Nueva Colección
                    </Button>
                </Link>
            }
        >
            <div className="border border-border/60 bg-background rounded-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-background-secondary/50">
                        <TableRow className="hover:bg-transparent border-border/60">
                            <TableHead className="font-bold text-xs uppercase text-foreground">Nombre</TableHead>
                            <TableHead className="font-bold text-xs uppercase text-foreground">Slug</TableHead>
                            <TableHead className="font-bold text-xs uppercase text-foreground">Prioridad</TableHead>
                            <TableHead className="font-bold text-xs uppercase text-foreground">Estado</TableHead>
                            <TableHead className="text-right font-bold text-xs uppercase text-foreground">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-border/40">
                        {collections.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground text-xs font-medium">
                                    No hay colecciones creadas actualmente.
                                </TableCell>
                            </TableRow>
                        ) : (
                            collections.map((col) => (
                                <TableRow key={col._id} className="hover:bg-background-secondary/40 transition-colors">
                                    <TableCell className="font-bold text-sm text-foreground flex items-center gap-3">
                                        {col.color && (
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                                        )}
                                        {col.name}
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground font-mono">{col.slug}</TableCell>
                                    <TableCell className="text-sm text-foreground">{col.order}</TableCell>
                                    <TableCell>
                                        <Badge variant={col.isActive ? "default" : "destructive"} className="text-[10px] uppercase">
                                            {col.isActive ? "Activo" : "Inactivo"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="sm" className="text-xs h-8" asChild>
                                            <Link href={`/admin/collections/${col._id}/products`}>Productos</Link>
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-xs h-8" asChild>
                                            <Link href={`/admin/collections?editId=${col._id}`}>Editar</Link>
                                        </Button>
                                        {col.isActive && <DeleteCollectionButton id={col._id} slug={col.slug} />}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

         <CollectionModalWrapper
                isOpen={isModalOpen}
                collectionToEdit={collectionToEdit}
            />
        </AdminPageWrapper>
    );
}