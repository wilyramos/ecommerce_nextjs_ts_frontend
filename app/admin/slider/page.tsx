// File: app/(admin)/admin/slider/page.tsx
import { SliderService } from "@/src/services/slider-service";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import NuevoBanner from "@/components/admin/slider/NuevoBanner";
import SliderFilters from "@/components/admin/slider/SliderFilters";
import SliderTable from "@/components/admin/slider/SliderTable";
import Pagination from "@/components/ui/Pagination";
import { SliderContentTypeEnum } from "@/src/schemas/slider.schema";
import type { SliderContentType } from "@/src/services/slider-service";

interface SearchParams {
    page?: string;
    limit?: string;
    search?: string;
    isActive?: string;
    contentType?: string;
}

interface PageProps {
    searchParams: Promise<SearchParams>;
}

export default async function SliderPage({ searchParams }: PageProps) {
    const params = await searchParams;

    const page = Math.max(1, Number(params.page ?? 1));
    const limit = Math.max(1, Number(params.limit ?? 10));
    const search = params.search?.trim() || undefined;
    const isActive =
        params.isActive === "true" ? true :
            params.isActive === "false" ? false :
                undefined;
    const rawContentType = params.contentType;
    const contentType: SliderContentType | undefined =
        SliderContentTypeEnum.options.includes(rawContentType as SliderContentType)
            ? (rawContentType as SliderContentType)
            : undefined;

    const { data: banners, total, pages } = await SliderService.getAllAdmin({
        page,
        limit,
        search,
        isActive,
        contentType,
    });

    return (
        <AdminPageWrapper
            title="Slider Banners"
            breadcrumbItems={[{ label: "Marketing", href: "/admin/marketing" }]}
            breadcrumbCurrent="Slider"
            showBackButton={false}
            actions={<NuevoBanner />}
        >
            <div className="space-y-5">
                <SliderFilters
                    filters={{
                        search: params.search,
                        isActive: params.isActive,
                        contentType: params.contentType,
                    }}
                />

                <SliderTable banners={banners} />

                {total > 0 && (
                    <div className="flex flex-col items-center gap-3 pt-4 border-t border-[var(--color-border-subtle)]">
                        <p className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider">
                            Mostrando {banners.length} de {total} banners
                        </p>
                        <Pagination
                            currentPage={page}
                            totalPages={pages}
                            limit={limit}
                            pathname="/admin/slider"
                        />
                    </div>
                )}
            </div>
        </AdminPageWrapper>
    );
}