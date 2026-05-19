import { collectionService } from "@/src/services/collection-service";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { notFound } from "next/navigation";
import AssignedProductsList from "@/components/admin/collections/AssignedProductsList";
import ProductAssignmentForm from "@/components/admin/collections/ProductAssignmentForm";

export const dynamic = "force-dynamic";

export default async function CollectionProductsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const collections = await collectionService.getAll();
    const collection = collections.find((c) => c._id === id);
    
    if (!collection) notFound();

    // Obtenemos los productos asignados
    const { products: assignedProducts } = await collectionService.getBySlug(collection.slug, 1, 100);

    return (
        <AdminPageWrapper
            title={`Productos: ${collection.name}`}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="h-fit">
                    <CardHeader><CardTitle>Vincular Productos</CardTitle></CardHeader>
                    <CardContent>
                        <ProductAssignmentForm collectionId={id} slug={collection.slug} />
                    </CardContent>
                </Card>

                <div className="lg:col-span-2">
                    <AssignedProductsList 
                        products={assignedProducts} 
                        collectionId={id} 
                        slug={collection.slug} 
                    />
                </div>
            </div>
        </AdminPageWrapper>
    );
}