// File: frontend/app/admin/discounts/page.tsx

import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import DiscountFilters from "@/components/admin/discounts/DiscountFilters";
import DiscountTable from "@/components/admin/discounts/DiscountTable";
import PaginationBanner from "@/components/ui/PaginationBanner";
import NewDiscountButton from "@/components/admin/discounts/NewDiscountButton";
import * as Typo from "@/components/ui/Typography";

import { getTokenOptional } from "@/src/auth/dal";
import { discountService } from "@/src/services/discount-service";
import { type DiscountResponse } from "@/src/schemas/discount.schema";

interface PageProps {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        search?: string;
    }>;
}

export default async function AdminDiscountsPage({ searchParams }: PageProps) {
    const token = await getTokenOptional();

    const params = await searchParams;
    const page = Math.max(1, Number(params.page ?? 1));
    const limit = Math.max(1, Number(params.limit ?? 10));
    const search = params.search?.trim() || "";

    let discounts: DiscountResponse[] = [];
    let meta = { total: 0, page: 1, pages: 1, limit };

    try {
        const discountData = await discountService.getAllDiscounts(
            { page, limit, search },
            token
        );
        discounts = discountData.items;
        meta = {
            total: discountData.meta.total ?? 0,
            page: discountData.meta.page ?? page,
            pages: discountData.meta.pages ?? 1,
            limit: discountData.meta.limit ?? limit,
        };
    } catch (error) {
        console.error("[AdminDiscountsPage] Error al cargar la lista de cupones:", error);
    }

    return (
        <AdminPageWrapper
            title="Cupones y Descuentos"
            breadcrumbItems={[{ label: "Ventas", href: "/admin/orders-v2" }]}
            breadcrumbCurrent="Cupones"
            showBackButton={true}
            actions={<NewDiscountButton />}
        >
            <div className="space-y-4 text-foreground">
                <DiscountFilters />

                <div className="border border-border rounded-lg bg-card p-4 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-border/60">
                        <Typo.H3>Cupones Registrados</Typo.H3>
                        <Typo.Small className="text-muted-foreground font-mono">
                            {meta.total} {meta.total === 1 ? "Resultado" : "Resultados"}
                        </Typo.Small>
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