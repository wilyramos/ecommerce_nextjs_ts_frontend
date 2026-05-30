import { collectionService } from "@/src/services/collection-service";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CollectionTable } from "@/components/admin/collections/CollectionTable";

export default async function AdminCollectionsPage() {
    const collections = await collectionService.getAll();

    return (
        <AdminPageWrapper
            title="Colecciones"
            actions={
                <Link href="/admin/collections/new">
                    <Button size="sm" className="text-xs font-bold uppercase tracking-wider bg-action-cta hover:bg-action-cta-hover text-action-cta-foreground">
                        + Nueva Colección
                    </Button>
                </Link>
            }
        >
            <div className="border border-border/60 bg-background rounded-sm overflow-hidden">
                <CollectionTable initialCollections={collections} />
            </div>
        </AdminPageWrapper>
    );
}