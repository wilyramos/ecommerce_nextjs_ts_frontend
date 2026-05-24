// File: frontend/app/admin/collections/[id]/products/page.tsx

import { collectionService } from "@/src/services/collection-service";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import { notFound } from "next/navigation";
import AssignedProductsList from "@/components/admin/collections/AssignedProductsList";
import ProductAssignmentPanel from "@/components/admin/collections/ProductAssignmentPanel";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

const COLLECTION_TYPE_LABELS: Record<string, string> = {
    promotion: "Promoción",
    theme:     "Temática",
    editorial: "Editorial",
    seasonal:  "Temporada",
};

interface Props {
    params:       Promise<{ id: string }>;
    searchParams: Promise<{ page?: string }>;
}

export default async function CollectionProductsPage({ params, searchParams }: Props) {
    const { id }   = await params;
    const { page } = await searchParams;

    const currentPage = Math.max(parseInt(page || "1"), 1);
    const limit       = 5;
    const pathname    = `/admin/collections/${id}/products`;

    const [collection, { products, pagination }] = await Promise.all([
        collectionService.getById(id),
        collectionService.getProductsPaginated(id, currentPage, limit),
    ]);

    if (!collection) notFound();

    const assignedIds = products.map((p) => p._id);

    return (
        <AdminPageWrapper
            title={`Productos: ${collection.name}`}
            actions={
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                        {COLLECTION_TYPE_LABELS[collection.type] ?? collection.type}
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-xs" asChild>
                        <Link href={`/admin/collections/${id}/edit`}>
                            Editar colección
                        </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs" asChild>
                        <Link href="/admin/collections">← Volver</Link>
                    </Button>
                </div>
            }
        >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                <div className="lg:col-span-2 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Agregar productos
                    </p>
                    <ProductAssignmentPanel
                        collectionId={id}
                        slug={collection.slug}
                        assignedIds={assignedIds}
                    />
                </div>

                <div className="lg:col-span-3 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Productos asignados
                    </p>
                    <AssignedProductsList
                        products={products}
                        collectionId={id}
                        slug={collection.slug}
                        pagination={pagination}
                        currentPage={currentPage}
                        pathname={pathname}
                    />
                </div>

            </div>
        </AdminPageWrapper>
    );
}