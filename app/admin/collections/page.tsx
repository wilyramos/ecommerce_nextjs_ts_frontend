// File: frontend/app/admin/collections/page.tsx
import { collectionService } from "@/src/services/collection-service";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CollectionModalWrapper from "@/components/admin/collections/CollectionModalWrapper";
import { Collection } from "@/src/schemas/collection.schema";
import { CollectionTable } from "@/components/admin/collections/CollectionTable";

interface Props {
    searchParams: Promise<{ modal?: string; editId?: string }>;
}

function PromotionDates({ col }: { col: Collection }) {
    if (col.type !== "promotion" || (!col.startsAt && !col.endsAt)) return null;

    const now = new Date();
    const startsAt = col.startsAt ? new Date(col.startsAt) : null;
    const endsAt = col.endsAt ? new Date(col.endsAt) : null;

    const isLive = startsAt && endsAt && startsAt <= now && endsAt >= now;
    const isExpired = endsAt && endsAt < now;
    const isPending = startsAt && startsAt > now;

    const fmt = (d: Date) => d.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });

    return (
        <div className="flex flex-col gap-0.5 mt-0.5">
            {startsAt && (
                <span className="text-[10px] text-muted-foreground font-mono">
                    {fmt(startsAt)} → {endsAt ? fmt(endsAt) : "—"}
                </span>
            )}
            {isLive && <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">● En curso</span>}
            {isExpired && <span className="text-[10px] font-bold text-destructive uppercase tracking-wider">● Vencida</span>}
            {isPending && <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">● Programada</span>}
        </div>
    );
}

export default async function AdminCollectionsPage({ searchParams }: Props) {
    const { modal, editId } = await searchParams;
    const collections = await collectionService.getAll();

    const collectionToEdit = editId
        ? collections.find((c) => c._id === editId) ?? null
        : null;

    const isModalOpen = modal === "new" || !!editId;

    return (
        <AdminPageWrapper
            title="Colecciones"
            actions={
                <Link href="/admin/collections?modal=new">
                    <Button size="sm" className="text-xs font-bold uppercase tracking-wider bg-action-cta hover:bg-action-cta-hover text-action-cta-foreground">
                        + Nueva Colección
                    </Button>
                </Link>
            }
        >
            <div className="border border-border/60 bg-background rounded-sm overflow-hidden">
                <CollectionTable
                    collections={collections}
                    PromotionDates={PromotionDates}
                />
            </div>

            <CollectionModalWrapper
                isOpen={isModalOpen}
                collectionToEdit={collectionToEdit}
            />
        </AdminPageWrapper>
    );
}