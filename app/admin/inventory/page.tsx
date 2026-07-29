// File: frontend/app/admin/inventory/page.tsx

import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import { inventoryService } from "@/src/services/inventory-service";
import InventoryFilters from "@/components/admin/inventory/InventoryFilters";
import InventoryLogsDrawer from "@/components/admin/inventory/InventoryLogsDrawer";
import InventoryTable from "@/components/admin/inventory/InventoryTable";
import PaginationBanner from "@/components/ui/PaginationBanner";

interface PageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        filter?: "low" | "out" | "all";
        search?: string;
    }>;
}

export default async function AdminInventoryPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const filter = params.filter || "all";
    const search = params.search || "";

    let inventoryData;
    try {
        inventoryData = await inventoryService.getInventory({
            page,
            limit,
            filter,
            search,
        });
    } catch (error) {
        console.error("Error al cargar inventario:", error);
        inventoryData = {
            data: [],
            meta: { total: 0, page: 1, pages: 1, limit },
        };
    }

    const { data: items, meta } = inventoryData;

    return (
        <AdminPageWrapper
            title="Inventario y Stock"
            showBackButton={true}
            actions={<InventoryLogsDrawer />}
        >
            <div className="space-y-4 text-foreground">
                <InventoryFilters />

                <div className="">

                    <InventoryTable items={items} />

                    {items.length > 0 && (
                        <PaginationBanner
                            currentPage={meta.page}
                            totalPages={meta.pages}
                            limit={meta.limit}
                            totalItems={meta.total}
                            itemsShown={items.length}
                            pathname="/admin/inventory"
                        />
                    )}
                </div>
            </div>
        </AdminPageWrapper>
    );
}