// File: frontend/app/admin/discounts/page.tsx
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import { discountService } from "@/src/services/discount-service";
import * as Typo from "@/components/ui/Typography";
import DiscountFilters from "@/components/admin/discounts/DiscountFilters";
import CreateDiscountModal from "@/components/admin/discounts/CreateDiscountModal";
import DiscountTable from "@/components/admin/discounts/DiscountTable";
import PaginationBanner from "@/components/ui/PaginationBanner";

interface PageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        search?: string;
    }>;
}

export default async function AdminDiscountsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const search = params.search || "";

    let discountData;
    try {
        discountData = await discountService.getAllDiscounts({
            page,
            limit,
            search,
        });
    } catch (error) {
        console.error("Error al cargar cupones:", error);
        discountData = {
            data: [],
            meta: { total: 0, page: 1, pages: 1, limit },
        };
    }

    const { data: discounts, meta } = discountData;

    return (
        <AdminPageWrapper
            title="Cupones y Descuentos"
            breadcrumbItems={[{ label: "Ventas", href: "/admin/orders" }]}
            breadcrumbCurrent="Cupones"
            showBackButton={true}
            actions={<CreateDiscountModal />}
        >
            <div className="space-y-4 text-foreground">
                <DiscountFilters />

                <div className="border border-border rounded-lg bg-card p-4 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-border/60">
                        <Typo.H3>Cupones Registrados</Typo.H3>
                        <Typo.Small>{meta.total} Resultados</Typo.Small>
                    </div>

                    <DiscountTable discounts={discounts} />

                    {discounts.length > 0 && (
                        <PaginationBanner
                            currentPage={meta.page}
                            totalPages={meta.pages}
                            limit={meta.limit}
                            totalItems={meta.total}
                            itemsShown={discounts.length}
                            pathname="/admin/discounts"
                        />
                    )}
                </div>
            </div>
        </AdminPageWrapper>
    );
}